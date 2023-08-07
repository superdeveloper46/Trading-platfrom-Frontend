import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Place } from "react-tooltip";
import OtpInput from "react-otp-input";
import { FormattedRelativeTime, useIntl } from "react-intl";
import styles from "styles/components/SecureToken.module.scss";
import cn from "classnames";
import dayjs from "utils/dayjs";
import messages from "messages/common";
import mailImg from "assets/images/auth/mail.svg";
import authenticatorAppImg from "assets/images/auth/google_authenticator.svg";
import Button from "components/UI/Button";
import Spinner from "components/UI/Spinner";
import { SecureTokenTypeEnum, SecureTokenVariantEnum, ISecureTokenRes } from "types/secureToken";
import usePreviousState from "hooks/usePreviousState";
import useWindowSize from "hooks/useWindowSize";
import ApiClient from "helpers/ApiClient";
import Tooltip from "./UI/Tooltip";

interface Props {
	onSuccess: (data: ISecureTokenRes | any) => void;
	onSlugChange?: (slug: string) => void;
	fullSize?: boolean;
	helpText?: string;
	length?: number;
	pincodeTriesleft?: number | null;
	shouldAutoFocus?: boolean;
	variant: SecureTokenVariantEnum;
	buttonLabel?: string;
	requestUrl: string;
	resendRequestUrl?: string;
	delay?: string;
	error?: string;
	type?: SecureTokenTypeEnum;
	hintPosition?: Place;
	onResponse?: (data: ISecureTokenRes | any) => void;
	onError?: (err?: any) => void;
	disabledLabel?: boolean;
	body?: Record<string, unknown>;
	emailAssetName?: string;
	authenticatorAssetName?: string;
}

const SecureToken: React.FC<Props> = React.memo(
	({
		fullSize,
		onSuccess,
		onSlugChange,
		helpText,
		pincodeTriesleft = null,
		resendRequestUrl,
		shouldAutoFocus = false,
		variant,
		buttonLabel,
		requestUrl,
		length = 6,
		type = "",
		delay = "",
		error = "",
		hintPosition = "top",
		disabledLabel = false,
		body = {},
		emailAssetName,
		authenticatorAssetName,
		onResponse,
		onError,
	}) => {
		const [token, setToken] = useState<string>("");
		const [showOtp, setShowOtp] = useState<boolean>(true); // for reset focus index
		const [tokenType, setTokenType] = useState<string>(type);
		const [delayDate, setDelayDate] = useState<string>(delay);
		const [tokenError, setTokenError] = useState<string>(error);
		const [triesLeft, setTriesLeft] = useState<number | null>(pincodeTriesleft ?? 3);
		const [delayTime, setDelayTime] = useState<number>(0);
		const [isLoading, setIsLoading] = useState<boolean>(false);
		const delayInterval = useRef<NodeJS.Timeout>(null);
		const prevDelayDate = usePreviousState(delayDate);
		const { formatMessage } = useIntl();
		const { tablet } = useWindowSize();

		useEffect(() => {
			setTokenError(error);
		}, [error]);

		useEffect(() => {
			setTokenType(type);
		}, [type]);

		useEffect(() => {
			setDelayDate(delay);
		}, [delay]);

		useEffect(() => {
			setTriesLeft(pincodeTriesleft ?? 3);
		}, [pincodeTriesleft]);

		useEffect(() => {
			setShowOtp(false);
			const timeout = setTimeout(() => {
				setShowOtp(true);
			}, 0);
			return () => {
				clearTimeout(timeout);
			};
		}, [tokenType, tokenError]);

		useEffect(() => {
			if (
				token.length === length &&
				(variant === SecureTokenVariantEnum.SPINNER || tokenType === SecureTokenTypeEnum.OTPCODE)
			) {
				sendRequest();
			}
		}, [token, tokenType]);

		const additionalInfo = useMemo(() => {
			switch (tokenType) {
				case SecureTokenTypeEnum.OTPCODE:
					return authenticatorAssetName;
				case SecureTokenTypeEnum.PINCODE:
					return emailAssetName;
				default:
					return "";
			}
		}, [emailAssetName, authenticatorAssetName, tokenType]);

		const processTokenRes = (res: ISecureTokenRes) => {
			let nextDelayDate = delayDate;
			let nextTokenType = tokenType;
			let nextTriesLeft = null;

			if (res.is_totp_required && !res.is_totp_ok) {
				nextTokenType = SecureTokenTypeEnum.OTPCODE;
				nextDelayDate = res.totp_timeout || res.delay || "";
			} else if (res.is_pincode_required && !res.is_pincode_ok) {
				nextTokenType = SecureTokenTypeEnum.PINCODE;
				nextDelayDate = res.pincode_timeout || res.delay || "";
				nextTriesLeft = res.pincode_tries_left;
			} else {
				nextDelayDate = res.delay ?? "";
			}

			setTokenError("");
			setToken("");
			setDelayDate(nextDelayDate);
			setTokenType(nextTokenType);
			setTriesLeft(nextTriesLeft);
		};

		const handleAuthRes = (res: ISecureTokenRes): void => {
			setToken("");
			if (res.is_ok || res.done) {
				onSuccess(res);
			} else if (onResponse) {
				onResponse(res);
			} else {
				processTokenRes(res);
				if (res.slug && onSlugChange) {
					onSlugChange(res.slug);
				}
			}
		};

		const catchAuthError = (error: Record<string, unknown>): void => {
			const err = error.data || error;
			setToken("");

			if (onResponse) {
				onResponse(err);
			} else {
				if (onError) {
					onError(err);
				}
				const errors: string[] =
					typeof err === "object" ? Object.values(err) : Array.isArray(err) ? err : []; // [0] - error message, [1] - timeout
				setTokenError(errors.length > 0 && Array.isArray(errors[0]) ? errors[0][0] : errors[0]);
			}
		};

		const sendRequest = async () => {
			try {
				const data =
					tokenType === SecureTokenTypeEnum.OTPCODE
						? { ...body, totp: token, token: token }
						: { ...body, pincode: token };
				setIsLoading(true);
				const res = await ApiClient.post(requestUrl, data);
				handleAuthRes(res);
			} catch (err: unknown) {
				catchAuthError(err as Record<string, unknown>);
			} finally {
				setIsLoading(false);
			}
		};

		const sendResendRequest = async () => {
			if (resendRequestUrl) {
				try {
					setIsLoading(true);
					const details = await ApiClient.post(resendRequestUrl, {
						wizard_id: body.wizard_id,
					});
					processTokenRes(details);
				} catch (err) {
					catchAuthError(err as Record<string, unknown>);
				} finally {
					setIsLoading(false);
				}
			}
		};

		const handleTokenChange = (token: string) => {
			setToken(token);
		};

		useEffect(() => {
			if (delayInterval.current) {
				clearInterval(delayInterval.current);
			}
			setDelayTime(0);
		}, [delayDate]);

		useEffect(() => {
			if (!prevDelayDate || (delayDate && delayDate !== prevDelayDate)) {
				const delayUnix = dayjs(delayDate).unix() * 1000;
				const now = Date.now();

				if (dayjs(delayUnix).isAfter(now)) {
					const duration = dayjs.duration(dayjs(delayUnix).diff(now));
					let secondsToEnd = duration.asSeconds();

					// @ts-ignore
					delayInterval.current = setInterval(() => {
						secondsToEnd--;
						if (secondsToEnd > 0) {
							setDelayTime(secondsToEnd);
						} else {
							setDelayTime(0);
							clearInterval(delayInterval.current ?? 0);
						}
					}, 1000);
				}
			}
		}, [delayInterval.current, delayDate]);

		const getTokenTypeLabel = useCallback((): string => {
			switch (tokenType) {
				case SecureTokenTypeEnum.OTPCODE:
					return formatMessage(messages.enter_2fa);
				case SecureTokenTypeEnum.PINCODE:
					return formatMessage(messages.enter_pincode);
				default:
					return "";
			}
		}, [tokenType]);

		const getImgByType = useCallback((): string => {
			switch (tokenType) {
				case SecureTokenTypeEnum.OTPCODE:
					return authenticatorAppImg;
				default:
					return mailImg;
			}
		}, [tokenType]);

		const getTokenTypeDesc = useCallback((): string => {
			switch (tokenType) {
				case SecureTokenTypeEnum.OTPCODE:
					return formatMessage(messages.enter_2fa_desc);
				case SecureTokenTypeEnum.PINCODE:
					return formatMessage(messages.enter_pincode_desc);
				default:
					return "";
			}
		}, [tokenType]);

		const getHintText = useCallback((): string => {
			if (tokenType === SecureTokenTypeEnum.OTPCODE) return formatMessage(messages.otp_hint);
			if (tokenType === SecureTokenTypeEnum.PINCODE) return formatMessage(messages.pincode_hint);
			return "";
		}, [tokenType]);

		const isInputDisabled = (): boolean => {
			switch (tokenType) {
				case SecureTokenTypeEnum.OTPCODE: {
					return delayTime > 0;
				}
				case SecureTokenTypeEnum.PINCODE: {
					return triesLeft !== null && triesLeft < 1;
				}
				default:
					return false;
			}
		};

		const Blocked = () => (
			<div className={styles.help_text}>
				<i className="ai ai-reload" />
				{formatMessage(messages.otp_input_blocked, {
					time_to_wait: (
						<FormattedRelativeTime value={delayTime} numeric="auto" updateIntervalInSeconds={1} />
					),
				})}
			</div>
		);

		const TriesLeft = () => (
			<div className={styles.help_text}>
				<i className="ai ai-reload" />
				{formatMessage(messages.pincode_input_with_tries, {
					tries: triesLeft,
					time_to_wait: <FormattedRelativeTime value={delayTime} updateIntervalInSeconds={1} />,
				})}
			</div>
		);

		const NoTries = () => (
			<div className={cn(styles.help_text, delayTime === 0 && styles.resend)}>
				{delayTime > 0 ? (
					<>
						<i className="ai ai-reload" />
						{formatMessage(messages.pincode_input_with_no_tries, {
							time_to_wait: <FormattedRelativeTime value={delayTime} updateIntervalInSeconds={1} />,
						})}
					</>
				) : (
					<button className={styles.custom_text_button} type="button" onClick={sendResendRequest}>
						<i className="ai ai-reload" />
						{formatMessage(messages.pincode_input_with_no_tries, { time_to_wait: "" })}
					</button>
				)}
			</div>
		);

		const ReloadSuccess = () => (
			<div className={styles.help_text}>
				<i className="ai ai-reload" />
				{formatMessage(messages.pincode_input_get_new_pincode_success, {
					time_to_wait: <FormattedRelativeTime value={delayTime} updateIntervalInSeconds={1} />,
				})}
			</div>
		);

		const ReloadButton = () => (
			<div className={cn(styles.help_text, styles.resend)}>
				<button className={styles.custom_text_button} type="button" onClick={sendResendRequest}>
					<i className="ai ai-reload" />
					{formatMessage(messages.pincode_input_get_new_pincode)}
				</button>
			</div>
		);

		const hasInputIcon = tokenType && !fullSize && !disabledLabel && !tablet;

		const getDelayText = useCallback((): JSX.Element | null => {
			if (tokenType === SecureTokenTypeEnum.OTPCODE && delayTime > 0) {
				return <Blocked />;
			}

			if (tokenType === SecureTokenTypeEnum.PINCODE) {
				if (triesLeft === 0) {
					return <NoTries />;
				}
				if (delayTime > 0) {
					if (triesLeft !== null && triesLeft > 0) {
						return <TriesLeft />;
					}
					return <ReloadSuccess />;
				}
				if (delayTime === 0 && triesLeft !== null && triesLeft >= 0 && resendRequestUrl) {
					return <ReloadButton />;
				}
			}
			return null;
		}, [tokenType, triesLeft, delayTime, resendRequestUrl]);

		return (
			<div className={styles.container}>
				{fullSize && (
					<>
						<span className={styles.full_size_text}>{getTokenTypeDesc()}</span>
						<span className={styles.additional_text}>{additionalInfo || ""}</span>
						<img className={styles.full_size_image} src={getImgByType()} alt={tokenType} />
					</>
				)}
				{tokenError ? (
					<div className={cn(styles.error_text, { [styles.maxWidth]: !hasInputIcon })}>
						<i className="ai ai-info_outlined" />
						{tokenError}
					</div>
				) : null}
				<div className={cn(styles.label_input, { [styles.maxWidth]: !hasInputIcon })}>
					{!disabledLabel && (
						<div className={styles.label}>
							<span>
								{!!tokenType && !fullSize && tablet && (
									<img className={styles.token_type_img} src={getImgByType()} alt={tokenType} />
								)}
								{getTokenTypeLabel()}
							</span>
							{tokenType ? (
								<Tooltip
									id="token-hint"
									effect="solid"
									text={getHintText()}
									hint
									place={hintPosition}
									className={styles.tooltip}
								/>
							) : null}
						</div>
					)}
					<div
						className={cn(styles.input_container, {
							[styles.disabled]: isInputDisabled(),
							[styles.active]: !!token,
						})}
					>
						{hasInputIcon ? (
							<img className={styles.token_type_img} src={getImgByType()} alt={tokenType} />
						) : null}
						{showOtp && (
							<OtpInput
								onChange={handleTokenChange}
								isDisabled={isInputDisabled()}
								numInputs={length}
								inputStyle={{ width: "100%" }}
								containerStyle="otp-container"
								value={token}
								isInputNum
								hasErrored={Boolean(tokenError)}
								errorStyle="otp-error"
								shouldAutoFocus={shouldAutoFocus}
							/>
						)}
					</div>
				</div>
				{getDelayText()}
				{helpText ? (
					<div className={cn(styles.help_text, { [styles.maxWidth]: !hasInputIcon })}>
						{helpText}
					</div>
				) : null}
				{variant === "spinner" ? (
					<div className={styles.spinner_container}>{isLoading && <Spinner size={24} />}</div>
				) : (
					<div className={styles.button_container}>
						<Button
							fullWidth
							color="primary"
							disabled={length !== token.length}
							label={buttonLabel || formatMessage(messages.submit)}
							onClick={sendRequest}
							isLoading={isLoading}
						/>
					</div>
				)}
			</div>
		);
	},
);

export default SecureToken;

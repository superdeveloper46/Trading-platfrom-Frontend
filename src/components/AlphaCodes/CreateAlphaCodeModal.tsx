import React, { useEffect, useLayoutEffect, useState } from "react";
import { useIntl } from "react-intl";
import QrCode from "qrcode.react";
import { observer } from "mobx-react-lite";
import messages from "messages/alpha_codes";
import commonMessages from "messages/common";
import IconButton from "components/UI/IconButton";
import Button from "components/UI/Button";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import Input, { Appender, AppenderButton, AppenderDivider } from "components/UI/Input";
import form_messages from "messages/form";
import SecureToken from "components/SecureToken";
import InfoSnack from "components/InfoSnack";
import styles from "styles/components/AlphaCodes.module.scss";
import { ISecureTokenRes, SecureTokenTypeEnum, SecureTokenVariantEnum } from "types/secureToken";
import Modal, { ActionGroup, Content, Description, Footer } from "components/UI/Modal";
import { ICreateRequestBody } from "types/alphaCodes";
import { useMst } from "models/Root";
import AlphaCodesService from "services/AlphaCodesService";
import { ICurrency } from "models/AlphaCodes";
import errorHandler from "utils/errorHandler";
import useCopyClick from "hooks/useCopyClick";

interface Props {
	onClose: () => void;
	isOpen: boolean;
}

interface IErrors {
	amount?: string;
	currency?: string;
}

interface IBody {
	amount?: string;
	amountLabel?: string;
	amoutMax?: string;
	email?: string;
}

interface ICodeDetailsProps {
	body: IBody;
	currentCurrency?: IOption;
}

interface ISuccessContentProps {
	details?: ISecureTokenRes;
	onReset: () => void;
	onClose: () => void;
}

const CodeDetails: React.FC<ICodeDetailsProps> = ({ body, currentCurrency }) => {
	const { formatMessage } = useIntl();
	const icon = currentCurrency?.label.image_svg || currentCurrency?.label.image_png || "";

	return (
		<div className={styles.code_details_wrapper}>
			<div className={styles.code_details_row}>
				<span className={styles.info_regular}>{`${formatMessage(messages.currency)}:`}</span>
				<div className={styles.amount_row}>
					<span className={styles.info_bold}>{currentCurrency?.label.name}</span>
					{icon ? (
						<span className={styles.info_icon}>
							<img src={icon} width="32" height="32" alt={currentCurrency?.label.name} />
						</span>
					) : null}
				</div>
			</div>
			<div className={styles.code_details_row}>
				<span className={styles.info_regular}>{`${formatMessage(messages.amount)}:`}</span>
				<div className={styles.amount_row}>
					<span className={styles.bold_amount}>{`${body.amount}`}</span>
					<span className={styles.info_bold}>{`${currentCurrency?.label.code}`}</span>
				</div>
			</div>
			{!!body.email && (
				<div className={styles.code_details_row}>
					<span className={styles.info_regular}>{`${formatMessage(
						messages.recipient_email,
					)}:`}</span>
					<span className={styles.info_bold}>{`${body.email}`}</span>
				</div>
			)}
		</div>
	);
};

const SuccessContent: React.FC<ISuccessContentProps> = ({ details, onReset, onClose }) => {
	const { formatMessage } = useIntl();
	const copyClick = useCopyClick();

	const handleClickCopy = (): void => {
		if (details?.create_coupon?.code) {
			copyClick(details.create_coupon.code);
		}
	};

	return (
		<>
			<Content>
				<Description>{formatMessage(messages.alpha_code_created)}</Description>
				<InfoSnack
					color="yellow"
					align="flex-start"
					iconCode="info_outlined"
					outlined
					justify="center"
					big
				>
					<span>{formatMessage(messages.save_warning)}</span>
				</InfoSnack>
				<div className={styles.success_wrapper}>
					{/* QR Code */}
					{!!details && (
						<div className={styles.qr_code_wrapper}>
							<div className={styles.qr_background}>
								<QrCode value={details?.create_coupon?.code || ""} />
							</div>
						</div>
					)}
					<div className={styles.copy_code_row}>
						<span className={styles.code_text}>{details?.create_coupon?.code || ""}</span>
						<IconButton
							variant="text"
							icon={<i className="ai ai-copy_new" />}
							size="large"
							onClick={handleClickCopy}
						/>
					</div>
				</div>
			</Content>
			<Footer>
				<ActionGroup>
					<Button
						fullWidth
						variant="filled"
						color="primary"
						onClick={onReset}
						label={formatMessage(messages.create_coupon)}
					/>
					<Button
						fullWidth
						variant="outlined"
						color="primary"
						onClick={onClose}
						label={formatMessage(commonMessages.close)}
					/>
				</ActionGroup>
			</Footer>
		</>
	);
};

const CreateAlphaCodeModal: React.FC<Props> = ({ isOpen, onClose }) => {
	const { formatMessage } = useIntl();
	const [options, setOptions] = useState<IOption[]>([]);
	const [currentCurrency, setCurrentCurrency] = useState<IOption>();
	const [body, setBody] = useState<IBody>({ amount: "", amountLabel: "" });
	const [errors, setErrors] = useState<IErrors>({});
	const [slug, setSlug] = useState<string>("");
	const [details, setDetails] = useState<ISecureTokenRes>();
	const [showToken, setShowToken] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [tokenType, setTokenType] = useState<SecureTokenTypeEnum | undefined>(undefined);
	const { alphaCodes } = useMst();

	useLayoutEffect(() => {
		setCurrentCurrency(undefined);
		setBody({ amount: "", amountLabel: "" });
		setErrors({});
		setSlug("");
		setDetails(undefined);
		setShowToken(false);
		setIsSuccess(false);
		setIsLoading(false);
		setTokenType(undefined);
	}, [isOpen]);

	useEffect(() => {
		alphaCodes.getCurrencies();
	}, []);

	useEffect(() => {
		processAmoutLabelValue();
	}, [currentCurrency]);

	useEffect(() => {
		if (slug?.length && tokenType) {
			setShowToken(true);
		}
	}, [slug, tokenType]);

	useEffect(() => {
		setOptions(alphaCodes.processedCurrencies);
	}, [alphaCodes.currencies]);

	const processAmoutLabelValue = (): void => {
		if (currentCurrency && currentCurrency.value.length && alphaCodes.currencies?.length) {
			const selected: ICurrency | undefined = alphaCodes.currencies.find(
				(currency: ICurrency) => currency.code === currentCurrency.value,
			);

			if (selected) {
				setBody((prevState) => ({
					...prevState,
					amountLabel: `${selected.available} ${selected.code}`,
					amoutMax: selected.available,
					amount: "",
				}));
			}
		}
	};

	const handleSubmit = (): void => {
		if (!body.amount?.length) {
			setErrors({ amount: formatMessage(form_messages.required) });
		} else {
			setIsLoading(true);
			const requestBody: ICreateRequestBody = {
				amount: body.amount,
				currency: currentCurrency?.value ?? "",
				recipient_email: body?.email ?? "",
			};

			AlphaCodesService.createCode(requestBody)
				.then((data: ISecureTokenRes) => {
					setSlug(data?.slug ?? "");

					if (data.is_totp_required && !data.is_totp_ok) {
						setTokenType(SecureTokenTypeEnum.OTPCODE);
					} else if (data.is_pincode_required && !data.is_pincode_ok) {
						setTokenType(SecureTokenTypeEnum.PINCODE);
					}
				})
				.catch((err) => {
					errorHandler(err);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	const handleClose = (): void => {
		if (slug?.length) {
			AlphaCodesService.cancelCode(slug)
				.catch((err) => {
					errorHandler(err);
				})
				.finally(() => {
					onClose();
				});
		} else {
			onClose();
		}
	};

	const handleSelectChange = (nextOption: IOption): void => {
		setErrors({ currency: "" });
		setCurrentCurrency(nextOption);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setErrors({ amount: "" });

		const { name, value } = e.target;

		setBody((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSecureTokenSuccess = (details: ISecureTokenRes): void => {
		setDetails(details);
		setIsSuccess(true);
	};

	const onReset = (): void => {
		setIsSuccess(false);
		setSlug("");
		setShowToken(false);

		setBody((prevState) => ({
			...prevState,
			amount: "",
		}));
	};

	const handleInputKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSubmit();
		}
	};

	const handleAllAmountFill = (): void => {
		setBody((prevState) => ({
			...prevState,
			amount: body.amoutMax,
		}));
	};

	return (
		<Modal
			label={formatMessage(isSuccess ? messages.success : messages.create_coupon)}
			onClose={onClose}
			isOpen={isOpen}
		>
			{isSuccess ? (
				<SuccessContent details={details} onReset={onReset} onClose={onClose} />
			) : (
				<>
					<Content>
						{!!slug?.length && <CodeDetails body={body} currentCurrency={currentCurrency} />}
						{/* Inputs */}
						{!slug?.length && (
							<>
								{/* Currency Selector */}
								<CurrencySelect
									onSelectChange={handleSelectChange}
									options={options}
									value={currentCurrency}
									autoFocus
								/>
								{/* Amount Input */}
								<div className={styles.amount_wrapper}>
									{/* Amount Display */}
									{body.amountLabel && body.amountLabel.length > 0 && (
										<div className={styles.display_amount_row}>
											<span className={styles.display_amount_text}>{`${body.amountLabel}`}</span>
										</div>
									)}
									<Input
										type="number"
										name="amount"
										onChange={handleChange}
										onKeyDown={handleInputKeyDown}
										value={body.amount}
										labelValue={formatMessage(commonMessages.amount)}
										appender={
											<Appender>
												{currentCurrency?.label?.code?.toUpperCase() ?? ""}
												<AppenderDivider />
												<AppenderButton onClick={handleAllAmountFill}>max</AppenderButton>
											</Appender>
										}
										error={errors.amount}
									/>
								</div>
								<div className={styles.email_wrapper}>
									<Input
										type="text"
										name="email"
										onKeyDown={handleInputKeyDown}
										onChange={handleChange}
										value={body.email}
										labelValue={formatMessage(messages.code_create_email)}
									/>
								</div>
							</>
						)}
						{/* 2FA */}
						{showToken && (
							<div className={styles.token_wrapper}>
								<SecureToken
									onSuccess={handleSecureTokenSuccess}
									requestUrl={`web/coupons/create/${slug}/confirm`}
									resendRequestUrl={`web/coupons/create/${slug}/resend`}
									type={tokenType}
									shouldAutoFocus
									variant={SecureTokenVariantEnum.SPINNER}
									fullSize={false}
									hintPosition="top"
								/>
							</div>
						)}
					</Content>
					<Footer>
						<ActionGroup>
							{!slug?.length && (
								<Button
									fullWidth
									variant="filled"
									color="primary"
									onClick={handleSubmit}
									label={formatMessage(messages.create_coupon)}
									isLoading={isLoading}
								/>
							)}
							<Button
								fullWidth
								variant="outlined"
								color="primary"
								onClick={handleClose}
								label={formatMessage(commonMessages.back_btn)}
							/>
						</ActionGroup>
					</Footer>
				</>
			)}
		</Modal>
	);
};

export default observer(CreateAlphaCodeModal);

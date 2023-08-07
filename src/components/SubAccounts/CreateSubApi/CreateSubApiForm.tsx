import * as React from "react";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import subAccountsMessages from "messages/sub_accounts";
import accountMessages from "messages/account";
import commonMessages from "messages/common";
import { useMst } from "models/Root";
import useParamQuery from "hooks/useSearchQuery";
import {
	IConfirmCreateSubAccApiKeyResponse,
	ICreateSubAccApiKeyRequestBody,
	ISubAccApiKeyCreateFormBody,
	ISubAccApiKeyCreateFormErrorsBody,
	PermittedActionsEnum,
} from "types/subAccounts";
import { IError } from "types/general";
import {
	INITIAL_SUB_ACC_API_KEY_CREATE_FORM,
	SUB_ACC_API_KEY_CREATE_FORM_VALIDATION_SCHEMA,
} from "constants/subAccounts";
import { getArrayOfIPsFromString, getErrorFromYupValidationRes } from "utils/getter";
import { ISecureTokenRes, SecureTokenTypeEnum, SecureTokenVariantEnum } from "types/secureToken";
import SubAccountsService from "services/SubAccountsService";
import { handleFormErrors } from "utils/form";
import Select, { ISelectOption } from "components/UI/Select";
import errorHandler from "utils/errorHandler";
import SecureToken from "components/SecureToken";
import Button from "components/UI/Button";
import Input from "components/UI/Input";
import IconButton from "components/UI/IconButton";
import Switch from "components/UI/Switch";
import RadioChoice from "components/UI/Radio";
import Textarea from "components/UI/Textarea";
import subAccountStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import styles from "styles/pages/SubAccounts/CreateSubApi.module.scss";
import apiStyles from "styles/components/Profile/Api/CreateApiKey.module.scss";
import VerificationModal from "components/BuyCrypto/VerificationModal";
import { queryVars } from "constants/query";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";
import { ApiCreatedModal } from "../modals";

const CreateSubApiForm: React.FC = () => {
	const localeNavigate = useLocaleNavigate();
	const { formatMessage } = useIntl();

	const {
		account: { profileStatus },
		subAccounts: { accounts, isAccountsLoading },
	} = useMst();

	const query = useParamQuery();
	const querySubAccount = query.get("sub-account"); // TODO: Rename it to sub_account on back

	const [isVerificationModalOpened, setIsVerificationModalOpened] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalData, setModalData] = useState<{ key: string; secret: string }>({
		key: "",
		secret: "",
	});

	const [slug, setSlug] = useState<string>("");
	const [tokenType, setTokenType] = useState<SecureTokenTypeEnum | "">("");
	const [isCreateApiKeyRequestLoading, setIsCreateApiKeyRequestLoading] = useState<boolean>(false);
	const [delayTime, setDelayTime] = useState<string>("");

	const [formBody, setFormBody] = useState<ISubAccApiKeyCreateFormBody>(
		INITIAL_SUB_ACC_API_KEY_CREATE_FORM,
	);
	const [formErrors, setFormErrors] = useState<ISubAccApiKeyCreateFormErrorsBody>({});

	const resetState = () => {
		setFormBody(INITIAL_SUB_ACC_API_KEY_CREATE_FORM);
		setFormErrors({});
		setTokenType("");
		setDelayTime("");
		setSlug("");
	};

	const subAccountOptions = useMemo(
		() =>
			accounts.map((acc) => ({
				label: acc.login,
				value: acc.uid,
			})),
		[accounts, isAccountsLoading],
	);

	const handleSubmit = async () => {
		await SUB_ACC_API_KEY_CREATE_FORM_VALIDATION_SCHEMA(formatMessage)
			.validate(formBody, {
				abortEarly: false,
			})
			.then(() => {
				setFormErrors({});

				const data: ICreateSubAccApiKeyRequestBody = {
					[queryVars.sub_account]: formBody.sub_account,
					label: formBody.label,
					limit_to_ips: formBody.permittedIPsList,
					can_trade: formBody.permittedActions === PermittedActionsEnum.Trading,
					can_margin: formBody.tradeCoins.margin,
				};

				if (!isCreateApiKeyRequestLoading) {
					setIsCreateApiKeyRequestLoading(true);
					SubAccountsService.createSubAccApiKey(data)
						.then(handleAuthStatusRes)
						.catch(handleErrors)
						.finally(() => {
							setIsCreateApiKeyRequestLoading(false);
						});
				}
			})
			.catch((err) => {
				setFormErrors(getErrorFromYupValidationRes<ISubAccApiKeyCreateFormErrorsBody>(err));
			});
	};

	const handleErrors = (err: IError) => {
		if (err) {
			errorHandler(err, false);
			const nextErrors = handleFormErrors(err, Object.keys(formErrors));
			setFormErrors((prevState) => ({
				...prevState,
				...nextErrors,
			}));
		}
	};

	const handleAuthStatusRes = (res: ISecureTokenRes): void => {
		if (res.is_ok) {
			// successful block seems like isn't needed there
		} else {
			if (res.is_totp_required && !res.is_totp_ok) {
				setTokenType(SecureTokenTypeEnum.OTPCODE);
				setDelayTime(res.totp_timeout);
			} else if (res.is_pincode_required && !res.is_pincode_ok) {
				setTokenType(SecureTokenTypeEnum.PINCODE);
				setDelayTime(res.pincode_timeout);
			}
			setSlug(res.slug || "");
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
	) => {
		setFormErrors({});
		const { name, value } = e.target;
		setFormBody((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSelectChange = (o: ISelectOption) => {
		setFormErrors({});
		setFormBody((prevState) => ({
			...prevState,
			sub_account: o.value,
		}));
	};

	const handlePermittedTradeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const value = e.target.value;
		setFormBody((prevState) => ({
			...prevState,
			permittedActions: value as PermittedActionsEnum,
		}));
	};

	const handleTradeCoinsChange = (e: React.ChangeEvent<HTMLInputElement>, name: string): void => {
		const value: boolean = e.target.checked;
		setFormBody((prevState) => ({
			...prevState,
			tradeCoins: {
				...prevState.tradeCoins,
				[name]: value,
			},
		}));
	};

	const handleAddPermittedIPs = (): void => {
		setFormBody((prevState) => ({
			...prevState,
			permittedIPsList: [
				...prevState.permittedIPsList,
				...getArrayOfIPsFromString(formBody.permittedIPs).filter(
					(ip) => !prevState.permittedIPsList.find((prevIP) => ip === prevIP),
				),
			],
			permittedIPs: "",
		}));
	};

	const handlePermittedIPsKeyDown = (e: React.KeyboardEvent<Element>): void => {
		if (e.key === "Enter") {
			handleAddPermittedIPs();
		}
	};

	const handleRemovePermittedIPFromList = (
		e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>,
	): void => {
		const { ip } = e.currentTarget.dataset;
		setFormBody((prevState) => ({
			...prevState,
			permittedIPsList: prevState.permittedIPsList.filter((permIP: string) => permIP !== ip),
		}));
	};

	const handleSecureTokenSuccess = (res: IConfirmCreateSubAccApiKeyResponse) => {
		setModalData({ key: res.api_key_created.key, secret: res.api_key_created.secret });
		setIsModalOpen(true);
	};

	const cancelRequest = () => {
		SubAccountsService.cancelCreateSubAccApiKey(slug).catch(errorHandler);
		resetState();
	};

	const handleCloseModal = useCallback((accountUid: string) => {
		setIsModalOpen(false);
		localeNavigate(routes.subAccounts.getApiDetails(accountUid));
	}, []);

	const onClickSubAccountCreate = () => {
		if (!profileStatus || profileStatus.verification_level < 1) {
			setIsVerificationModalOpened(true);
		} else {
			handleSubmit();
		}
	};

	useEffect(() => {
		if (querySubAccount) {
			setFormBody((prevState) => ({
				...prevState,
				...(querySubAccount ? { sub_account: querySubAccount } : {}),
			}));
		}
	}, [querySubAccount]);

	useEffect(() => {
		if (formBody.permittedActions !== PermittedActionsEnum.Trading) {
			setFormBody((prevState) => ({
				...prevState,
				tradeCoins: {
					...prevState.tradeCoins,
					margin: false,
				},
			}));
		}
	}, [formBody.permittedActions]);

	return (
		<div className={subAccountStyles.card_container}>
			<ApiCreatedModal
				publicKey={modalData.key}
				secretKey={modalData.secret}
				isOpen={isModalOpen}
				onClose={() => handleCloseModal(formBody.sub_account)}
			/>
			<span className={subAccountStyles.card_title}>
				{formatMessage(accountMessages.subaccount_add_api)}
			</span>
			{tokenType ? (
				<>
					<SecureToken
						requestUrl={`web/sub-account/api-keys/create/${slug}/confirm`}
						resendRequestUrl={`web/sub-account/api-keys/create/${slug}/resend`}
						onSuccess={handleSecureTokenSuccess}
						onSlugChange={setSlug}
						type={tokenType}
						delay={delayTime}
						variant={SecureTokenVariantEnum.SPINNER}
						fullSize
					/>
					<Button
						variant="text"
						color="primary"
						fullWidth
						onClick={cancelRequest}
						label={formatMessage(commonMessages.back_btn)}
					/>
				</>
			) : (
				<>
					<div className={styles.form_input_group}>
						<Select
							isLoading={isAccountsLoading}
							onChange={handleSelectChange}
							options={subAccountOptions}
							value={subAccountOptions.find(({ value }) => value === formBody.sub_account)}
							label={formatMessage(subAccountsMessages.sub_account)}
							placeholder={formatMessage(subAccountsMessages.sub_account)}
							error={formErrors.sub_account}
						/>
						<Input
							onChange={handleInputChange}
							type="text"
							value={formBody.label}
							name="label"
							error={formErrors.label}
							labelValue={formatMessage(subAccountsMessages.sub_acc_api_key_label)}
						/>
					</div>
					<>
						<div className={styles.permitted_ips_textarea}>
							<Textarea
								value={formBody.permittedIPs}
								labelValue={formatMessage(subAccountsMessages.sub_acc_ip_segment)}
								onChange={handleInputChange}
								onKeyDown={handlePermittedIPsKeyDown}
								name="permittedIPs"
								helpText={formatMessage(subAccountsMessages.sub_acc_ip_segment_help_text)}
							/>
							<IconButton
								className={styles.add_ip_button}
								onClick={handleAddPermittedIPs}
								variant="filled"
								color="primary"
								icon={<i className="ai ai-plus_mini" />}
							/>
						</div>
						{formErrors.permittedIPsList && (
							<span className={styles.error}>{formErrors.permittedIPsList}</span>
						)}
						{formBody.permittedIPsList.length > 0 && (
							<div className={apiStyles.selected_list}>
								{formBody.permittedIPsList.map((ip: string) => (
									<div className={apiStyles.selected_list_item} key={ip}>
										{ip}
										<button type="button" data-ip={ip} onClick={handleRemovePermittedIPFromList}>
											<i className="ai ai-cancel_mini" />
										</button>
									</div>
								))}
							</div>
						)}
					</>
					<span className={styles.card_separator} />
					<div className={styles.permitted_actions}>
						<span className={styles.secondary_title}>
							{formatMessage(accountMessages.subaccount_table_trading_permission)}
						</span>
						<RadioChoice
							className={styles.checkbox_item}
							onChange={handlePermittedTradeChange}
							label={formatMessage(subAccountsMessages.sub_acc_read_only)}
							value={formBody.permittedActions}
							name="permitted-ips-strategy"
							choice={PermittedActionsEnum.Reading}
						/>
						<RadioChoice
							className={styles.checkbox_item}
							onChange={handlePermittedTradeChange}
							label={formatMessage(subAccountsMessages.sub_acc_allow_trading)}
							value={formBody.permittedActions}
							name="permitted-ips-strategy"
							choice={PermittedActionsEnum.Trading}
						/>
						{formErrors.permittedActions && (
							<span className={styles.error}>{formErrors.permittedActions}</span>
						)}
					</div>
					<div className={styles.trade_coins}>
						<span className={styles.secondary_title}>
							{formatMessage(accountMessages.subaccount_trading_permissions)}
						</span>
						<div className={styles.trade_coin_list}>
							<Switch
								disabled
								id="spot"
								label={formatMessage(accountMessages.spot)}
								checked={formBody.tradeCoins.spot}
								onChange={(e) => handleTradeCoinsChange(e, "spot")}
							/>
							<Switch
								disabled={formBody.permittedActions !== PermittedActionsEnum.Trading}
								id="margin"
								label={formatMessage(accountMessages.margin)}
								checked={formBody.tradeCoins.margin}
								onChange={(e) => handleTradeCoinsChange(e, "margin")}
							/>
						</div>
						{formErrors.tradeCoins && <span className={styles.error}>{formErrors.tradeCoins}</span>}
					</div>
					<Button
						variant="filled"
						color="primary"
						fullWidth
						isLoading={isCreateApiKeyRequestLoading || !profileStatus}
						onClick={onClickSubAccountCreate}
						label={formatMessage(commonMessages.continue)}
					/>
					<span className={styles.disclaimer}>
						{formatMessage(subAccountsMessages.sub_acc_3rd_parties)}
					</span>
				</>
			)}
			<VerificationModal
				isOpen={isVerificationModalOpened}
				label={formatMessage(subAccountsMessages.verification_lvl1_to_create, {
					asset: formatMessage(accountMessages.api_keys),
				})}
				onClose={() => setIsVerificationModalOpened(false)}
			/>
		</div>
	);
};

export default observer(CreateSubApiForm);

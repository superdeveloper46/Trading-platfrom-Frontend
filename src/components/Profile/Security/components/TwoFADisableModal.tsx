import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import disable2FAImg from "assets/images/security/Disabled_Two-Factor.svg";
import commonMessages from "messages/common";
import securityMessages from "messages/security";
import { useMst } from "models/Root";
import Modal, {
	ActionGroup,
	Content,
	ContentForm,
	Description,
	Footer,
	Image,
	SuccessScreen,
} from "components/UI/Modal";
import Input from "components/UI/Input";
import CheckBox from "components/UI/CheckBox";
import Button from "components/UI/Button";
import styles from "styles/components/Profile/Security/AuthenticatorSetup.module.scss";

export interface IFormBody {
	token: string;
	password: string;
}
export interface IFormErrors {
	token: string;
	password: string;
}

interface Props {
	isOpen: boolean;
	onClose: () => void;
	subAccountMode?: boolean;
	disableCallback: (body: IFormBody) => void;
	successCallback?: () => void;
}

const TwoFADisableModal: React.FC<Props> = ({
	isOpen,
	onClose,
	subAccountMode,
	disableCallback,
	successCallback,
}) => {
	const {
		account: { loadProfileStatus },
	} = useMst();
	const [formBody, setFormBody] = useState<IFormBody>({
		token: "",
		password: "",
	});
	const [formErrors, setFormErrors] = useState<IFormErrors>({
		token: "",
		password: "",
	});
	const { formatMessage } = useIntl();

	const [agree, setAgree] = useState<boolean>(false);
	const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
	const isSubmitAvailable = !!(formBody.token && formBody.password && agree);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target;
		setFormBody((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setAgree(e.target.checked);
	};

	const handleSubmit = async () => {
		try {
			setIsSubmitLoading(true);
			await disableCallback(formBody);
			setIsSuccessful(true);
			if (typeof successCallback === "function") {
				setIsSubmitLoading(false);
				successCallback();
			}
			if (!subAccountMode) {
				loadProfileStatus();
			}
		} catch (err) {
			const e = err as IFormErrors;
			if (e) {
				setFormErrors({ ...e });
			}
		} finally {
			setIsSubmitLoading(false);
		}
	};

	useEffect(() => {
		setFormBody({ token: "", password: "" });
		setIsSuccessful(false);
		setAgree(false);
	}, [isOpen]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			label={formatMessage(securityMessages.disable_twoFA_h)}
		>
			{isSuccessful ? (
				<SuccessScreen>
					<span>{formatMessage(securityMessages.twoFA_disabled)}</span>
				</SuccessScreen>
			) : (
				<>
					<Content className={styles.two_fa_disable_modal_content}>
						<Image>
							<img src={disable2FAImg} alt="disable-2fa" />
						</Image>
						<Description noMargin>{formatMessage(securityMessages.disable_twoFA_p1)}</Description>
					</Content>
					<ContentForm>
						<Input
							password
							name="password"
							error={formErrors.password}
							value={formBody.password}
							onChange={handleInputChange}
							labelValue={formatMessage(commonMessages.password)}
							type="password"
						/>
						<Input
							name="token"
							error={formErrors.token}
							value={formBody.token}
							onChange={handleInputChange}
							labelValue={formatMessage(securityMessages.disable_twoFA_token)}
						/>
						<CheckBox name="agree" checked={agree} onChange={handleCheckBoxChange} required>
							{formatMessage(securityMessages.disable_twoFA_checkbox_label)}
						</CheckBox>
					</ContentForm>
					<Footer>
						<ActionGroup>
							<Button
								variant="filled"
								color="primary"
								fullWidth
								onClick={handleSubmit}
								isLoading={isSubmitLoading}
								disabled={!isSubmitAvailable}
								label={formatMessage(securityMessages.ip_white_list_state_btn_disable)}
							/>
							<Button
								variant="outlined"
								color="primary"
								onClick={onClose}
								fullWidth
								label={formatMessage(commonMessages.cancel)}
							/>
						</ActionGroup>
					</Footer>
				</>
			)}
		</Modal>
	);
};

export default TwoFADisableModal;

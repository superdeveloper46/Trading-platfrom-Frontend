import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import Modal, { ActionGroup, Footer, SuccessScreen } from "components/UI/Modal";
import securityMessages from "messages/security";
import commonMessages from "messages/common";
import apiMessages from "messages/api";
import styles from "styles/pages/ProfileSecurity.module.scss";
import whiteIpImg from "assets/images/security/Login_whitelist.svg";
import Button from "components/UI/Button";
import Switch from "components/UI/Switch";
import MultiValueInput from "components/UI/MultiValueInput";
import { IP_REGEX } from "constants/common";
import errorHandler from "utils/errorHandler";
import SecurityService from "services/SecurityService";
import { queryVars } from "constants/query";

interface IProps {
	isOpen: boolean;
	onSuccess(): Promise<void>;
	onClose(): void;
	useIpWhitelist: boolean;
}

const WhitelistIpModal: React.FC<IProps> = ({ isOpen, onSuccess, onClose, useIpWhitelist }) => {
	const { formatMessage } = useIntl();
	const [isLoading, setLoading] = useState(false);
	const [ipAddress, setIpAddress] = useState<string>("");
	const [ipAddresses, setIpAddresses] = useState<string[]>([]);
	const [ipAddressError, setIpAddressError] = useState<string>("");
	const [isEnabled, setEnabled] = useState<boolean>(useIpWhitelist);
	const [isSuccessful, setSuccessful] = useState<boolean>(false);

	useEffect(() => {
		loadIpAddresses();
	}, []);

	useEffect(() => {
		setEnabled(ipAddresses.length > 0 && useIpWhitelist);
	}, [ipAddresses.length, useIpWhitelist]);

	const handleChangeSwitch = () => setEnabled((p) => !p);
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setIpAddress(e.target.value);

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key !== "Enter") return;
		e.preventDefault();
		addIp();
	};

	const addIp = () => {
		if (!IP_REGEX.test(ipAddress)) {
			setIpAddressError(formatMessage(apiMessages.ip_wrong_format));
			return false;
		}
		setIpAddresses((ip) => [...ip, ipAddress]);
		setIpAddress("");
		setIpAddressError("");
		return true;
	};

	const removeIp = (e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		const { id } = e.currentTarget.dataset;
		setIpAddresses((ips) => ips.filter((ip) => ip !== id));
	};

	const loadIpAddresses = async () => {
		try {
			setLoading(true);
			const data = await SecurityService.getWhitelistIps({
				[queryVars.page]: 1,
				[queryVars.page_size]: 100,
			});
			if (!data) return;
			const { results } = data;
			results.forEach((ip) => setIpAddresses((ips) => [...ips, ip.ip_address]));
		} catch (err) {
			errorHandler(err);
		} finally {
			setLoading(false);
		}
	};

	const submitIpAddresses = async () => {
		try {
			setLoading(true);
			await SecurityService.setWhiteListIps({
				enabled: isEnabled,
				ips: ipAddresses,
			});
			setSuccessful(true);
			await onSuccess();
		} catch (err) {
			errorHandler(err);
			setSuccessful(false);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal label={formatMessage(securityMessages.ip_white_list)} onClose={onClose} isOpen={isOpen}>
			{isSuccessful ? (
				<>
					<SuccessScreen>
						<span>
							{formatMessage(
								isEnabled
									? securityMessages.ip_white_list_state_enabled
									: securityMessages.ip_white_list_state_disabled,
							)}
						</span>
					</SuccessScreen>
					<Footer>
						<ActionGroup>
							<Button
								variant="filled"
								color="primary"
								fullWidth
								onClick={onClose}
								label={formatMessage(commonMessages.ok)}
							/>
						</ActionGroup>
					</Footer>
				</>
			) : (
				<form>
					<div className={styles.security_modal_content}>
						<div className={styles.security_modal_description}>
							{formatMessage(securityMessages.white_list_description)}
						</div>
						<div className={styles.security_modal_img}>
							<img src={whiteIpImg} alt="white-ip list" />
						</div>
						<div className={styles.security_modal_form_content}>
							<Switch
								id="white_list_state_switch"
								checked={isEnabled}
								onChange={handleChangeSwitch}
								label={formatMessage(
									isEnabled
										? securityMessages.ip_white_list_state_enabled
										: securityMessages.ip_white_list_state_disabled,
								)}
							/>
							<MultiValueInput
								name="ip_address"
								value={ipAddress}
								onChange={onChange}
								onKeyDown={onKeyDown}
								labelValue={formatMessage(securityMessages.ip_address_label)}
								error={ipAddressError}
								helpText={
									<>
										<i className="ai ai-warning" />
										{formatMessage(securityMessages.add_ip_to_white_list)}
									</>
								}
							>
								{ipAddresses.map((ip) => (
									<div className={styles.security_edit_ip}>
										{ip}
										<button
											data-id={ip}
											className={styles.security_edit_ip_delete_btn}
											type="button"
											onClick={removeIp}
										>
											<i className="ai ai-close" />
										</button>
									</div>
								))}
							</MultiValueInput>
						</div>
					</div>
					<Footer>
						<ActionGroup>
							<Button
								variant="filled"
								color="primary"
								fullWidth
								isLoading={isLoading}
								label={formatMessage(commonMessages.save)}
								onClick={submitIpAddresses}
							/>
							<Button
								variant="outlined"
								color="primary"
								fullWidth
								onClick={onClose}
								label={formatMessage(commonMessages.cancel)}
							/>
						</ActionGroup>
					</Footer>
				</form>
			)}
		</Modal>
	);
};

export default WhitelistIpModal;

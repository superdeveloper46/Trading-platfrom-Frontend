import React, { useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";

import accountMessages from "messages/account";
import commonMessages from "messages/common";
import subAccountsMessages from "messages/sub_accounts";
import { ISubAccount, IUpdateSubAccountBody } from "types/subAccounts";
import SubAccountsService from "services/SubAccountsService";
import errorHandler from "utils/errorHandler";
import Modal, { ActionGroup, Content, ContentForm, Footer } from "components/UI/Modal";
import stylesModal from "styles/components/UI/Modal.module.scss";
import subAccountStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import Switch from "components/UI/Switch";
import Button from "components/UI/Button";
import Tooltip from "components/UI/Tooltip";
import styleProps from "utils/styleProps";

interface IFormBody {
	spot: boolean;
	margin: boolean;
	// margin_cross: boolean;
	// margin_isolated: boolean;
}

interface Props {
	subAccount: ISubAccount;
	isOpen: boolean;
	onClose: () => void;
	onSuccessCallback?: () => void;
}

const TradingPermissionsModal: React.FC<Props> = ({
	subAccount,
	isOpen,
	onClose,
	onSuccessCallback,
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [formBody, setFormBody] = useState<IFormBody>({
		spot: true,
		margin: subAccount.is_margin_enabled,
		// margin_cross: subAccount?.is_margin_cross_enabled || false,
		// margin_isolated: subAccount?.is_margin_isolated_enabled || false,
	});

	const { formatMessage } = useIntl();

	const handleTradeCoinsChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		name: keyof IFormBody,
	): void => {
		const value: boolean = e.target.checked;
		setFormBody((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const sendRequest = async () => {
		const data: IUpdateSubAccountBody = {
			is_margin_enabled: formBody.margin,
		};
		setIsLoading(true);
		SubAccountsService.updateSubAccount(subAccount.uid, data)
			.then(() => {
				if (typeof onSuccessCallback === "function") {
					onSuccessCallback();
				}
				onClose();
				toast.success(formatMessage(subAccountsMessages.sub_acc_trading_permissions_updated));
			})
			.catch(errorHandler)
			.finally(() => setIsLoading(false));
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			iconCode="ai ai-clock"
			iconClassName={subAccountStyles.gold_icon}
			label={formatMessage(accountMessages.subaccount_trading_permissions)}
		>
			<div className={stylesModal.warning_area}>
				<i className="ai ai-flag_filled-221" />
				<span>{formatMessage(subAccountsMessages.sub_acc_spot_is_allowed_by_default)}</span>
			</div>
			<ContentForm>
				<div className={stylesModal.toggle_item}>
					<span style={styleProps({ display: "flex" })}>
						{formatMessage(accountMessages.spot)}
						<Tooltip
							id={`${subAccount.uid}_trade_hint`}
							padding=""
							hint
							text={formatMessage(subAccountsMessages.sub_acc_spot_toggle_tooltip)}
						/>
					</span>
					<Switch disabled id="spot" checked={formBody.spot} />
				</div>
				<div className={stylesModal.toggle_item}>
					{formatMessage(accountMessages.margin)}{" "}
					<Switch
						id="margin_cross"
						checked={formBody.margin}
						onChange={(e) => handleTradeCoinsChange(e, "margin")}
					/>
				</div>
				{/* <ToggleItem> */}
				{/*	Margin Isolated{" "} */}
				{/*	<Switch */}
				{/*		id="margin_isolated" */}
				{/*		checked={formBody.margin_isolated} */}
				{/*		onChange={(e) => handleTradeCoinsChange(e, "margin_isolated")} */}
				{/*	/> */}
				{/* </ToggleItem> */}
			</ContentForm>
			<Footer>
				<ActionGroup>
					<Button
						variant="filled"
						color="primary"
						onClick={sendRequest}
						isLoading={isLoading}
						fullWidth
						label={formatMessage(commonMessages.confirm)}
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
		</Modal>
	);
};

export default TradingPermissionsModal;

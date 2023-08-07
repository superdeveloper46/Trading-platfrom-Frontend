import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";

import { ISubAccount, IUpdateSubAccountBody } from "types/subAccounts";
import accountMessages from "messages/account";
import commonMessages from "messages/common";
import subAccountsMessages from "messages/sub_accounts";
import SubAccountsService from "services/SubAccountsService";
import Modal, { ActionGroup, Content, ContentForm, Footer } from "components/UI/Modal";
import Button from "components/UI/Button";
import Switch from "components/UI/Switch";
import stylesModal from "styles/components/UI/Modal.module.scss";
import errorHandler from "utils/errorHandler";
import subAccountStyles from "styles/pages/SubAccounts/SubAccount.module.scss";

interface IFormBody {
	deposit: boolean;
	withdraw: boolean;
}

interface Props {
	subAccount: ISubAccount;
	isOpen: boolean;
	onClose: () => void;
	onSuccessCallback?: () => void;
}

const AssetsManagementModal: React.FC<Props> = ({
	subAccount,
	isOpen,
	onClose,
	onSuccessCallback,
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [formBody, setFormBody] = useState<IFormBody>({
		deposit: subAccount?.is_deposit_enabled,
		withdraw: subAccount?.is_withdraw_enabled,
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
			is_deposit_enabled: formBody.deposit,
			is_withdraw_enabled: formBody.withdraw,
		};
		setIsLoading(true);
		SubAccountsService.updateSubAccount(subAccount.uid, data)
			.then(() => {
				if (typeof onSuccessCallback === "function") {
					onSuccessCallback();
				}
				onClose();
				toast.success(formatMessage(subAccountsMessages.sub_acc_assets_updated));
			})
			.catch(errorHandler)
			.finally(() => setIsLoading(false));
	};

	const isAnyPermissionsAllowed = useMemo(
		() => subAccount.is_withdraw_enabled || subAccount.is_deposit_enabled,
		[subAccount],
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			iconCode="ai ai-clock"
			iconClassName={subAccountStyles.gold_icon}
			label={formatMessage(accountMessages.subaccount_asset_management)}
		>
			{!isAnyPermissionsAllowed && (
				<div className={stylesModal.warning_area}>
					<i className="ai ai-flag_filled-221" />
					<span>{formatMessage(subAccountsMessages.sub_acc_spot_assets_is_not_setted)}</span>
				</div>
			)}
			<ContentForm>
				<div className={stylesModal.toggle_item}>
					{formatMessage(commonMessages.deposit)}{" "}
					<Switch
						id="deposit"
						checked={formBody.deposit}
						onChange={(e) => handleTradeCoinsChange(e, "deposit")}
					/>
				</div>
				<div className={stylesModal.toggle_item}>
					{formatMessage(commonMessages.withdraw)}{" "}
					<Switch
						id="withdraw"
						checked={formBody.withdraw}
						onChange={(e) => handleTradeCoinsChange(e, "withdraw")}
					/>
				</div>
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

export default AssetsManagementModal;

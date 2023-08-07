import React from "react";
import { useIntl } from "react-intl";
import dayjs from "dayjs";
import cn from "classnames";

import subAccStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import styles from "styles/pages/SubAccounts/ApiManagement.module.scss";
import accountMessages from "messages/account";
import subAccountMessages from "messages/sub_accounts";
import { ISubAccount } from "types/subAccounts";
import Button from "components/UI/Button";
import InternalLink from "components/InternalLink";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import useCopyClick from "hooks/useCopyClick";
import { routes, URL_VARS } from "constants/routing";

interface IProps {
	subAccount?: ISubAccount;
}

const Header: React.FC<IProps> = ({ subAccount }) => {
	const { formatMessage } = useIntl();
	const copyClick = useCopyClick();
	const localeNavigate = useLocaleNavigate();

	const handleAddApiBtnClick = () => {
		localeNavigate(
			routes.subAccounts.getApiCreateQuery({ [URL_VARS.SUB_ACCOUNT]: subAccount?.uid }),
		);
	};

	const handleClickCopy = (): void => {
		copyClick(subAccount?.uid || "");
	};

	return (
		<div className={cn(subAccStyles.header, subAccStyles.api_details)}>
			<div className={styles.header_main_info}>
				<div className={styles.account_info}>
					<div className={styles.account_title}>{subAccount?.login}</div>
					<div className={styles.account_secondary_title}>
						User Id: {subAccount?.uid}{" "}
						<i className={cn(subAccStyles.copy_btn, "ai ai-copy_new")} onClick={handleClickCopy} />
					</div>
					<div className={styles.account_secondary_title}>{subAccount?.email}</div>
				</div>
				<InternalLink className={styles.balances_link} to={routes.subAccounts.balances}>
					{formatMessage(subAccountMessages.sub_acc_go_to_balances)}
				</InternalLink>
			</div>
			<div className={styles.account_meta}>
				<div className={styles.last_action}>
					{formatMessage(accountMessages.subaccount_last_activity)}{" "}
					{dayjs(subAccount?.created_at).format("DD/MM/YY HH:mm:ss")}
				</div>
				<Button
					className={styles.add_api_btn}
					iconCode="plus"
					iconAlign="left"
					variant="filled"
					color="primary"
					fullWidth
					onClick={handleAddApiBtnClick}
					label={formatMessage(accountMessages.subaccount_add_api)}
				/>
			</div>
		</div>
	);
};

export default Header;

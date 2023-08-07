import React from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";
import subStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import accountMessages from "messages/account";
import { Header, AccountManagementTable } from "components/SubAccounts/AccountManagement";
import { getPageTitle } from "helpers/global";

const AccountManagement: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<>
			<Helmet
				title={getPageTitle(`${formatMessage(accountMessages.subaccount_account_management)}`)}
			/>
			<div className={subStyles.container}>
				<Header />
				<AccountManagementTable />
			</div>
		</>
	);
};

export default AccountManagement;

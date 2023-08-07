import React from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";
import subStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import accountMessages from "messages/account";
import { Header, LoginHistoryTable } from "components/SubAccounts/LoginHistory";
import { getPageTitle } from "helpers/global";

const LoginHistory: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<>
			<Helmet title={getPageTitle(formatMessage(accountMessages.subaccount_login_history))} />
			<div className={subStyles.container}>
				<Header />
				<LoginHistoryTable />
			</div>
		</>
	);
};

export default LoginHistory;

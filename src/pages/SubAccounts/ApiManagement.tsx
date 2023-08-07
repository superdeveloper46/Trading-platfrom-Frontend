import React from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";
import subStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import accountMessages from "messages/account";
import { ApiManagementTable, Header } from "components/SubAccounts/ApiManagement";
import { getPageTitle } from "helpers/global";

const ApiManagement: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<>
			<Helmet title={getPageTitle(formatMessage(accountMessages.subaccount_api_management))} />
			<div className={subStyles.container}>
				<Header />
				<ApiManagementTable />
			</div>
		</>
	);
};

export default ApiManagement;

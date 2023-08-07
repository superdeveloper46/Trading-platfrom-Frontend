import React from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";
import subStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import accountMessages from "messages/account";
import { Header, OrderManagementTable } from "components/SubAccounts/OrderManagement";
import { getPageTitle } from "helpers/global";

const OrderManagement: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<>
			<Helmet title={getPageTitle(formatMessage(accountMessages.subaccount_order_management))} />
			<div className={subStyles.container}>
				<Header />
				<OrderManagementTable />
			</div>
		</>
	);
};

export default OrderManagement;

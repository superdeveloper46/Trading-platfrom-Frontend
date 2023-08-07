import React from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";
import subStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import accountMessages from "messages/account";
import { Header, TransferHistoryTable } from "components/SubAccounts/TransferHistory";
import { getPageTitle } from "helpers/global";

const TransferHistory: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<>
			<Helmet title={getPageTitle(formatMessage(accountMessages.subaccount_transfer_history))} />
			<div className={subStyles.container}>
				<Header />
				<TransferHistoryTable />
			</div>
		</>
	);
};

export default TransferHistory;

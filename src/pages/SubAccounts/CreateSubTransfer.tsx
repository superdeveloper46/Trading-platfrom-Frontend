import React from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";
import subStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import financeMessages from "messages/finance";
import { TransferHistoryTable } from "components/SubAccounts/TransferHistory";
import { SubTransferForm } from "components/SubAccounts/SubTransfer";
import { getPageTitle } from "helpers/global";

const CreateSubTransfer: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<>
			<Helmet title={getPageTitle(formatMessage(financeMessages.transfer))} />
			<div className={subStyles.container}>
				<SubTransferForm />
				<TransferHistoryTable withTitle />
			</div>
		</>
	);
};

export default CreateSubTransfer;

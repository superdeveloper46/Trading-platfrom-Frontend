import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";
import { useParams } from "react-router-dom";

import subStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import accountMessages from "messages/account";
import { Header } from "components/SubAccounts/SubAccountApiManagement";
import SubAccountApiTable from "components/SubAccounts/SubAccountApiManagement/SubAccountApiTable/SubAccountApiTable";
import { ISubAccount } from "types/subAccounts";
import SubAccountsService from "services/SubAccountsService";
import { getPageTitle } from "helpers/global";

const SubAccountApiManagement: React.FC = () => {
	const { formatMessage } = useIntl();

	const { uid } = useParams<{ uid: string }>();

	const [subAccount, setSubAccount] = useState<ISubAccount>();

	useEffect(() => {
		if (uid) {
			SubAccountsService.getSubAccount(uid).then((acc) => {
				setSubAccount(acc);
			});
		}
	}, [uid]);

	return (
		<>
			<Helmet title={getPageTitle(formatMessage(accountMessages.subaccount_api_management))} />
			<div className={subStyles.container}>
				<Header subAccount={subAccount} />
				<SubAccountApiTable uid={uid || ""} />
			</div>
		</>
	);
};

export default SubAccountApiManagement;

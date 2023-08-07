import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import subStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import accountMessages from "messages/account";
import { EditSubApiForm, Header } from "components/SubAccounts/EditSubApi";
import Breadcrumbs from "components/Breadcrumbs";
import { useMst } from "models/Root";
import { ISubApi } from "types/subAccounts";
import errorHandler from "utils/errorHandler";
import SubAccountsService from "services/SubAccountsService";
import { getPageTitle } from "helpers/global";
import { routes } from "constants/routing";

const EditSubApi: React.FC = () => {
	const { formatMessage } = useIntl();

	const { uid } = useParams<{ uid: string }>();

	const {
		tickers: { loadTickers },
	} = useMst();

	const [currentApiKeyDetails, setCurrentApiKeyDetails] = useState<undefined | ISubApi>();
	const [isApiKeyLoading, setIsApiKeyLoading] = useState<boolean>(true);

	useEffect(() => {
		if (uid) {
			setIsApiKeyLoading(true);
			SubAccountsService.getSubAccountApiKeyDetail(uid)
				.then(setCurrentApiKeyDetails)
				.catch(errorHandler)
				.finally(() => setIsApiKeyLoading(false));
		}
	}, [uid]);

	useEffect(() => {
		loadTickers();
	}, []);

	return (
		<>
			<Helmet
				title={getPageTitle(
					`${formatMessage(accountMessages.subaccount_account_management)} | ${formatMessage(
						accountMessages.subaccount_create_sub_api, // FIXME Translate
					)}`,
				)}
			/>
			<div className={subStyles.container}>
				<Breadcrumbs
					links={[
						{
							link: routes.subAccounts.apiManagement,
							label: formatMessage(accountMessages.subaccount_api_management),
						},
					]}
					current={formatMessage(accountMessages.subaccount_table_api)}
				/>
				<Header isLoading={isApiKeyLoading} subApiKeyDetails={currentApiKeyDetails} />
				<EditSubApiForm isLoading={isApiKeyLoading} subApiKeyDetails={currentApiKeyDetails} />
			</div>
		</>
	);
};

export default observer(EditSubApi);

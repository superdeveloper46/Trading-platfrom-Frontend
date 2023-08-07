import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import Helmet from "react-helmet";

import accountMessages from "messages/account";
import { CreateSubApiForm } from "components/SubAccounts/CreateSubApi";
import Breadcrumbs from "components/Breadcrumbs";
import pagesStyles from "styles/pages/Page.module.scss";
import { getPageTitle } from "helpers/global";
import { useMst } from "models/Root";
import { routes } from "constants/routing";

const CreateSubApi: React.FC = () => {
	const { formatMessage } = useIntl();
	const {
		subAccounts: { getSubAccounts },
	} = useMst();

	useEffect(() => {
		getSubAccounts();
	}, []);

	return (
		<>
			<Helmet
				title={getPageTitle(
					`${formatMessage(accountMessages.subaccount_account_management)} | ${formatMessage(
						accountMessages.subaccount_create_sub_api,
					)}`,
				)}
			/>
			<div className={cn(pagesStyles.page_container_outer, pagesStyles.md)}>
				<Breadcrumbs
					links={[
						{
							link: routes.subAccounts.apiManagement,
							label: formatMessage(accountMessages.subaccount_api_management),
						},
					]}
					current={formatMessage(accountMessages.subaccount_table_api)}
				/>
				<CreateSubApiForm />
			</div>
		</>
	);
};

export default CreateSubApi;

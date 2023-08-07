import React from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";
import cn from "classnames";

import pagesStyles from "styles/pages/Page.module.scss";
import accountMessages from "messages/account";
import Breadcrumbs from "components/Breadcrumbs";
import { CreateSubAccountForm } from "components/SubAccounts/CreateSubAccount";
import { getPageTitle } from "helpers/global";
import { routes } from "constants/routing";

const CreateSubAccount: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<>
			<Helmet
				title={getPageTitle(
					`${formatMessage(accountMessages.subaccount_account_management)} | ${formatMessage(
						accountMessages.subaccount_create_subaccount,
					)}`,
				)}
			/>
			<div className={cn(pagesStyles.page_container_outer, pagesStyles.md)}>
				<Breadcrumbs
					links={[
						{
							link: routes.subAccounts.accountManagement,
							label: formatMessage(accountMessages.subaccount_account_management),
						},
					]}
					current={formatMessage(accountMessages.subaccount_create_subaccount)}
				/>
				<CreateSubAccountForm />
			</div>
		</>
	);
};

export default CreateSubAccount;

import React from "react";
import Helmet from "react-helmet";
import { useIntl } from "react-intl";
import cn from "classnames";

import commonMessages from "messages/common";
import Breadcrumbs from "components/Breadcrumbs";
import AuthenticatorSetup from "components/Profile/Security/AuthenticatorSetup";
import subStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import SubAccountsService from "services/SubAccountsService";
import { getPageTitle } from "helpers/global";
import useParamQuery from "hooks/useSearchQuery";
import { queryVars } from "constants/query";
import { routes } from "constants/routing";

const Authenticator: React.FC = () => {
	const { formatMessage } = useIntl();

	const query = useParamQuery();
	const querySubAccount = query.get("sub-account");

	return (
		<>
			<Helmet title={getPageTitle(`${formatMessage(commonMessages.security)} | 2FA`)} />
			<div className={cn(subStyles.container, subStyles.sub_authenticator, subStyles.md)}>
				<Breadcrumbs
					links={[
						{
							link: routes.subAccounts.accountManagement,
							label: formatMessage(commonMessages.sub_accounts),
						},
					]}
					current="2FA"
				/>
				<AuthenticatorSetup
					subAccountMode
					generateCallback={() => SubAccountsService.generateKeyTwoFASub(querySubAccount || "")}
					setupCallback={(token) =>
						SubAccountsService.enableTwoFASub({
							token,
							[queryVars.sub_account]: querySubAccount || "",
						})
					}
				/>
			</div>
		</>
	);
};

export default Authenticator;

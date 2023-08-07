import React from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import { useMst } from "models/Root";
import subAccStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import accountMessages from "messages/account";
import subAccountMessages from "messages/sub_accounts";
import pageStyles from "styles/pages/Page.module.scss";
import Button from "components/UI/Button";
import styleProps from "utils/styleProps";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";

const Header: React.FC = () => {
	const { formatMessage } = useIntl();

	const {
		subAccounts: { accounts, isAccountsLoading },
	} = useMst();

	const localeNavigate = useLocaleNavigate();

	const handleAddApiClick = () => {
		if (accounts && accounts.length) {
			localeNavigate(routes.subAccounts.apiCreate);
		} else {
			toast(formatMessage(subAccountMessages.sub_acc_create_sub_acc_first));
		}
	};

	return (
		<div className={cn(subAccStyles.header, subAccStyles.api)}>
			<div className={subAccStyles.header_title_container}>
				<h1>{formatMessage(accountMessages.subaccount_api_management)}</h1>
				<h2 style={styleProps({ fontWeight: "normal" })}>
					{formatMessage(subAccountMessages.sub_acc_api_management_subtitle)}
				</h2>
			</div>
			<div className={cn(pageStyles.header_actions, pageStyles.start)}>
				<Button
					onClick={handleAddApiClick}
					variant="text"
					iconAlign="left"
					iconCode="listing"
					label={formatMessage(accountMessages.subaccount_add_api)}
					color="primary"
					fontVariant="bold"
					isLoading={isAccountsLoading}
					fullWidth
					mini
				/>
			</div>
		</div>
	);
};

export default observer(Header);

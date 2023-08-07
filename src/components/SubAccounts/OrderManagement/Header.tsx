import React from "react";
import { useIntl } from "react-intl";
import subAccStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import accountMessages from "messages/account";
import styleProps from "../../../utils/styleProps";

const Header: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<div className={subAccStyles.header}>
			<h1 style={styleProps({ margin: 0 })}>
				{formatMessage(accountMessages.subaccount_order_management)}
			</h1>
		</div>
	);
};

export default Header;

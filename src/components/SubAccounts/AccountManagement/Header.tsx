import React, { useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import subAccStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import pageStyles from "styles/pages/Page.module.scss";
import accountMessages from "messages/account";
import subAccountsMessages from "messages/sub_accounts";
import { useMst } from "models/Root";
import VerificationModal from "components/BuyCrypto/VerificationModal";
import Button from "components/UI/Button";
import styleProps from "utils/styleProps";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";

const Header: React.FC = () => {
	const { formatMessage } = useIntl();
	const {
		account: { profileStatus },
	} = useMst();

	const [isVerificationModalOpened, setIsVerificationModalOpened] = useState(false);

	const localeNavigate = useLocaleNavigate();

	const onClickSubAccountCreate = () => {
		if (!profileStatus || profileStatus.verification_level < 1) {
			setIsVerificationModalOpened(true);
		} else {
			localeNavigate(routes.subAccounts.create);
		}
	};

	return (
		<div className={subAccStyles.header}>
			<h1 style={styleProps({ margin: 0 })}>
				{formatMessage(accountMessages.subaccount_account_management)}
			</h1>
			<div className={cn(pageStyles.header_actions, pageStyles.end)}>
				<Button
					variant="text"
					iconAlign="left"
					iconCode="listing"
					label={formatMessage(subAccountsMessages.add_sub_account)}
					color="primary"
					fontVariant="bold"
					fullWidth
					mini
					isLoading={!profileStatus}
					onClick={onClickSubAccountCreate}
				/>
			</div>
			<VerificationModal
				isOpen={isVerificationModalOpened}
				label={formatMessage(subAccountsMessages.verification_lvl1_to_create, {
					asset: formatMessage(subAccountsMessages.sub_account),
				})}
				onClose={() => setIsVerificationModalOpened(false)}
			/>
		</div>
	);
};

export default observer(Header);

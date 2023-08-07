import React, { useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import subAccStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import pageStyles from "styles/pages/Page.module.scss";
import styles from "styles/pages/SubAccounts/Balances.module.scss";
import accountMessages from "messages/account";
import styleProps from "utils/styleProps";
import { useMst } from "models/Root";
import VerificationModal from "components/BuyCrypto/VerificationModal";
import financeMessages from "messages/finance";
import subAccountsMessages from "messages/sub_accounts";
import Button from "components/UI/Button";
import InternalLink from "components/InternalLink";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";

const Header: React.FC = () => {
	const {
		subAccounts: { totalBalance },
		account: { totalBalance: totalBalanceMaster, profileStatus },
	} = useMst();

	const [isVerificationModalOpened, setIsVerificationModalOpened] = useState(false);

	const { formatMessage, formatNumber } = useIntl();
	const localeNavigate = useLocaleNavigate();

	const onClickSubAccountCreate = () => {
		if (!profileStatus || profileStatus.verification_level < 1) {
			setIsVerificationModalOpened(true);
		} else {
			localeNavigate(routes.subAccounts.create);
		}
	};

	return (
		<div className={cn(subAccStyles.header, subAccStyles.balance)}>
			<VerificationModal
				isOpen={isVerificationModalOpened}
				label={formatMessage(subAccountsMessages.verification_lvl1_to_create, {
					asset: formatMessage(subAccountsMessages.sub_account),
				})}
				onClose={() => setIsVerificationModalOpened(false)}
			/>
			<div className={subAccStyles.header_title_container}>
				<h1 style={styleProps({ margin: "0 0 15px" })}>
					{formatMessage(accountMessages.subaccount_balance_sub_accounts)}
				</h1>
				<div className={styles.approximate}>
					<div className={styles.approximate_item}>
						<span>{formatMessage(subAccountsMessages.master_account_balance)}</span>
						<div className={styles.approximate_item_value}>
							<i className="ai ai-btc" />
							<b>
								{totalBalanceMaster
									? formatNumber(totalBalanceMaster.BTC ?? 0, {
											maximumFractionDigits: 8,
											minimumFractionDigits: 8,
									  })
									: "--"}
								&nbsp;≈
							</b>
							&nbsp;
							<span>
								<i className="ai ai-usd" />
								{totalBalanceMaster
									? formatNumber(totalBalanceMaster.USDT ?? 0, {
											useGrouping: false,
											maximumFractionDigits: 2,
											minimumFractionDigits: 2,
									  })
									: "--"}
							</span>
						</div>
					</div>
					<div className={styles.approximate_item}>
						<span>{formatMessage(subAccountsMessages.balance_of_all_subaccounts)}</span>
						<div className={styles.approximate_item_value}>
							<i className="ai ai-btc" />
							<b>
								{totalBalance
									? formatNumber(totalBalance.BTC ?? 0, {
											useGrouping: false,
											maximumFractionDigits: 8,
											minimumFractionDigits: 8,
									  })
									: "--"}
								&nbsp;≈
							</b>
							&nbsp;
							<span>
								<i className="ai ai-usd" />
								{totalBalance
									? formatNumber(totalBalance.USDT ?? 0, {
											useGrouping: false,
											maximumFractionDigits: 2,
											minimumFractionDigits: 2,
									  })
									: "--"}
							</span>
						</div>
					</div>
				</div>
			</div>
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
				<InternalLink to={routes.subAccounts.transfer}>
					<Button
						variant="filled"
						label={formatMessage(financeMessages.transfer)}
						color="primary"
						fullWidth
						mini
					/>
				</InternalLink>
			</div>
		</div>
	);
};

export default observer(Header);

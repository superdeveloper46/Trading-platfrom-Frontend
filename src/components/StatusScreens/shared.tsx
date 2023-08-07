import React from "react";
import { FormattedMessage } from "react-intl";

import financeMessages from "messages/finance";
import historyMessages from "messages/history";
import styles from "styles/components/ConfirmationComponents.module.scss";
import { routes, URL_VARS } from "constants/routing";
import InternalLink from "../InternalLink";

interface NewWithdrawLinkProps {
	currency: string;
}

export const WalletsLink: React.FC = React.memo(() => (
	<div className={styles.result_link_group_container}>
		<InternalLink to={routes.profile.wallets} className={styles.result_link}>
			<i className="ai ai-purse" />
			<FormattedMessage {...financeMessages.go_to_my_wallet} />
		</InternalLink>
	</div>
));

export const CreateWithdrawLink: React.FC<NewWithdrawLinkProps> = React.memo(({ currency }) => (
	<div className={styles.footer_link_container}>
		<InternalLink to={routes.profile.getWithdrawCurrency(currency)}>
			<FormattedMessage {...financeMessages.create_new_withdraw} />
		</InternalLink>
	</div>
));

export const TradesLink: React.FC = React.memo(() => (
	<div className={styles.result_link_group_container}>
		<InternalLink to={routes.trade.getPair("BTC_USDT")} className={styles.result_link}>
			<i className="ai ai-mini_arrow_double" style={{ fontSize: "27px", marginRight: "0" }} />
			<FormattedMessage {...financeMessages.return_to_trades} />
		</InternalLink>
	</div>
));

export const DepositHistoryLink: React.FC = React.memo(() => (
	<div className={styles.result_link_group_container}>
		<InternalLink to={routes.financeHistory.deposits} className={styles.result_link}>
			<i className="ai ai-purse" />
			<FormattedMessage {...historyMessages.deposits_history} />
		</InternalLink>
	</div>
));

export const DepositHelpLink: React.FC = React.memo(() => (
	<div className={styles.footer_link_container}>
		<InternalLink to={`/${URL_VARS.SUPPORT}/issues-with-depositswithdrawal`}>
			<FormattedMessage {...financeMessages.troubles_with_deposit} />
		</InternalLink>
	</div>
));

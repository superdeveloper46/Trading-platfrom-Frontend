import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";
import subStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import accountMessages from "messages/account";
import { BalanceTable, Header } from "components/SubAccounts/Balance";
import { useMst } from "models/Root";
import { observer } from "mobx-react-lite";
import { getPageTitle } from "helpers/global";

const Balance: React.FC = () => {
	const { formatMessage } = useIntl();
	const {
		account: { loadRates, rates },
		tickers: { loadTickers, list: tickers },
		subAccounts: { balances, getBalances, updateBalancesValuations },
	} = useMst();

	useEffect(() => {
		loadTickers();
		loadRates();
		getBalances();
	}, []);

	useEffect(() => {
		if (rates.length && tickers.length && balances.length) {
			updateBalancesValuations(tickers, rates);
		}
	}, [rates.length, tickers.length, balances.length]);

	return (
		<>
			<Helmet
				title={getPageTitle(formatMessage(accountMessages.subaccount_balance_sub_accounts))}
			/>
			<div className={subStyles.container}>
				<Header />
				<BalanceTable />
			</div>
		</>
	);
};

export default observer(Balance);

import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import commonMessages from "messages/common";
import PreviousWithdrawals from "components/Withdrawal/PreviousWithdrawals";
import WithdrawalForm from "components/Withdrawal/WithdrawalForm";
import { useMst } from "models/Root";
import { SidebarMenuLevelsEnum } from "types/sidebarMenuLevels";
import ProfileLayout from "layouts/ProfileLayout";
import styles from "styles/pages/DepositWithdrawal.module.scss";
import { IBalance } from "models/Account";
import { getPageTitle } from "helpers/global";
import WebSocket, { WSListenEventEnum } from "components/WebSocket";
import { queryVars } from "constants/query";

const Withdrawal: React.FC = () => {
	const { withdrawal, account } = useMst();
	const { balances } = account;
	const { formatMessage } = useIntl();
	const { currency } = useParams<{ [queryVars.currency]: string }>();

	useEffect(() => {
		account.loadBalances();
		withdrawal.getPreviousWithdraws();
	}, []);

	useEffect(() => {
		if (currency) {
			withdrawal.getWithdrawLimit({ currency });
			withdrawal.withdrawMethodsInit({ currency });
			withdrawal.getCurrentBalance(currency);
		}
	}, [currency]);

	useEffect(() => {
		if (balances.length && currency) {
			const curr: IBalance | undefined = balances.find(
				(c: IBalance) => c.code.toUpperCase() === currency.toUpperCase(),
			);
			withdrawal.setCurrentCurrency(curr);
		}
	}, [balances.length, currency]);

	return (
		<ProfileLayout sidebarMenuLevel={SidebarMenuLevelsEnum.Wallets}>
			<div className={styles.container}>
				<Helmet title={getPageTitle(`${formatMessage(commonMessages.withdraw)} - ${currency}`)} />
				<WithdrawalForm />
				<PreviousWithdrawals />
			</div>
			<WebSocket events={[WSListenEventEnum.WALLETS]} />
		</ProfileLayout>
	);
};

export default observer(Withdrawal);

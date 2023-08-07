import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { useIntl } from "react-intl";
import { useParams } from "react-router";
import messages from "messages/finance";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";
import DepositForm from "components/Deposit/DepositForm";
import PreviousDeposits from "components/Deposit/PreviousDeposits";
import { SidebarMenuLevelsEnum } from "types/sidebarMenuLevels";
import ProfileLayout from "layouts/ProfileLayout";
import styles from "styles/pages/DepositWithdrawal.module.scss";
import { IBalance } from "models/Account";
import { getPageTitle } from "helpers/global";
import WebSocket, { WSListenEventEnum } from "components/WebSocket";
import { queryVars } from "constants/query";

const Deposit: React.FC = () => {
	const { formatMessage } = useIntl();
	const { deposit, account } = useMst();
	const { currency } = useParams<{ [queryVars.currency]: string }>();
	const { balances } = account;

	useEffect(() => {
		account.loadBalances();
		deposit.getPreviousDeposits();
	}, []);

	useEffect(() => {
		if (currency) {
			deposit.depositMethodsInit({ currency });
		}
	}, [currency]);

	useEffect(() => {
		if (balances.length && currency) {
			const curr: IBalance | undefined = balances.find(
				(c: IBalance) => c.code?.toUpperCase() === currency.toUpperCase(),
			);
			deposit.setCurrentCurrency(curr);
		}
	}, [balances.length, currency]);

	return (
		<ProfileLayout sidebarMenuLevel={SidebarMenuLevelsEnum.Wallets}>
			<div className={styles.container}>
				<Helmet title={getPageTitle(`${formatMessage(messages.deposit)} - ${currency}`)} />
				<DepositForm />
				<PreviousDeposits />
			</div>
			<WebSocket events={[WSListenEventEnum.WALLETS]} />
		</ProfileLayout>
	);
};

export default observer(Deposit);

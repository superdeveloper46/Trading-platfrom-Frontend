import React from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import styles from "styles/pages/Terminal.module.scss";
import messages from "messages/exchange";
import financeMessages from "messages/finance";
import { Table } from "components/UI/Table";
import { IHeaderColumn } from "components/UI/Table/Table";
import { useMst } from "models/Root";
import useAccountType from "hooks/useAccountType";
import NoRowsMessage from "components/Table/NoRowsMessage";
import InternalLink from "components/InternalLink";
import Button from "components/UI/Button";
import useWindowSize from "hooks/useWindowSize";
import { getBalancesFilled } from "helpers/account";
import { routes } from "constants/routing";
import WalletsRow from "./WalletsRow";

const Wallets: React.FC = () => {
	const {
		account: { balancesCrossFilled, balancesFilled, balancesIsolatedFilled },
		terminal: { pair },
	} = useMst();
	const { formatMessage } = useIntl();
	const { mobile } = useWindowSize();
	const type = useAccountType();

	const balances = getBalancesFilled(
		type,
		balancesFilled,
		balancesCrossFilled,
		balancesIsolatedFilled,
	);

	const columns: IHeaderColumn[] = [
		{
			label: formatMessage(messages.currency),
		},
		{
			label: (
				<>
					{formatMessage(financeMessages.available)}&nbsp;/&nbsp;
					{formatMessage(financeMessages.reserve)}
				</>
			),
			align: "right",
		},
		{
			label: formatMessage(messages.refill),
			align: "right",
			width: "50px",
		},
	];

	return (
		<div className={styles.wallets}>
			<Table
				stripped
				header={{
					primary: true,
					columns,
				}}
			>
				{balances.length ? (
					balances.map((b) => <WalletsRow key={b.code} type={type} balance={b} />)
				) : (
					<NoRowsMessage>
						<i className="ai ai-wallet-03" />
						<span>
							{formatMessage(messages.wallets_no_data, {
								link: pair ? (
									<InternalLink
										to={routes.profile.getDepositCurrency(pair.base_currency_code)}
										className="text-center"
									>
										Deposit {pair.base_currency_code}&nbsp;
										{pair.base_currency_name ? `(${pair.base_currency_name})` : ""}
									</InternalLink>
								) : (
									"--"
								),
							})}
						</span>
					</NoRowsMessage>
				)}
			</Table>
			<InternalLink to={routes.profile.wallets} className={styles.wallets_accounts_link}>
				<Button
					label={formatMessage(messages.all_accounts)}
					color="primary"
					variant={mobile ? "filled" : "text"}
					iconAlign="left"
					fullWidth
					iconCode="balance"
					mini
				/>
			</InternalLink>
		</div>
	);
};

export default observer(Wallets);

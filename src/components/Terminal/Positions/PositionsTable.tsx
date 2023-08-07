import React from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import { IHeaderColumn } from "components/UI/Table/Table";
import messages from "messages/exchange";
import commonMessages from "messages/common";
import { Table } from "components/UI/Table";
import historyMessages from "messages/history";
import { AccountTypeEnum } from "types/account";
import { useMst } from "models/Root";
import useAccountType from "hooks/useAccountType";
import NoRowsMessage from "components/Table/NoRowsMessage";
import InternalLink from "components/InternalLink";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { ACCOUNT_TYPE } from "constants/exchange";
import { routes } from "constants/routing";
import PositionsTableRow from "./PositionsTableRow";

const PositionsTable: React.FC = () => {
	const {
		history: { positions, isPositionsLoading },
		global: { isAuthenticated },
		tickers: { list: tickers },
		account: { balancesCross, balancesIsolated },
		finance: { marginOptions },
		terminal: { pair },
	} = useMst();
	const { formatMessage } = useIntl();
	const pairSymbol = pair?.symbol ?? "";
	const accountType = useAccountType();

	const currentOption = marginOptions.find(
		(o) =>
			o.wallet_type === ACCOUNT_TYPE[accountType] &&
			(accountType === AccountTypeEnum.ISOLATED ? o.pair?.symbol === pairSymbol : true),
	);

	const columns: IHeaderColumn[] = [
		{
			name: "date",
			label: formatMessage(commonMessages.date),
			width: "200px",
		},
		{
			name: "pair",
			label: formatMessage(commonMessages.pair),
			width: "100px",
		},
		{
			name: "direction",
			label: formatMessage(messages.position_direction),
			align: "center",
			width: "80px",
		},
		{
			name: "base_price",
			label: formatMessage(messages.position_base_price),
			align: "right",
			width: "120px",
		},
		{
			name: "amount",
			label: formatMessage(historyMessages.orders_table_amount),
			align: "right",
			width: "120px",
		},
		{
			name: "index_price",
			label: formatMessage(messages.position_index_price),
			align: "right",
			width: "100px",
		},
		{
			name: "liq_price",
			label: formatMessage(messages.position_liq_price),
			align: "right",
			width: "120px",
		},
		{
			name: "p_n_l",
			label: formatMessage(messages.position_p_n_l),
			align: "right",
			width: "100px",
		},
		{
			name: "p_n_l_percentage",
			label: `${formatMessage(messages.position_p_n_l)}%`,
			width: "100px",
		},
	];

	return (
		<Table
			stripped
			header={{
				primary: true,
				columns,
			}}
		>
			{isAuthenticated ? (
				(isPositionsLoading && positions.length === 0) || !marginOptions ? (
					<LoadingSpinner verticalMargin="40px" />
				) : positions.length > 0 && currentOption ? (
					positions.map((p) => (
						<PositionsTableRow
							key={p.pair.symbol}
							position={p}
							tickers={tickers}
							balancesCross={balancesCross}
							balancesIsolated={balancesIsolated}
							marginOption={currentOption}
						/>
					))
				) : (
					<NoRowsMessage small>
						<i className="ai ai-orders" />
						{formatMessage(commonMessages.no_elements_to_show)}
					</NoRowsMessage>
				)
			) : (
				<NoRowsMessage small>
					<i className="ai ai-orders" />
					<span>
						{formatMessage(historyMessages.positions_history_login_msg, {
							ref1: (
								<>
									<br />
									<InternalLink to={routes.login.root}>
										{formatMessage(commonMessages.login_noun)}
									</InternalLink>
								</>
							),
							ref2: (
								<InternalLink to={routes.register.root}>
									{formatMessage(commonMessages.registerAction)}
								</InternalLink>
							),
						})}
					</span>
				</NoRowsMessage>
			)}
		</Table>
	);
};

export default observer(PositionsTable);

import React from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import { useMst } from "models/Root";
import styles from "styles/pages/Terminal.module.scss";
import { Table } from "components/UI/Table";
import historyMessages from "messages/history";
import exchangeMessages from "messages/exchange";
import useAccountType from "hooks/useAccountType";
import commonMessages from "messages/common";
import InternalLink from "components/InternalLink";
import { IHeaderColumn } from "components/UI/Table/Table";
import { ACCOUNT_TYPE } from "constants/exchange";
import LoadingSpinner from "components/UI/LoadingSpinner";
import EmptyTableData from "components/EmptyTableData";
import LoadingOverlay from "components/Terminal/LoadingOverlay";
import { AccountTypeEnum } from "types/account";
import Tooltip from "components/UI/Tooltip";
import { IBalance } from "models/Account";
import { IMarginOption } from "models/Finance";
import { routes } from "constants/routing";
import FundsRow from "./FundsRow";

const Funds: React.FC = () => {
	const {
		account: { balancesCross, balancesIsolated, isBalancesLoaded },
		terminal: { pair },
		finance: { marginOptions },
		global: { isAuthenticated },
		tickers: { list: tickers },
	} = useMst();
	const accountType = useAccountType();
	const { formatMessage } = useIntl();
	const pairSymbol = pair?.symbol ?? "";

	const marginBalances: { [key: string]: IBalance[] } = {
		cross: balancesCross,
		isolated: balancesIsolated,
	};

	const currentMarginBalances = marginBalances[accountType] ?? [];
	const currentOption = marginOptions.find(
		(o: IMarginOption) =>
			o.wallet_type === ACCOUNT_TYPE[accountType] &&
			(accountType === AccountTypeEnum.ISOLATED ? o.pair?.symbol === pairSymbol : true),
	);

	const equityCurrencyCode = currentOption?.equity_currency?.code;

	const filterEmptyNPair = (b: IBalance) =>
		(b.debt > 0 || +b.balance > 0) && (b.pair ? b.pair.replace("/", "_") === pairSymbol : true);

	const funds: IBalance[] = currentMarginBalances.filter(filterEmptyNPair);

	const columns: IHeaderColumn[] = [
		{
			name: "currency",
			label: formatMessage(historyMessages.funds_currency),
			width: "100px",
		},
		{
			name: "available",
			label: formatMessage(historyMessages.funds_available),
			width: "120px",
			align: "right",
		},
		{
			name: "total",
			label: formatMessage(historyMessages.funds_total),
			align: "right",
			width: "120px",
		},
		{
			name: "debt",
			label: formatMessage(historyMessages.funds_debt),
			align: "right",
			width: "120px",
		},
		{
			name: "position",
			label: formatMessage(historyMessages.funds_position),
			align: "right",
			width: "120px",
		},
		{
			name: "position-valuation",
			label: `${formatMessage(historyMessages.funds_position)} ${equityCurrencyCode}`,
			align: "right",
			width: "120px",
		},
		{
			name: "index-price",
			label: `${formatMessage(historyMessages.funds_index_price)} ${equityCurrencyCode}`,
			align: "right",
			width: "120px",
		},
		{
			name: "liq-price",
			label: `${formatMessage(historyMessages.funds_liq_price)} ${equityCurrencyCode}`,
			align: "right",
			width: "120px",
		},
	];

	return (
		<Table
			stripped
			className={styles.orders_history_table_content}
			header={{
				primary: true,
				columns,
			}}
		>
			{isAuthenticated ? (
				!isBalancesLoaded && !funds.length ? (
					<LoadingSpinner verticalMargin="50px" />
				) : funds.length > 0 ? (
					<>
						<LoadingOverlay />
						{currentOption ? (
							accountType === AccountTypeEnum.ISOLATED && funds.length === 2 ? (
								<FundsRow
									balance={funds[0]}
									balanceQuote={funds[1]}
									tickers={tickers}
									balancesCross={balancesCross}
									balancesIsolated={balancesIsolated}
									marginOption={currentOption}
								/>
							) : (
								funds.map((f, idx) => (
									<FundsRow
										key={idx}
										balance={f}
										tickers={tickers}
										balancesCross={balancesCross}
										balancesIsolated={balancesIsolated}
										marginOption={currentOption}
									/>
								))
							)
						) : null}
						<Tooltip id="trades">{formatMessage(historyMessages.trades)}</Tooltip>
					</>
				) : (
					<EmptyTableData />
				)
			) : (
				<EmptyTableData
					message={formatMessage(exchangeMessages.exchange_form_login_msg, {
						link1: (
							<InternalLink to={routes.login.root}>
								{formatMessage(commonMessages.login_noun)}
							</InternalLink>
						),
						link2: (
							<InternalLink to={routes.register.root} className="text-center text-underline">
								{formatMessage(commonMessages.registerAction)}
							</InternalLink>
						),
					})}
				/>
			)}
		</Table>
	);
};

export default observer(Funds);

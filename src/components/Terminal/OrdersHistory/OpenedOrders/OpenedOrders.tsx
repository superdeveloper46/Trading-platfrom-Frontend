import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import { useMst } from "models/Root";
import styles from "styles/pages/Terminal.module.scss";
import { Table } from "components/UI/Table";
import historyMessages from "messages/history";
import useAccountType from "hooks/useAccountType";
import commonMessages from "messages/common";
import InternalLink from "components/InternalLink";
import { IHeaderColumn } from "components/UI/Table/Table";
import { ACCOUNT_TYPE } from "constants/exchange";
import LoadingSpinner from "components/UI/LoadingSpinner";
import useTerminalLayout from "hooks/useTerminalLayout";
import EmptyTableData from "components/EmptyTableData";
import { AccountTypeEnum } from "types/account";
import LoadingOverlay from "components/Terminal/LoadingOverlay";
import Tooltip from "components/UI/Tooltip";
import { queryVars } from "constants/query";
import { routes } from "constants/routing";
import OpenedOrdersRow from "./OpenedOrdersRow";

const OpenedOrders: React.FC = () => {
	const {
		history: { openedOrders, isOpenedOrdersLoading, loadOpenedOrders, setFilteringSymbol },
		terminal: { isLoaded, pair, loadMarginCurrency, setShowAllOpenedOrders, showAllOpenedOrders },
		global: { isAuthenticated },
		render,
	} = useMst();
	const pairSymbol = pair?.symbol ?? "";
	const type = useAccountType();
	const layout = useTerminalLayout();
	const { formatMessage } = useIntl();

	const isMargin = render.margin && type !== AccountTypeEnum.SPOT;
	const isLoading = !isLoaded || isOpenedOrdersLoading;
	const openedOrdersByAccountType = openedOrders.filter((o) =>
		o.wallet_type ? o.wallet_type === ACCOUNT_TYPE[type] : true,
	);

	const loadMarginCurrencyStatus = () => {
		if (isMargin && pair) {
			loadMarginCurrency(
				ACCOUNT_TYPE[type],
				pair.base_currency_code || "",
				pair.quote_currency_code || "",
				type === AccountTypeEnum.ISOLATED ? pair.symbol : undefined,
			);
		}
	};

	useEffect(() => {
		if (isAuthenticated && pairSymbol) {
			setShowAllOpenedOrders(false);
			setFilteringSymbol("");
			const params = {
				[queryVars.pair]: pairSymbol,
				[queryVars.page_size]: 100,
				[queryVars.wallet_type]: ACCOUNT_TYPE[type],
			};
			loadOpenedOrders(params);
		}
	}, [isAuthenticated, pairSymbol, layout, type]);

	const columns: IHeaderColumn[] = [
		{
			name: "date",
			label: formatMessage(historyMessages.active_orders_date),
			width: "85px",
			maxWidth: "120px",
		},
		{
			name: "pair_id",
			label: formatMessage(historyMessages.active_orders_pair),
			width: "75px",
		},
		{
			name: "direction",
			label: formatMessage(historyMessages.active_orders_side),
			align: "center",
			width: "65px",
		},
		{
			name: "price",
			label: `${formatMessage(historyMessages.active_orders_price)}${
				!showAllOpenedOrders ? ` ${pair?.quote_currency_code ?? ""}` : ""
			}`,
			align: "right",
			width: "180px",
			minWidth: "180px",
		},
		{
			name: "amount",
			label: `${formatMessage(historyMessages.active_orders_amount)} ${
				!showAllOpenedOrders ? ` ${pair?.base_currency_code ?? ""}` : ""
			}`,
			align: "right",
			width: "160px",
			minWidth: "160px",
		},
		{
			name: "total_value",
			label: formatMessage(historyMessages.active_orders_total),
			align: "right",
			width: "120px",
			minWidth: "120px",
		},
		{
			name: "filled_value",
			label: formatMessage(historyMessages.active_orders_filled),
			align: "center",
			width: "70px",
		},
		{
			name: "cancel_order",
			label: formatMessage(historyMessages.active_orders_action_cancel),
			align: "right",
			width: "80px",
			maxWidth: "80px",
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
				isLoading && !openedOrdersByAccountType.length ? (
					<LoadingSpinner verticalMargin="50px" />
				) : openedOrdersByAccountType.length > 0 ? (
					<>
						<LoadingOverlay loadCondition={isOpenedOrdersLoading} />
						{openedOrdersByAccountType.map((o) => (
							<OpenedOrdersRow
								key={o.id}
								order={o}
								onMarginCurrencyLoad={loadMarginCurrencyStatus}
								showAllOpenedOrders={showAllOpenedOrders}
								pairPricePrecision={pair?.price_precision}
								pairAmountPrecision={pair?.amount_precision}
							/>
						))}
						<Tooltip id="cancel-order" place="left" />
						<Tooltip id="order-date" place="left" />
					</>
				) : (
					<EmptyTableData message={formatMessage(commonMessages.active_orders_no_data)} />
				)
			) : (
				<EmptyTableData
					message={formatMessage(historyMessages.active_orders_widget_login_msg, {
						ref1: (
							<>
								<br />
								<InternalLink to={routes.login.root}>
									{formatMessage(commonMessages.login_noun)}
								</InternalLink>
							</>
						),
						ref2: (
							<InternalLink to={routes.register.root} className="text-underline">
								{formatMessage(commonMessages.registerAction)}
							</InternalLink>
						),
					})}
				/>
			)}
		</Table>
	);
};

export default observer(OpenedOrders);

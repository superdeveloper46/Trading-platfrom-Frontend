import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";

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
import EmptyTableData from "components/EmptyTableData";
import LoadingOverlay from "components/Terminal/LoadingOverlay";
import Tooltip from "components/UI/Tooltip";
import { queryVars } from "constants/query";
import { routes } from "constants/routing";
import ClosedOrdersRow from "./ClosedOrdersRow";

const ClosedOrders: React.FC = () => {
	const {
		history: { closedOrders, isClosedOrdersLoading, loadClosedOrders },
		terminal: { isLoaded },
		global: { isAuthenticated },
	} = useMst();
	const { pair: pairSymbol } = useParams<{ pair: string }>();
	const terminalType = useAccountType();
	const { formatMessage } = useIntl();

	const closedOrdersByAccountType = closedOrders.filter((o) =>
		o.wallet_type ? o.wallet_type === ACCOUNT_TYPE[terminalType] : true,
	);

	const isLoading = !isLoaded || isClosedOrdersLoading;

	useEffect(() => {
		if (isAuthenticated && pairSymbol) {
			const params = {
				[queryVars.pair]: pairSymbol,
				[queryVars.page_size]: 100,
				[queryVars.wallet_type]: ACCOUNT_TYPE[terminalType],
			};
			loadClosedOrders(params);
		}
	}, [isAuthenticated, pairSymbol, terminalType]);

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
			width: "85px",
		},
		{
			name: "type",
			label: formatMessage(historyMessages.active_orders_type),
			align: "center",
			width: "85px",
		},
		{
			name: "side",
			label: formatMessage(historyMessages.active_orders_side),
			align: "center",
			width: "85px",
		},
		{
			name: "price",
			label: formatMessage(historyMessages.active_orders_price),
			align: "right",
			width: "85px",
		},
		{
			name: "price-avg",
			label: `${formatMessage(historyMessages.active_orders_price)} AVG`,
			align: "right",
			width: "85px",
		},
		{
			name: "filled_value",
			label: formatMessage(historyMessages.active_orders_filled),
			align: "center",
			width: "85px",
		},
		{
			name: "amount",
			label: formatMessage(historyMessages.active_orders_amount),
			align: "right",
			width: "85px",
		},
		{
			name: "total_value",
			label: formatMessage(historyMessages.active_orders_total),
			align: "right",
			width: "100px",
		},
		{
			name: "state",
			label: formatMessage(historyMessages.state),
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
				advanced: true,
				columns,
			}}
		>
			{isAuthenticated ? (
				isLoading && !closedOrdersByAccountType.length ? (
					<LoadingSpinner verticalMargin="50px" />
				) : closedOrdersByAccountType.length > 0 ? (
					<>
						<LoadingOverlay />
						{closedOrdersByAccountType.map((o) => (
							<ClosedOrdersRow key={o.id} order={o} />
						))}
						<Tooltip id="trades">{formatMessage(historyMessages.trades)}</Tooltip>
					</>
				) : (
					<EmptyTableData message={formatMessage(commonMessages.active_orders_no_data)} />
				)
			) : (
				<EmptyTableData
					message={formatMessage(historyMessages.orders_history_widget_login_msg, {
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

export default observer(ClosedOrders);

import React from "react";
import { useIntl } from "react-intl";
import dayjs from "utils/dayjs";
import { IRecentTrade } from "models/Terminal";
import styles from "styles/pages/Terminal.module.scss";
import { TableData, TableRow } from "components/UI/Table";
import { observer } from "mobx-react-lite";
import { unix } from "dayjs";
import FormattedPrice from "../FormattedPrice";

interface Props {
	index: number;
	style: React.CSSProperties;
	parent: {
		props: {
			data: IRecentTrade[];
			pricePrecision: number;
			amountPrecision: number;
		};
	};
}

const RecentTradesRow: React.FC<Props> = ({
	index,
	style,
	parent: {
		props: { data, pricePrecision, amountPrecision },
	},
}) => {
	const trade: IRecentTrade = data[index];
	const { formatNumber } = useIntl();
	const date = unix(trade.date).utc();
	const diff: number = dayjs(dayjs()).diff(date, "h");
	const format: string = diff > 24 ? "DD/MM/YY" : "HH:mm:ss";

	return (
		<TableRow className={styles.recent_trades_list_row} key={trade.id} style={style}>
			<FormattedPrice
				type={trade.type}
				value={trade.price}
				precision={pricePrecision}
				coloredFull
			/>
			<TableData align="right">
				{formatNumber(trade.amount, {
					useGrouping: false,
					minimumFractionDigits: amountPrecision,
					maximumFractionDigits: amountPrecision,
				})}
			</TableData>
			<TableData align="right">{date.format(format)}</TableData>
		</TableRow>
	);
};

export default observer(RecentTradesRow);

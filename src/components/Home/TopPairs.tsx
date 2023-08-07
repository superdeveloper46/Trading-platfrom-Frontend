/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import cn from "classnames";
import { useIntl } from "react-intl";
import styles from "styles/pages/Home.module.scss";
import { usePromotedPairs } from "services/HomeService";
import { IPromotedPairCandle } from "types/home";
import Table, { IHeaderColumn } from "components/UI/Table/Table";
import TableRow from "components/UI/Table/TableRow";
import TableData from "components/UI/Table/TableData";
import InternalLink from "components/InternalLink";
import ExternalImage from "components/ExternalImage";
import exchangeMessages from "messages/exchange";
import commonMessages from "messages/common";
import homeMessages from "messages/home";
import { RowSkeleton } from "components/UI/Table";
import { routes } from "constants/routing";

Chart.register(...registerables);

interface IMiniChartProps {
	width?: number;
	className?: string;
	candles: IPromotedPairCandle[];
}

export const MiniChart: React.FC<IMiniChartProps> = ({ candles, className, width }) => {
	const chartRef = useRef(null);
	const data: number[] = [];
	const labels: number[] = [];

	candles.forEach((candle) => {
		data.push(candle.price);
		labels.push(candle.price);
	});

	useEffect(() => {
		if (chartRef.current) {
			// eslint-disable-next-line no-new
			new Chart(chartRef.current, {
				type: "line",
				options: {
					responsive: true,
					scales: {
						x: {
							display: false,
						},
						y: {
							display: false,
						},
					},
					plugins: {
						legend: {
							display: false,
						},
					},
					elements: {
						point: {
							radius: 0,
						},
					},
				},
				data: {
					labels,
					datasets: [
						{
							data,
							borderColor: "#007aff",
							borderWidth: width ?? 1.5,
						},
					],
				},
			});
		}
	}, [chartRef]);

	return (
		<div className={cn(styles.top_pairs_mini_chart, className ?? "")}>
			<canvas className={styles.top_pairs_mini_chart_canvas} ref={chartRef} />
		</div>
	);
};

const TopPairs: React.FC = () => {
	const { formatMessage, formatNumber } = useIntl();
	const { data: promotedPairs } = usePromotedPairs();

	const columns: IHeaderColumn[] = [
		{
			label: formatMessage(commonMessages.pair),
		},
		{
			label: formatMessage(commonMessages.price),
			align: "right",
		},
		{
			width: "40px",
		},
		{
			label: "Δ24H",
			align: "right",
		},
		{
			width: "40px",
		},
		{
			label: formatMessage(homeMessages.chart),
			align: "center",
		},
		{
			label: formatMessage(homeMessages.top_trade),
			align: "right",
		},
	];

	return (
		<section className={cn(styles.section, styles.mini)}>
			<div className={styles.top_pairs_container}>
				<Table
					className={styles.top_pairs_table}
					rowsClassNames={styles.top_pairs_table_rows}
					header={{
						className: styles.top_pairs_table_header,
						columns,
					}}
				>
					{Array.isArray(promotedPairs) && promotedPairs.length > 0
						? promotedPairs.slice(0, 4).map((p) => (
								<TableRow key={p.symbol} className={styles.top_pairs_table_row}>
									<InternalLink
										to={routes.trade.getPair(p.symbol)}
										aria-label={p.symbol}
										name={p.symbol}
									/>
									<TableData>
										<div className={styles.top_pairs_table_row_pair}>
											{p.image_svg || p.image_png ? (
												<ExternalImage
													src={(p.image_svg || p.image_png) as string}
													alt={p.symbol}
													width="30"
													height="30"
												/>
											) : (
												<i className={`ai ai-${p.symbol.split("_")?.[0]?.toLowerCase()}`} />
											)}
											<span>{p.symbol.replace("_", "/")}</span>
										</div>
									</TableData>
									<TableData align="right">
										<span className={styles.top_pairs_table_row_price}>
											{formatNumber(p.last_price, {
												useGrouping: false,
												maximumFractionDigits: 8,
											}) ?? "--"}
										</span>
									</TableData>
									<TableData width="40px" />
									<TableData align="right">
										<span
											className={cn(
												styles.top_pairs_table_row_diff,
												styles[p.diff < 0 ? "red" : "green"],
											)}
										>
											{p.diff ?? "--"}%
										</span>
									</TableData>
									<TableData width="40px" />
									<TableData align="center">
										<MiniChart candles={p.candles} />
									</TableData>
									<TableData align="right">
										<InternalLink
											to={routes.trade.getPair(p.symbol)}
											className={styles.top_pairs_table_row_link}
										>
											{formatMessage(exchangeMessages.buy)}
										</InternalLink>
									</TableData>
								</TableRow>
						  ))
						: [...new Array(4)].map((_, i: number) => (
								<RowSkeleton cells={columns} key={i} className={styles.top_pairs_table_row} />
						  ))}
				</Table>
			</div>
		</section>
	);
};

export default TopPairs;

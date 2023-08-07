import React, { useEffect } from "react";
import cn from "classnames";
import { Pie, PieChart } from "recharts";
import styles from "styles/components/TransactionsMonitoring/AddressReport.module.scss";
import { useEthReportData } from "services/ReportService";
import { SourcesTypeEnum } from "types/amlReport";
import {
	findColorByTypeScore,
	formatBtcAmount,
	formatFunds,
	formatShare,
	formatter,
	formatterDepthSortValue,
	hex2rgba,
	toComaSeparate,
} from "utils/reportUtils";
import { formatDate } from "utils/formatDate";
import InfoBlock from "./InfoBlock";
import GlStatusBlock from "./GlStatusBlock";
import PieDataList from "./PieDataList";
import TxTable from "./Tables/TxTable";

interface Props {
	hash: string;
	setLoading: (l: boolean) => void;
}

const EthTxReport: React.FC<Props> = ({ hash, setLoading }) => {
	const { dataLoading, scoreInfo, ethInfo } = useEthReportData(hash);

	let ethData: any = {};
	let allDataSource: any[] = [];
	let riskySources: any[] = [];
	let knownSources: any[] = [];
	let unknownSources: any[] = [];
	let allDataSourceByOwner: any[] = [];
	const messages: any[] = [];
	let riskPercent = 0;
	let totalFunds = 0;
	let totalAmount = 0;
	let symbol = "";

	useEffect(() => {
		setLoading(dataLoading);
	}, [dataLoading]);

	if (ethInfo.isSuccess) {
		const localTxData = ethInfo.data.data.txs[0];
		ethData = {
			...localTxData,
			tx_hash: hash,
		};
	}
	if (scoreInfo.isSuccess) {
		totalFunds = scoreInfo.data.totalFunds;
		symbol = scoreInfo.data.symbol;
		totalAmount = scoreInfo.data.totalAmount;

		const sources = scoreInfo.data.sources.map((source: any) => ({
			...source,
			depthSortValue: formatterDepthSortValue(source.depth),
		}));
		riskySources = sources.filter((source: any) => source.listType === "Risky sources");
		unknownSources = sources.filter((source: any) => source.listType === "Unknown sources");
		knownSources = sources.filter((source: any) => source.listType === "Known sources");

		const groupedSourcesByType = formatter(sources, "type");

		riskPercent = 0;

		groupedSourcesByType.forEach((item) => {
			if (item.funds.score >= 55) {
				riskPercent += item.share;
			}
		});

		allDataSource = groupedSourcesByType.map((item) => ({
			...item,
			funds: {
				...item.funds,
				default: Boolean(item.funds.default),
			},
			key: item.funds.type,
			tooltip: `${item.funds.type} ${formatShare(item.share)}`,
			pieValue: item.share,
			value: item.share,
			itemStyle: {
				color: item.funds.default
					? findColorByTypeScore(-1)
					: findColorByTypeScore(item.funds.score),
			},
		}));

		const groupedSourcesByOwner = formatter(sources, "owner");

		allDataSourceByOwner = groupedSourcesByOwner.map((item) => ({
			...item,
			funds: {
				...item.funds,
				default: Boolean(item.funds.default),
			},
			key: item.owner,
			tooltip: `${item.owner} ${formatShare(item.share)}`,
			pieValue: item.share,
			value: item.share,
			itemStyle: {
				color: item.funds.default
					? findColorByTypeScore(-1)
					: findColorByTypeScore(item.funds.score),
			},
		}));
	}

	// await Promise.allSettled([a, c]);
	// navigate({ search: `tx=${value}&type=ethVision` });

	const addressAreUnidentified = () => {
		const sum = unknownSources.reduce((acc, { share }) => acc + share, 0);

		return sum * 100 >= 75;
	};

	return (
		<div>
			<div id="report" className={styles.report}>
				<div style={{ display: "flex" }}>
					<div className={styles.container}>
						<div className={styles.report_block_header}>Transaction information</div>
						<div className={styles.wallet_address_wrap}>
							<InfoBlock
								className={cn(styles.info_block, styles.m_r)}
								label="TX HASH"
								loading={dataLoading}
								value={ethData.tx_hash}
							/>
						</div>
						<div className={styles.wrapper}>
							<InfoBlock
								className={styles.info_block}
								label="total amount"
								loading={dataLoading}
								value={
									toComaSeparate(String(formatBtcAmount(totalAmount, true, "eth", symbol))) || "0"
								}
							/>
							<InfoBlock
								label="block"
								loading={dataLoading}
								value={ethData?.blockHeight && toComaSeparate(String(ethData.blockHeight))}
							/>
							<InfoBlock
								label="TIMESTAMP"
								loading={dataLoading}
								value={
									ethData?.timestamp && formatDate(ethData.timestamp * 1000, "dd.MM.yyyy HH:mm a")
								}
							/>
						</div>
					</div>
					<div className={styles.report_risk_score}>
						<div className={styles.report_block_header}>Risk score</div>
						<PieChart width={400} height={400}>
							<Pie
								data={[{ name: "back", value: 100 }]}
								dataKey="value"
								cx={200}
								cy={200}
								innerRadius={70}
								outerRadius={90}
								fill={hex2rgba(findColorByTypeScore(Number(totalFunds.toFixed(0))), 0.4)}
								startAngle={180}
								endAngle={0}
								stroke="none"
							/>
							<Pie
								data={[{ name: "main", value: 100 }]}
								dataKey="value"
								cx={200}
								cy={200}
								innerRadius={70}
								outerRadius={90}
								fill={findColorByTypeScore(Number(totalFunds.toFixed(0)))}
								startAngle={180 - 180 * (Number(totalFunds.toFixed(0)) / 100)}
								endAngle={0}
								stroke="none"
							/>
							<div className={styles.total_funds_report}>
								<div
									className={styles.risk_score_value}
									style={{ color: findColorByTypeScore(totalFunds) }}
								>
									{formatFunds(totalFunds, false)}
								</div>
							</div>
						</PieChart>
						{riskySources.length > 0 ? (
							<div className={styles.risky_sources_label}>
								<strong>{formatShare(riskPercent * 100)}</strong> of funds comes from risky sources
							</div>
						) : (
							<div className={styles.risky_sources_label}>No risky sources were found</div>
						)}
					</div>
				</div>
				{!dataLoading && (
					<div style={{ marginBottom: "48px" }}>
						{riskPercent * 100 > 0 ||
							addressAreUnidentified() ||
							(messages.length > 0 && (
								<p className={styles.sidebar_analytics_label}>AML RISK DETECTED</p>
							))}
						{riskPercent * 100 > 0 && (
							<GlStatusBlock
								className={styles.info_block_wrap}
								label={`${formatShare(
									riskPercent * 100,
								)} of funds in this transaction are from risky sources`}
							/>
						)}
						{addressAreUnidentified() && (
							<GlStatusBlock
								className={styles.info_block_wrap}
								label="More than 75% of sources for this transaction are unidentified"
							/>
						)}
						{messages.map((msg, index) => (
							<GlStatusBlock key={index} className={styles.info_block_wrap} label={msg} />
						))}
					</div>
				)}
				{allDataSource.length > 0 && allDataSourceByOwner.length > 0 && (
					<div className={styles.report_block_header} id="source-of-funds">
						Sources of Funds
					</div>
				)}
				<div className={styles.pie_data_list_container}>
					<div style={{ flex: 1 }}>
						<PieDataList
							data={allDataSource}
							loading={dataLoading}
							title="By Type"
							trackByLabel="funds.type"
							trackByLabelSupport="funds.name"
						/>
					</div>
					<div style={{ flex: 1 }}>
						<PieDataList
							data={allDataSourceByOwner}
							loading={dataLoading}
							title="By Owner"
							trackByLabel="owner"
						/>
					</div>
				</div>
			</div>
			{riskySources.length > 0 && !dataLoading && (
				<TxTable
					className={styles.table}
					data={riskySources}
					loading={dataLoading}
					type={SourcesTypeEnum.RISKY}
				/>
			)}
			{unknownSources.length > 0 && !dataLoading && (
				<TxTable
					className={styles.table}
					data={unknownSources}
					loading={dataLoading}
					type={SourcesTypeEnum.UNKNOWN}
				/>
			)}
			{knownSources.length > 0 && !dataLoading && (
				<TxTable data={knownSources} loading={dataLoading} type={SourcesTypeEnum.KNOWN} />
			)}
		</div>
	);
};

export default EthTxReport;

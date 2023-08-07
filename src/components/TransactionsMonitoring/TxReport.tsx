import React, { useEffect } from "react";
import styles from "styles/components/TransactionsMonitoring/AddressReport.module.scss";
import { Pie, PieChart, ResponsiveContainer } from "recharts";
import cn from "classnames";
import { formatDate } from "utils/formatDate";
import { IReportDescriptor, SourcesTypeEnum } from "types/amlReport";
import { useTransactionData } from "services/ReportService";
import Skeleton from "react-loading-skeleton";
import {
	addressAreUnidentified,
	findColorByTypeScore,
	formatAndMapVisualData,
	formatBtcAmount,
	formatFunds,
	formatShare,
	hex2rgba,
	toComaSeparate,
} from "utils/reportUtils";
import { useIntl } from "react-intl";
import messages from "messages/report";
import PieDataList from "./PieDataList";
import InfoBlock from "./InfoBlock";
import GlStatusBlock from "./GlStatusBlock";
import TxTable from "./Tables/TxTable";
import ExportWidget from "./ExportWidget";
import InfoSnack from "../InfoSnack";

interface Props {
	idData: IReportDescriptor;
	setLoading?: (l: boolean) => void;
	cached?: boolean;
}

const TxReport: React.FC<Props> = ({ idData, setLoading, cached }) => {
	const { dataLoading, transactionScore, transactionInfo, amlInfo } = useTransactionData(idData.id);
	const { formatMessage } = useIntl();

	useEffect(() => {
		if (setLoading) {
			setLoading(dataLoading);
		}
	}, [dataLoading]);

	const amlMessages: string[] = amlInfo?.messages || [];

	const {
		riskySources,
		unknownSources,
		knownSources,
		allDataSource,
		allDataSourceByOwner,
		riskPercent,
	} = formatAndMapVisualData(transactionScore?.sources);

	const isAddressUnidentified = addressAreUnidentified(unknownSources);

	return (
		<>
			<div id="report" className={styles.report}>
				{cached && (
					<InfoSnack color="yellow" iconCode="warning" filled>
						<span style={{ color: "var(--color-primary)" }}>
							{formatMessage(messages.cached, { date: formatDate(idData.created_at) })}
						</span>
					</InfoSnack>
				)}

				<div className={styles.report_main_container}>
					<div className={styles.container}>
						<div className={styles.report_block_header}>
							<div>{formatMessage(messages.transaction_report_header)}</div>
						</div>
						{!transactionInfo?.tx_hash && !dataLoading && (
							<div style={{ marginBottom: "24px" }}>
								{formatMessage(messages.there_are_no_transactions_for_this_hash)}
							</div>
						)}
						<div className={styles.wallet_address_wrap}>
							<InfoBlock
								className={cn(styles.info_block, styles.m_r)}
								label={formatMessage(messages.tx_hash)}
								loading={dataLoading}
								value={transactionInfo?.tx_hash}
							/>
						</div>
						<div className={styles.wrapper}>
							<InfoBlock
								className={styles.info_block}
								label={formatMessage(messages.total_amount)}
								loading={dataLoading}
								value={
									(transactionInfo?.inputsAmount &&
										toComaSeparate(
											String(formatBtcAmount(transactionInfo.inputsAmount, true, "4")),
										)) ||
									"0"
								}
							/>
							<InfoBlock
								label={formatMessage(messages.block)}
								loading={dataLoading}
								value={
									transactionInfo?.blockHeight &&
									toComaSeparate(String(transactionInfo.blockHeight))
								}
							/>
							<InfoBlock
								label={formatMessage(messages.total_inputs)}
								loading={dataLoading}
								value={transactionInfo?.totalInputs || ""}
							/>
							<InfoBlock
								label={formatMessage(messages.total_outputs)}
								loading={dataLoading}
								value={transactionInfo?.totalOutputs || ""}
							/>
							<InfoBlock
								label={formatMessage(messages.timestamp)}
								loading={dataLoading}
								value={
									transactionInfo?.timestamp &&
									formatDate(transactionInfo.timestamp * 1000, "dd.MM.yyyy HH:mm a")
								}
							/>
						</div>
					</div>
					<div className={styles.report_risk_score}>
						<div className={styles.report_block_header}>{formatMessage(messages.risk_score)}</div>
						<div className={styles.risk_chart}>
							<ResponsiveContainer>
								<PieChart>
									<Pie
										data={[{ name: "back", value: 100 }]}
										dataKey="value"
										cx="50%"
										cy={170}
										animationDuration={0}
										innerRadius={100}
										outerRadius={160}
										fill={
											dataLoading
												? "#bec3d8"
												: hex2rgba(
														findColorByTypeScore(Number(transactionScore?.totalFunds.toFixed(0))),
														0.4,
												  )
										}
										startAngle={0}
										endAngle={180}
										stroke="none"
									/>
									{!dataLoading && (
										<Pie
											data={[{ name: "main", value: 100 }]}
											dataKey="value"
											cx="50%"
											cy={170}
											innerRadius={100}
											outerRadius={160}
											fill={findColorByTypeScore(Number(transactionScore?.totalFunds.toFixed(0)))}
											startAngle={180}
											stroke="none"
											endAngle={180 - 180 * (Number(transactionScore?.totalFunds.toFixed(0)) / 100)}
										/>
									)}
								</PieChart>
							</ResponsiveContainer>
							<div className={styles.total_funds_report}>
								{dataLoading ? (
									<Skeleton borderRadius={2} height={20} enableAnimation />
								) : (
									<div
										className={styles.risk_score_value}
										style={{ color: findColorByTypeScore(transactionScore?.totalFunds) }}
									>
										{formatFunds(transactionScore?.totalFunds || 0, false)}
									</div>
								)}
							</div>
						</div>
						<div className={styles.risky_sources_label}>
							{dataLoading ? (
								<Skeleton borderRadius={2} height={20} enableAnimation />
							) : riskySources.length > 0 ? (
								<span>
									{formatMessage(messages.risk_percent, {
										riskPercent: <strong>{formatShare(riskPercent)}</strong>,
									})}
								</span>
							) : (
								<span>{formatMessage(messages.no_risky_sources)}</span>
							)}
						</div>
					</div>
				</div>
				{!dataLoading && (
					<div style={{ marginBottom: "48px" }}>
						{riskPercent > 0 ||
							isAddressUnidentified ||
							(amlMessages.length > 0 && (
								<p className={styles.sidebar_analytics_label}>
									{formatMessage(messages.risk_detected)}
								</p>
							))}
						{riskPercent > 0 && (
							<GlStatusBlock
								className={styles.info_block_wrap}
								label={formatMessage(messages.transaction_received_from_risky_sources, {
									riskPercent: formatShare(riskPercent),
								})}
							/>
						)}
						{isAddressUnidentified && (
							<GlStatusBlock
								className={styles.info_block_wrap}
								label={formatMessage(messages.transaction_unidentified_sources)}
							/>
						)}
						{amlMessages.map((msg, index) => (
							<GlStatusBlock key={index} className={styles.info_block_wrap} label={msg} />
						))}
					</div>
				)}
				{allDataSource.length > 0 && allDataSourceByOwner.length > 0 && (
					<div className={styles.report_block_header} id="source-of-funds">
						{formatMessage(messages.sources_of_funds)}
					</div>
				)}
				<div className={styles.pie_data_list_container}>
					<PieDataList
						data={allDataSource}
						loading={dataLoading}
						title={formatMessage(messages.pie_title_by_type)}
						trackByLabel="funds.type"
						trackByLabelSupport="funds.name"
					/>
					<PieDataList
						data={allDataSourceByOwner}
						loading={dataLoading}
						title={formatMessage(messages.pie_title_by_owner)}
						trackByLabel="owner"
					/>
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
			{transactionInfo && transactionScore && (
				<ExportWidget
					allDataSource={allDataSource}
					riskySources={riskySources}
					knownSources={knownSources}
					unknownSources={unknownSources}
					info={transactionInfo}
					totalFunds={transactionScore.totalFunds}
					riskPercent={riskPercent}
				/>
			)}
		</>
	);
};

export default TxReport;

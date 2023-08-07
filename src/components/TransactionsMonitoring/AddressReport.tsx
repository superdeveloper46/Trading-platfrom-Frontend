import React, { useEffect } from "react";
import styles from "styles/components/TransactionsMonitoring/AddressReport.module.scss";
import cn from "classnames";
import { Pie, PieChart, ResponsiveContainer } from "recharts";
import { formatDate } from "utils/formatDate";
import Skeleton from "react-loading-skeleton";
import messages from "messages/report";
import { useAddressData } from "services/ReportService";
import { IReportDescriptor, SourcesTypeEnum } from "types/amlReport";
import { useIntl } from "react-intl";
import {
	addressAreUnidentified,
	addressIsOwnerByHighRisk,
	capitalizeFirstLetter,
	findColorByTypeScore,
	formatAndMapVisualData,
	formatBtcAmount,
	formatFunds,
	formatShare,
	hasDirectlyMixing,
	hasTagMoreRiskPoint,
	hex2rgba,
	ownerLabelFormatter,
	toComaSeparate,
} from "utils/reportUtils";
import InfoBlock from "./InfoBlock";
import GlStatusBlock from "./GlStatusBlock";
import GlTag from "./GlTag";
import PieDataList from "./PieDataList";
import AddressTable from "./Tables/AddressTable";
import ExportWidget from "./ExportWidget";
import InfoSnack from "../InfoSnack";

interface Props {
	idData: IReportDescriptor;
	setLoading?: (l: boolean) => void;
	cached?: boolean;
}

export const RISK_POINT = 55;

const AddressReport: React.FC<Props> = ({ idData, setLoading, cached }) => {
	const { dataLoading, addressScore, addressInfo } = useAddressData(idData.id);
	const { formatMessage } = useIntl();

	useEffect(() => {
		if (setLoading) {
			setLoading(dataLoading);
		}
	}, [dataLoading]);

	const {
		riskySources,
		unknownSources,
		knownSources,
		allDataSource,
		allDataSourceByOwner,
		riskPercent,
	} = formatAndMapVisualData(addressScore?.sources);

	const hasTxs = () => Boolean(addressInfo?.txCount);
	const highRisk = addressIsOwnerByHighRisk(addressInfo, RISK_POINT);
	const tagMoreRiskPoint = hasTagMoreRiskPoint(addressInfo, RISK_POINT);
	const directlyMixing = hasDirectlyMixing(addressInfo);
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
							<div id="address-information">{formatMessage(messages.address_report_header)}</div>
							{/* {addressInfo?.inMonitoring ? ( */}
							{/*	<Tooltip */}
							{/*		id="button-hint" */}
							{/*		opener={<Button label={formatMessage(messages.monitoring_btn)} />} */}
							{/*		text={formatMessage(messages.this_wallet_address_is_being_monitored)} */}
							{/*	/> */}
							{/* ) : ( */}
							{/*	<Tooltip */}
							{/*		id="icon-hint" */}
							{/*		opener={<i className={cn("ai ai-info_outlined", styles.icon)} />} */}
							{/*		text={formatMessage(messages.this_report_was_generated_by_using)} */}
							{/*	/> */}
							{/* )} */}
						</div>
						{!hasTxs() && !dataLoading && (
							<div className={styles.wallet_address_wrap}>
								{formatMessage(messages.there_are_no_transactions_for_this_address)}
							</div>
						)}
						<div className={styles.wallet_address_wrap}>
							<InfoBlock
								className={cn(styles.info_block, styles.m_r)}
								label={formatMessage(messages.wallet_address)}
								loading={dataLoading}
								value={addressInfo?.address}
							/>
							<InfoBlock
								className={styles.info_block}
								label={formatMessage(messages.owner)}
								loading={dataLoading}
								value={ownerLabelFormatter(addressInfo)}
							/>
						</div>
						{(addressInfo?.assumedMeta.length ?? 0) > 0 && (
							<div style={{ marginBottom: "24px" }}>
								<p className={styles.sidebar_analytics_label}>{formatMessage(messages.tags)}</p>
								{addressInfo?.assumedMeta?.map((tag, index: number) => (
									<GlTag
										key={index}
										className={styles.tag}
										score={tag.score}
										tag={capitalizeFirstLetter(tag.name)}
									/>
								))}
							</div>
						)}
						<div className={styles.wrapper}>
							<InfoBlock
								className={styles.info_block}
								label={formatMessage(messages.balance)}
								loading={dataLoading}
								value={
									(addressInfo?.balance &&
										toComaSeparate(String(formatBtcAmount(addressInfo.balance)))) ||
									"0"
								}
							/>
							<InfoBlock
								label={formatMessage(messages.total_sent)}
								loading={dataLoading}
								value={
									addressInfo?.amountSent &&
									toComaSeparate(String(formatBtcAmount(addressInfo.amountSent, true, "3")))
								}
							/>
							<InfoBlock
								label={formatMessage(messages.total_tx_sent)}
								loading={dataLoading}
								value={addressInfo?.txSentCount || "0"}
							/>
							<InfoBlock
								label={formatMessage(messages.first_seen)}
								loading={dataLoading}
								value={
									addressInfo?.firstSeen &&
									formatDate(addressInfo.firstSeen * 1000, "dd.MM.yyyy HH:mm a")
								}
							/>
							<InfoBlock
								className={styles.info_block}
								label={formatMessage(messages.number_of_txs)}
								loading={dataLoading}
								value={addressInfo?.txCount || "0"}
							/>
							<InfoBlock
								label={formatMessage(messages.total_received)}
								loading={dataLoading}
								value={
									(addressInfo?.amountReceived &&
										toComaSeparate(
											String(formatBtcAmount(addressInfo.amountReceived, true, "3")),
										)) ||
									"0"
								}
							/>
							<InfoBlock
								label={formatMessage(messages.total_tx_received)}
								loading={dataLoading}
								value={addressInfo?.txReceivedCount}
							/>
							<InfoBlock
								label={formatMessage(messages.last_seen)}
								loading={dataLoading}
								value={
									addressInfo?.lastSeen &&
									formatDate(addressInfo.lastSeen * 1000, "dd.MM.yyyy HH:mm a")
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
														findColorByTypeScore(
															hasTxs() ? Number(addressScore?.totalFunds.toFixed(0)) : -1,
														),
														0.4,
												  )
										}
										stroke="none"
										startAngle={0}
										endAngle={180}
									/>
									{!dataLoading && (
										<Pie
											data={[{ name: "main", value: 100 }]}
											dataKey="value"
											cx="50%"
											cy={170}
											innerRadius={100}
											outerRadius={160}
											fill={findColorByTypeScore(
												hasTxs() ? Number(addressScore?.totalFunds.toFixed(0)) : -1,
											)}
											startAngle={180}
											stroke="none"
											endAngle={180 - 180 * (Number(addressScore?.totalFunds.toFixed(0)) / 100)}
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
										style={{
											color: findColorByTypeScore(hasTxs() ? addressScore?.totalFunds : -1),
										}}
									>
										{hasTxs() ? formatFunds(addressScore?.totalFunds || 0, false) : "-"}
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
				{!dataLoading && addressInfo && Object.keys(addressInfo).length > 0 && (
					<div style={{ marginBottom: "48px" }}>
						{highRisk ||
							directlyMixing ||
							riskPercent > 0 ||
							isAddressUnidentified ||
							(tagMoreRiskPoint && (
								<p className={styles.sidebar_analytics_label}>
									{formatMessage(messages.risk_detected)}
								</p>
							))}
						{highRisk && (
							<GlStatusBlock
								className={styles.info_block_wrap}
								label={formatMessage(messages.high_risk_entity)}
							/>
						)}
						{directlyMixing && (
							<GlStatusBlock
								className={styles.info_block_wrap}
								label={formatMessage(messages.participated_in_mixing)}
							/>
						)}
						{riskPercent > 0 && (
							<GlStatusBlock
								className={styles.info_block_wrap}
								label={formatMessage(messages.address_received_from_risky_sources, {
									riskPercent: formatShare(riskPercent),
								})}
							/>
						)}
						{isAddressUnidentified && (
							<GlStatusBlock
								className={styles.info_block_wrap}
								label={formatMessage(messages.address_unidentified_sources)}
							/>
						)}
						{tagMoreRiskPoint && (
							<GlStatusBlock
								className={styles.info_block_wrap}
								label={formatMessage(messages.high_risk_activities)}
							/>
						)}
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
					<AddressTable
						className={styles.table}
						data={riskySources}
						type={SourcesTypeEnum.RISKY}
						loading={dataLoading}
					/>
				)}
				{unknownSources.length > 0 && !dataLoading && (
					<AddressTable
						className={styles.table}
						data={unknownSources}
						type={SourcesTypeEnum.UNKNOWN}
						loading={dataLoading}
					/>
				)}
				{knownSources.length > 0 && !dataLoading && (
					<AddressTable data={knownSources} type={SourcesTypeEnum.KNOWN} loading={dataLoading} />
				)}
			</div>
			{addressInfo && addressScore && (
				<ExportWidget
					allDataSource={allDataSource}
					riskySources={riskySources}
					knownSources={knownSources}
					unknownSources={unknownSources}
					info={addressInfo}
					totalFunds={addressScore.totalFunds}
					riskPercent={riskPercent}
				/>
			)}
		</>
	);
};

export default AddressReport;

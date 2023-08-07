import React from "react";
import { useIntl } from "react-intl";

import { csvExportReport, exportToPdfOffline } from "utils/exportData";
import styles from "styles/components/TransactionsMonitoring/Report.module.scss";
import useParamQuery from "hooks/useSearchQuery";
import {
	IAddressInfoData,
	IScoreDataSourceExt,
	IScoreDataSourceVisual,
	ITransactionInfoData,
	ResourceTypeEnum,
} from "types/amlReport";
import { queryVars } from "constants/query";
import Button from "components/UI/Button";
import messages from "messages/report";

interface Props {
	allDataSource: IScoreDataSourceVisual[];
	riskySources: IScoreDataSourceExt[];
	knownSources: IScoreDataSourceExt[];
	unknownSources: IScoreDataSourceExt[];
	info: IAddressInfoData | ITransactionInfoData;
	totalFunds: number;
	riskPercent: number;
}

const ExportWidget: React.FC<Props> = (props) => {
	const {
		allDataSource,
		riskySources,
		knownSources,
		unknownSources,
		info,
		totalFunds,
		riskPercent,
	} = props;
	const query = useParamQuery();
	const searchFieldValue = query.get(queryVars.value) || "";
	const type = query.get(queryVars.type);
	const { formatMessage } = useIntl();

	const exportReportToCsv = () => {
		csvExportReport(
			type as ResourceTypeEnum,
			riskySources,
			knownSources,
			unknownSources,
			info,
			totalFunds,
			riskPercent,
			`${searchFieldValue}_report`,
		);
	};

	const enableGeneratePdf = Boolean(process.env.REACT_APP_PDF_GENERATOR);
	const hasReportData =
		(info && allDataSource && Object.keys(info).length !== 0) || allDataSource.length > 0;

	return (
		<div className={styles.button_panel}>
			{hasReportData && (
				<Button
					label={formatMessage(messages.export_to_csv)}
					type="button"
					onClick={exportReportToCsv}
				/>
			)}
			{hasReportData && enableGeneratePdf && (
				<Button
					label={formatMessage(messages.export_to_pdf)}
					type="button"
					onClick={() => exportToPdfOffline("report")}
				/>
			)}
		</div>
	);
};

export default ExportWidget;

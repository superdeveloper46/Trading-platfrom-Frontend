import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import styles from "styles/components/TransactionsMonitoring/Report.module.scss";
import messages from "messages/report";
import { RequestTypeEnum, ResourceTypeEnum } from "types/amlReport";
import { useReportIdData } from "services/ReportService";
import InfoSnack from "components/InfoSnack";
import { toast } from "react-toastify";
import AddressReport from "./AddressReport";
import TxReport from "./TxReport";

interface IProps {
	hashOrAddress: string;
	type: ResourceTypeEnum;
	toggleLoading: (l: boolean) => void;
	demo?: boolean;
}

const Reports: React.FC<IProps> = ({ hashOrAddress, type, toggleLoading, demo = false }) => {
	const { data, isLoading, error } = useReportIdData(
		hashOrAddress,
		type === ResourceTypeEnum.ADDRESS
			? RequestTypeEnum.REPORT_TYPE_ADDRESS
			: RequestTypeEnum.REPORT_TYPE_TRANSACTION,
		demo,
	);
	const [innerComponentLoading, setInnerComponentLoading] = useState(false);

	const { formatMessage } = useIntl();

	useEffect(() => {
		if (error?.message) {
			toast(
				<>
					<i className="ai ai-info_outlined" />
					{error?.message}
				</>,
			);
		}
	}, [error]);

	useEffect(() => {
		toggleLoading(isLoading || innerComponentLoading);
	}, [isLoading, innerComponentLoading]);

	const getReport = (type: ResourceTypeEnum) => {
		if (data?.id) {
			switch (type) {
				case ResourceTypeEnum.ADDRESS:
					return <AddressReport idData={data} setLoading={setInnerComponentLoading} />;
				case ResourceTypeEnum.HASH:
					return <TxReport idData={data} setLoading={setInnerComponentLoading} />;
				// case ResourceTypeEnum.ETH:
				// return <EthTxReport id={reportId!} setLoading={toggleLoading} />;
				default:
					return null;
			}
		}
		if (error) {
			return (
				<InfoSnack color="red" iconCode="warning" justify="center">
					<span>{error.message}</span>
				</InfoSnack>
			);
		}
		return <div className={styles.info_label}>{formatMessage(messages.no_info)}</div>;
	};

	return <div className={styles.container}>{getReport(type)}</div>;
};

export default Reports;

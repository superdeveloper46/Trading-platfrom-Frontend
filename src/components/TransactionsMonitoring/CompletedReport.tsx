import React, { useEffect, useState } from "react";
import { IReportDescriptor, ResourceTypeEnum } from "types/amlReport";
import { isValidAddress, isValidTxHash } from "utils/reportUtils";
import AddressReport from "./AddressReport";
import TxReport from "./TxReport";

interface IProps {
	report: IReportDescriptor;
}

// const ETH_ENABLED = false;

interface IReportType extends IProps {
	type: ResourceTypeEnum;
}

const CompletedReport: React.FC<IProps> = ({ report }) => {
	const [reportType, setReportType] = useState<IReportType | undefined>();

	useEffect(() => {
		// if (isValidEthAddress(report.address) && ETH_ENABLED) {
		// 	setType(ResourceTypeEnum.ETH);
		if (isValidTxHash(report.address)) {
			setReportType({ type: ResourceTypeEnum.HASH, report });
		} else if (isValidAddress(report.address)) {
			setReportType({ type: ResourceTypeEnum.ADDRESS, report });
		} else {
			setReportType(undefined);
		}
	}, [report]);

	const getReport = (rt?: IReportType) => {
		switch (rt?.type) {
			case ResourceTypeEnum.ADDRESS:
				return <AddressReport idData={rt.report} cached />;
			case ResourceTypeEnum.HASH:
				return <TxReport idData={rt.report} cached />;
			default:
				return null;
		}
	};

	return getReport(reportType);
};

export default CompletedReport;

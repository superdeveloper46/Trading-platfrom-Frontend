import React from "react";
import { useIntl } from "react-intl";
import dayjs from "utils/dayjs";
import { IReferralRefback } from "types/referrals";
import { TableData, TableRow } from "components/UI/Table";

const FORMAT_NUMBER_OPTIONS = {
	useGrouping: false,
	maximumFractionDigits: 8,
};

interface Props {
	refback: IReferralRefback;
}

const RefbackRow: React.FC<Props> = ({ refback }) => {
	const { formatNumber } = useIntl();

	return (
		<TableRow>
			<TableData>{dayjs(refback.date).format("DD/MM/YYYY")}</TableData>
			<TableData>
				{formatNumber(refback.kickback, FORMAT_NUMBER_OPTIONS)}&nbsp;
				{refback.currency_code}
			</TableData>
		</TableRow>
	);
};

export default RefbackRow;

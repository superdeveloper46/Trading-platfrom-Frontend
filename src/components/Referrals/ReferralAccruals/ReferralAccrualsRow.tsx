import React from "react";
import { useIntl } from "react-intl";
import dayjs from "utils/dayjs";
import { IReferralAccrual } from "types/referrals";
import { TableData, TableRow } from "components/UI/Table";

const FORMAT_NUMBER_OPTIONS = {
	useGrouping: false,
	maximumFractionDigits: 8,
};

interface Props {
	accrual: IReferralAccrual;
}

const ReferralAccrualsRow: React.FC<Props> = ({ accrual }) => {
	const { formatNumber } = useIntl();
	const percentage = Number(accrual?.invite?.kickback_rate)
		? (1 - Number(accrual?.invite?.kickback_rate) ?? 0) * 100
		: 100;

	return (
		<TableRow>
			<TableData>{dayjs(accrual.date).format("DD/MM/YYYY")}</TableData>
			<TableData>{accrual.referral_uid}</TableData>
			<TableData>{accrual.invite?.code ?? "-"}</TableData>
			<TableData align="right">{formatNumber(percentage, FORMAT_NUMBER_OPTIONS)}%</TableData>
			<TableData maxWidth="80px" />
			<TableData align="right">
				{formatNumber(+accrual.bonus, FORMAT_NUMBER_OPTIONS)}
				&nbsp;{accrual.currency_code}
			</TableData>
		</TableRow>
	);
};

export default ReferralAccrualsRow;

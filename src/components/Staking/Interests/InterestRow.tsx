import React from "react";
import commonMessages from "messages/common";
import { useIntl } from "react-intl";
import dayjs from "dayjs";
import { IInterest } from "types/staking";
import { TableData, TableRow } from "components/UI/Table";
import styles from "styles/pages/Staking.module.scss";
import Tooltip from "components/UI/Tooltip";
import Badge from "components/UI/Badge";
import { getStatusColor, getStatusName } from "utils/shell";

interface Props {
	interest: IInterest;
}

const InterestRow: React.FC<Props> = React.memo(({ interest }) => {
	const { formatNumber, formatMessage } = useIntl();
	const { project, position } = interest;

	return (
		<TableRow className={styles.table_row}>
			<TableData currency minWidth="70px" width="70px">
				<i className={`ai ai-${project?.currency?.code?.toLowerCase()}`} />
				{project?.currency?.code}
			</TableData>
			<TableData align="right" minWidth="100px" width="100px">
				{formatNumber(+interest.amount, {
					maximumFractionDigits: 8,
					useGrouping: false,
				})}
			</TableData>
			<TableData dateMode align="center" minWidth="80px" width="80px">
				{interest.date ? (
					<>
						{dayjs(interest.date).format("DD/MM/YYYY")}&nbsp;
						<span>{dayjs(interest.date).format("HH.mm.ss")}</span>
					</>
				) : (
					"-"
				)}
			</TableData>
			<TableData width="50px" minWidth="50px">
				{formatNumber(+position.interest_rate * 100, {
					maximumFractionDigits: 2,
					useGrouping: false,
				})}
				%
				{position.promo ? (
					<Tooltip
						id={`promo_interest_${position.id}`}
						opener={<div className={styles.promo_sign}>P</div>}
						text={formatMessage(commonMessages.promo_code_bonuses)}
					/>
				) : null}
			</TableData>
			<TableData width="80px" minWidth="80px">
				{dayjs(
					dayjs().subtract(
						dayjs(dayjs(position.redeemed_at ? position.redeemed_at : interest.date)).diff(
							dayjs(position.subscribed_at),
							"milliseconds",
						),
						"milliseconds",
					),
				).fromNow(true)}
			</TableData>
			<TableData align="center" minWidth="80px" width="80px">
				{dayjs(position.subscribed_at).format("DD/MM/YYYY")}
			</TableData>
			<TableData align="center" maxWidth="120px">
				<Badge alpha color={getStatusColor(position.status)}>
					{getStatusName(position.status)}
				</Badge>
			</TableData>
		</TableRow>
	);
});

export default InterestRow;

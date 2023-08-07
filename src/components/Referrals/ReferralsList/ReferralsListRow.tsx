import React from "react";
import { useIntl } from "react-intl";
import dayjs from "utils/dayjs";
import { IReferral } from "types/referrals";
import styles from "styles/components/Profile/Referrals/Referrals.module.scss";
import { TableData, TableRow } from "components/UI/Table";

const FORMAT_NUMBER_OPTIONS = {
	useGrouping: false,
	maximumFractionDigits: 2,
};

interface Props {
	referral: IReferral;
}

const ReferralsListRow: React.FC<Props> = ({ referral }) => {
	const { formatNumber } = useIntl();

	return (
		<TableRow>
			<TableData>
				{referral.is_active_referral ? <div className={styles.active_sign} /> : null}
				{referral.referral_uid}
			</TableData>
			<TableData align="right" style={{ whiteSpace: "nowrap" }}>
				{referral?.invite?.code ?? ""}&nbsp;
				{referral?.invite ? (
					<span style={{ color: "var(--color-secondary)" }} title={referral.invite.label}>
						(
						{referral.invite.label?.length <= 14
							? referral.invite.label
							: `${referral.invite.label.slice(0, 12)}...`}
						)
					</span>
				) : (
					"-"
				)}
			</TableData>
			<TableData maxWidth="80px" />
			<TableData>
				{referral.invite ? (
					<>
						{formatNumber((1 - Number(referral.invite.kickback_rate)) * 100, FORMAT_NUMBER_OPTIONS)}
						%
					</>
				) : (
					"-"
				)}
			</TableData>
			<TableData align="right">
				{formatNumber(Number(referral?.referral_bonus_all_time || 0), FORMAT_NUMBER_OPTIONS)}
			</TableData>
			<TableData align="right">{dayjs(referral.joined_at).format("DD/MM/YYYY")}</TableData>
		</TableRow>
	);
};

export default ReferralsListRow;

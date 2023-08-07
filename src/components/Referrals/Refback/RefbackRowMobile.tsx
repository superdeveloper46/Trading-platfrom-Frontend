import React from "react";
import { useIntl } from "react-intl";
import referralsMessages from "messages/referrals";
import dayjs from "utils/dayjs";
import { IReferralRefback } from "types/referrals";
import styles from "styles/components/Profile/Referrals/Mobile.module.scss";

const FORMAT_NUMBER_OPTIONS = {
	useGrouping: false,
	maximumFractionDigits: 8,
};

interface Props {
	refback: IReferralRefback;
}

const RefbackRowMobile: React.FC<Props> = ({ refback }) => {
	const { formatMessage, formatNumber } = useIntl();

	return (
		<div className={styles.card_mobile}>
			<div className={styles.card_mobile_header}>
				<div className={styles.card_mobile_uid}>{dayjs(refback.date).format("DD/MM/YYYY")}</div>
			</div>
			<div className={styles.card_mobile_content}>
				<div className={styles.card_mobile_content_group}>
					<span>{formatMessage(referralsMessages.fee_return)}</span>
					<span>
						{formatNumber(refback.kickback, FORMAT_NUMBER_OPTIONS)}&nbsp;
						{refback.currency_code}
					</span>
				</div>
			</div>
		</div>
	);
};

export default RefbackRowMobile;

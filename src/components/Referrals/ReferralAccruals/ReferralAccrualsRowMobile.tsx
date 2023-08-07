import React, { useState } from "react";
import { useIntl } from "react-intl";
import dayjs from "utils/dayjs";
import referralsMessages from "messages/referrals";
import commonMessages from "messages/common";
import styles from "styles/components/Profile/Referrals/Mobile.module.scss";
import cn from "classnames";
import { IReferralAccrual } from "types/referrals";
import ButtonMicro from "components/UI/ButtonMicro";

const FORMAT_NUMBER_OPTIONS = {
	useGrouping: false,
	maximumFractionDigits: 8,
};

interface Props {
	accrual: IReferralAccrual;
}

const ReferralAccrualsRowMobile: React.FC<Props> = ({ accrual }) => {
	const { formatMessage, formatNumber } = useIntl();
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const percentage = Number(accrual?.invite?.kickback_rate)
		? (1 - Number(accrual?.invite?.kickback_rate) ?? 0) * 100
		: 100;

	const handleToggleExpand = () => {
		setIsExpanded((prevState) => !prevState);
	};

	return (
		<div className={styles.card_mobile}>
			<div className={styles.card_mobile_header}>
				<div className={styles.card_mobile_uid}>
					User ID
					<span>{accrual.referral_uid}</span>
				</div>
				<div className={cn(styles.card_mobile_action, isExpanded && styles.active)}>
					<ButtonMicro onClick={handleToggleExpand}>
						<i className="ai ai-arrow_down" />
					</ButtonMicro>
				</div>
			</div>
			<div className={styles.card_mobile_content}>
				<div className={styles.card_mobile_content_group}>
					<span>{formatMessage(referralsMessages.sum)}</span>
					<span>
						{formatNumber(+accrual.bonus, FORMAT_NUMBER_OPTIONS)}
						&nbsp;{accrual.currency_code}
					</span>
				</div>
				{isExpanded && (
					<div className={styles.card_mobile_content_hidden}>
						<div className={styles.card_mobile_content_group}>
							<span>{formatMessage(referralsMessages.your_percentage)}</span>
							<span>{formatNumber(percentage, FORMAT_NUMBER_OPTIONS)}%</span>
						</div>
						<div className={styles.card_mobile_content_group}>
							<span>{formatMessage(commonMessages.date)}</span>
							<span>{dayjs(accrual.date).format("DD/MM/YYYY")}</span>
						</div>
						<div className={styles.card_mobile_content_group}>
							<span>{formatMessage(referralsMessages.referral_code)}</span>
							<span>{accrual.invite?.code || "???"}</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ReferralAccrualsRowMobile;

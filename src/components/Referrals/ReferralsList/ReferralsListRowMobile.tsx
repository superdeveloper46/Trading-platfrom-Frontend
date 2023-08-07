import React, { useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import dayjs from "utils/dayjs";

import referralsMessages from "messages/referrals";
import { IReferral } from "types/referrals";
import styles from "styles/components/Profile/Referrals/Mobile.module.scss";
import ButtonMicro from "components/UI/ButtonMicro";

const FORMAT_NUMBER_OPTIONS = {
	useGrouping: false,
	maximumFractionDigits: 2,
};

interface Props {
	referral: IReferral;
}

const ReferralsListRowMobile: React.FC<Props> = ({ referral }) => {
	const { formatMessage, formatNumber } = useIntl();
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const handleToggleExpand = () => {
		setIsExpanded((prevState) => !prevState);
	};

	return (
		<div className={styles.card_mobile}>
			<div className={styles.card_mobile_header}>
				<div className={styles.card_mobile_uid}>
					User ID
					<span>{referral.referral_uid}</span>
				</div>
				<div className={cn(styles.card_mobile_action, isExpanded && styles.active)}>
					<ButtonMicro onClick={handleToggleExpand}>
						<i className="ai ai-arrow_down" />
					</ButtonMicro>
				</div>
			</div>
			<div className={styles.card_mobile_content}>
				<div className={styles.card_mobile_content_group}>
					<span>{formatMessage(referralsMessages.bonuses_earned)}</span>
					<span>
						{formatNumber(Number(referral?.referral_bonus_all_time || 0), FORMAT_NUMBER_OPTIONS)}
						&nbsp;USDT
					</span>
				</div>
				{isExpanded && (
					<div className={styles.card_mobile_content_hidden}>
						<div className={styles.card_mobile_content_group}>
							<span>{formatMessage(referralsMessages.invite_code)}</span>
							<span>{referral?.invite?.code ?? "-"}</span>
						</div>
						<div className={styles.card_mobile_content_group}>
							<span>{formatMessage(referralsMessages.your_percentage)}</span>
							<span>
								{referral.invite ? (
									<>
										{formatNumber(
											(1 - Number(referral.invite.kickback_rate)) * 100,
											FORMAT_NUMBER_OPTIONS,
										)}
										%
									</>
								) : (
									"-"
								)}
							</span>
						</div>
						<div className={styles.card_mobile_content_group}>
							<span>{formatMessage(referralsMessages.registration_date)}</span>
							<span>{dayjs(referral.joined_at).format("DD/MM/YYYY")}</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ReferralsListRowMobile;

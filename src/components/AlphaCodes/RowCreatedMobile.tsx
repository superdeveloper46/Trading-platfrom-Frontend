import React from "react";
import { transformDate } from "utils/dayjs";
import { useIntl } from "react-intl";
import messages from "messages/alpha_codes";
import common_messages from "messages/common";
import Badge from "components/UI/Badge";
import { IAlphaCode } from "models/AlphaCodes";
import styles from "styles/components/AlphaCodes.module.scss";
import cn from "classnames";

interface Props {
	code: IAlphaCode;
}

const RowCreatedMobile: React.FC<Props> = ({ code }) => {
	const { formatMessage, formatNumber } = useIntl();

	return (
		<div className={styles.card_mobile}>
			<div className={styles.card_mobile_header}>
				<span>{code.code_search}</span>
			</div>
			<div className={styles.card_mobile_content}>
				<div className={styles.card_mobile_content_group}>
					<span>{formatMessage(common_messages.date)}</span>
					<span>{transformDate(code.date, "DD/MM/YYYY HH:mm:ss")}</span>
				</div>
				<div className={styles.card_mobile_content_group}>
					<span>{formatMessage(messages.amount)}</span>
					<span>
						{formatNumber(+code.amount, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 8,
							useGrouping: false,
						})}
					</span>
				</div>
				<div className={styles.card_mobile_content_group}>
					<span>{formatMessage(messages.currency)}</span>
					<span>{code.currency_id}</span>
				</div>
				<div className={styles.card_mobile_content_group}>
					<span>{formatMessage(messages.recipient_email)}</span>
					<span>{code.recipient_email || formatMessage(messages.any)}</span>
				</div>
				<div className={styles.card_mobile_content_group}>
					<span>{formatMessage(messages.status)}</span>
					<div className={cn(styles.badge_wrapper, code.is_active && styles.active)}>
						<Badge color={code.is_active ? "green" : "red"}>
							{code.is_active
								? formatMessage(messages.code_active)
								: formatMessage(messages.code_redeemed)}
						</Badge>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RowCreatedMobile;

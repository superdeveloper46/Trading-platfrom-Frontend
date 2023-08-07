import React from "react";
import { transformDate } from "utils/dayjs";
import { useIntl } from "react-intl";
import messages from "messages/alpha_codes";
import common_messages from "messages/common";
import { IAlphaCode } from "models/AlphaCodes";
import styles from "styles/components/AlphaCodes.module.scss";

interface Props {
	code: IAlphaCode;
}

const RowActivatedMobile: React.FC<Props> = ({ code }) => {
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
			</div>
		</div>
	);
};

export default RowActivatedMobile;

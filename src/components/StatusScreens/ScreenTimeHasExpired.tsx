import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import timeHasExpiredIcon from "assets/images/confirm/time-has-expired.svg";
import financeMessages from "messages/finance";
import styles from "styles/components/ConfirmationComponents.module.scss";
import useWindowSize from "hooks/useWindowSize";
import { WalletsLink, CreateWithdrawLink } from "./shared";

interface Props {
	type: string;
	currency: string;
	amount: string;
}

const ScreenTimeHasExpired: React.FC<Props> = ({ type, currency, amount }) => {
	const { formatMessage, formatNumber } = useIntl();
	const { tablet } = useWindowSize();

	const getTitle = useCallback(() => {
		switch (type) {
			case "withdrawal":
				return formatMessage(financeMessages.time_to_confirm_withdrawal_has_expired);
			default:
				return "";
		}
	}, [type]);

	const getSubtitle = useCallback(() => {
		switch (type) {
			case "withdrawal":
				return formatMessage(financeMessages.time_to_confirm_withdrawal_is_limited);
			default:
				return "";
		}
	}, [type]);

	return (
		<div className={styles.form_container}>
			{!tablet && currency ? (
				<div className={styles.mobile_currency_icon}>
					<i className={`ai ai-${currency.toLowerCase()}`} />
				</div>
			) : null}
			<div className={styles.header}>
				<h2 className={styles.title}>{getTitle()}</h2>
			</div>
			<div className={styles.icon_container}>
				<img src={timeHasExpiredIcon} alt="time-has-expired" />
			</div>
			<span className={styles.result_amount}>
				{formatNumber(parseFloat(amount), {
					maximumFractionDigits: 8,
					useGrouping: false,
				})}
				&nbsp;{currency}
			</span>
			<span className={styles.result_subtitle}>{getSubtitle()}</span>
			<WalletsLink />
			<CreateWithdrawLink currency={currency} />
		</div>
	);
};

export default ScreenTimeHasExpired;

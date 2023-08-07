import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import canceledIcon from "assets/images/confirm/canceled.svg";
import financeMessages from "messages/finance";
import cn from "classnames";
import useWindowSize from "hooks/useWindowSize";
import styles from "styles/components/ConfirmationComponents.module.scss";
import {
	WalletsLink,
	CreateWithdrawLink,
	TradesLink,
	DepositHelpLink,
	DepositHistoryLink,
} from "./shared";

interface Props {
	type: string;
	currency?: string;
	amount?: string;
	paymentType?: string;
}

const ScreenCanceled: React.FC<Props> = ({ type, currency, amount, paymentType }) => {
	const { formatMessage, formatNumber } = useIntl();
	const { tablet } = useWindowSize();

	const getTitle = useCallback(() => {
		switch (type) {
			case "withdrawal":
				return formatMessage(financeMessages.withdraw_canceled);
			case "deposit":
				return formatMessage(financeMessages.transfer_error);
			default:
				return "";
		}
	}, [type]);

	const renderLinkGroup = useCallback((): JSX.Element => {
		switch (type) {
			case "withdrawal":
				return (
					<>
						<WalletsLink />
						{currency ? <CreateWithdrawLink currency={currency} /> : null}
					</>
				);
			case "deposit":
				return (
					<>
						<TradesLink />
						<DepositHistoryLink />
						<DepositHelpLink />
					</>
				);
			default:
				return <div />;
		}
	}, [type, currency]);

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
				<img src={canceledIcon} alt="cancel" />
			</div>
			{amount && currency ? (
				<span className={cn(styles.result_amount, styles.disabled)}>
					{formatNumber(parseFloat(amount), {
						maximumFractionDigits: 8,
						useGrouping: false,
					})}
					&nbsp;{currency}
				</span>
			) : null}
			{paymentType ? (
				<div className={styles.payment_type}>
					<i className="ai ai-box" />
					{paymentType}
				</div>
			) : null}
			{renderLinkGroup()}
		</div>
	);
};

export default ScreenCanceled;

import React, { useCallback } from "react";
import confirmedIcon from "assets/images/confirm/confirmed-with-time.svg";
import financeMessages from "messages/finance";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";
import styles from "styles/components/ConfirmationComponents.module.scss";
import useWindowSize from "hooks/useWindowSize";
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

const ScreenConfirmed: React.FC<Props> = ({ type, currency, amount, paymentType }) => {
	const { formatMessage, formatNumber } = useIntl();
	const { tablet } = useWindowSize();

	const renderTitle = useCallback((): string => {
		switch (type) {
			case "withdrawal":
				return formatMessage(financeMessages.withdrawal_application_created);
			case "deposit":
				return formatMessage(financeMessages.deposit_successful);
			default:
				return "";
		}
	}, [type]);

	const renderSubtitle = useCallback((): string => {
		switch (type) {
			case "withdrawal":
				return formatMessage(financeMessages.withdrawal_was_sent_to_moderation);
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
				<h2 className={styles.title}>{renderTitle()}</h2>
			</div>
			<div className={styles.icon_container}>
				<img src={confirmedIcon} alt="confirmed" />
			</div>
			{amount && currency ? (
				<span className={styles.result_amount}>
					{formatNumber(parseFloat(amount), {
						maximumFractionDigits: 8,
						useGrouping: false,
					})}
					&nbsp;{currency}
				</span>
			) : null}
			<span className={styles.result_subtitle}>{renderSubtitle()}</span>
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

export default ScreenConfirmed;

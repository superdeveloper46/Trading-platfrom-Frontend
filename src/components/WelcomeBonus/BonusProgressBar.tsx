import React, { useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";

import messages from "messages/welcome_bonus";
import styles from "styles/pages/WelcomeBonus.module.scss";
import styleProps from "utils/styleProps";
import Button from "components/UI/Button";
import BonusWithdrawModal from "./modals/BonusWithdrawModal";

interface IProps {
	currentValue: number;
	controlPoints: number[];
	amountPaid: number;
}

const BonusProgressBar: React.FC<IProps> = ({ currentValue, controlPoints, amountPaid }) => {
	const { formatMessage } = useIntl();

	const [isModalOpened, setIsModalOpened] = useState(false);

	const openModal = () => {
		setIsModalOpened(true);
	};

	return (
		<div className={cn(styles.social_card_container, styles.bonus_progress_bar_container)}>
			<BonusWithdrawModal
				withdrawAmount={currentValue - amountPaid}
				totalBonus={100}
				alreadyWithdrawn={amountPaid}
				isOpen={isModalOpened}
				onClose={() => setIsModalOpened(false)}
			/>
			<span className={styles.secondary_text}>{formatMessage(messages.bonusesAvailable)}</span>
			<div className={styles.progress_bar}>
				<div
					className={styles.progress_line}
					style={styleProps({
						width: `${(currentValue / controlPoints[controlPoints.length - 1]) * 100}%`,
					})}
				/>
				{controlPoints.map((pointVal) => (
					<div
						className={cn(styles.progress_control_point, {
							[styles.isReached]: currentValue >= pointVal,
						})}
						style={styleProps({
							width: `calc(${(pointVal / controlPoints[controlPoints.length - 1]) * 100}% - 10px)`,
						})}
						key={pointVal}
					>
						<span className={styles.control_point_label}>${pointVal}</span>
						<i className="ai ai-check_filled" />
					</div>
				))}
			</div>
			<div className={cn(styles.card_separator, styles.progress_bar_separator)} />
			<div className={styles.progress_bar_summary}>
				<div className={styles.progress_bar_summary_amount}>
					<span className={styles.secondary_text} style={styleProps({ marginBottom: 0 })}>
						{formatMessage(messages.bonusesReceived)}
					</span>
					<span className={styles.total_bonus_amount}>${currentValue}</span>
				</div>
				<Button
					disabled={currentValue - amountPaid < 50}
					onClick={openModal}
					variant="filled"
					color="secondary"
					label={formatMessage(messages.addToBalance)}
				/>
			</div>
		</div>
	);
};

export default BonusProgressBar;

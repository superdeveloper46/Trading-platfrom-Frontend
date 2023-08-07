import React, { useCallback, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import commonMessages from "messages/common";
import stakingMessages from "messages/staking";
import dayjs from "dayjs";
import styles from "styles/pages/Staking.module.scss";
import cn from "classnames";
import Button from "components/UI/Button";
import styleProps from "utils/styleProps";
import Tooltip from "components/UI/Tooltip";
import ButtonMicro from "components/UI/ButtonMicro";
import Badge from "components/UI/Badge";
import { getCurrencyColor, getStatusColor, getStatusName } from "utils/shell";
import { IPositionItemProps } from "./PositionItem";

const FORMAT_NUMBER_OPTIONS = {
	maximumFractionDigits: 8,
	minimumFractionDigits: 8,
	useGrouping: false,
};

const PositionMobileCard: React.FC<IPositionItemProps> = React.memo(
	({ position, type, openInterestModal, openSubscribeModal, openClosePositionModal }) => {
		const { formatNumber, formatMessage } = useIntl();
		const [isExpanded, setIsExpanded] = useState<boolean>(false);
		const containerRef = useRef<HTMLDivElement>(null);
		const [income, setIncome] = useState<number>(
			((+position.amount * +position.interest_rate) / 30 / 24 / 60 / 60) *
				dayjs(dayjs(position.redeemed_at ? position.redeemed_at : Date.now())).diff(
					dayjs(position.subscribed_at),
					"seconds",
				) -
				+position.interest_paid,
		);

		const isProjectEnabled = position.project.is_enabled;

		// eslint-disable-next-line consistent-return
		useEffect(() => {
			if (!position.redeemed_at) {
				const interval = setInterval(() => {
					setIncome(
						((+position.amount * +position.interest_rate) / 30 / 24 / 60 / 60) *
							dayjs(dayjs(Date.now())).diff(dayjs(position.subscribed_at), "seconds") -
							+position.interest_paid,
					);
				}, 1000);
				return () => clearInterval(interval);
			}
		}, [position]);

		const handleCloseExpandContent = useCallback(
			(e: MouseEvent) => {
				if (!containerRef?.current?.contains(e.target as Node)) {
					setIsExpanded(false);
				}
			},
			[containerRef],
		);

		useEffect(() => {
			if (isExpanded) {
				document.addEventListener("click", handleCloseExpandContent);
			} else {
				document.removeEventListener("click", handleCloseExpandContent);
			}
			return () => document.removeEventListener("click", handleCloseExpandContent);
		}, [isExpanded, handleCloseExpandContent]);

		const handleExpandClick = useCallback(() => {
			setIsExpanded((prevState) => !prevState);
		}, []);

		// eslint-disable-next-line react/no-unstable-nested-components
		const ExpandedContent = useCallback(
			() => (
				<div className={styles.mobile_expanded_container}>
					<div className={styles.expanded_group}>
						<div className={styles.expanded_group_label}>
							{formatMessage(stakingMessages.positions_table_paid)}:
						</div>
						<div className={styles.expanded_group_value}>
							{formatNumber(parseFloat(position.interest_paid), FORMAT_NUMBER_OPTIONS)}
							&nbsp;{position.currency?.code}
						</div>
					</div>
					<div className={styles.expanded_group}>
						<div className={styles.expanded_group_label}>IpM:</div>
						<div className={styles.expanded_group_value}>
							{formatNumber(position.interest_rate * 100, {
								maximumFractionDigits: 2,
								useGrouping: false,
							})}
							%
						</div>
					</div>
					<div className={styles.expanded_group}>
						<div className={styles.expanded_group_label}>
							{formatMessage(stakingMessages.positions_table_end)}:
						</div>
						<div className={styles.expanded_group_value}>
							{position.redeemed_at ? (
								dayjs(position.redeemed_at).format("DD/MM/YYYY")
							) : (
								<span className={styles.close_position_text} onClick={openClosePositionModal}>
									{formatMessage(stakingMessages.close_staking)}
								</span>
							)}
						</div>
					</div>
					<div className={styles.expanded_group}>
						<div className={styles.expanded_group_label}>
							{formatMessage(stakingMessages.positions_table_time_passed)}:
						</div>
						<div className={styles.expanded_group_value}>
							{position.redeemed_at
								? dayjs(
										dayjs().subtract(
											dayjs(dayjs(position.redeemed_at)).diff(
												dayjs(position.subscribed_at),
												"milliseconds",
											),
											"milliseconds",
										),
								  ).fromNow(true)
								: position.timeout_at
								? formatMessage(stakingMessages.up_to_date, {
										date: dayjs(position.timeout_at).format("DD/MM/YYYY"),
								  })
								: dayjs(position.subscribed_at).fromNow(true)}
						</div>
					</div>
				</div>
			),
			[position, openClosePositionModal],
		);

		return (
			<div className={cn(styles.mobile_card, { [styles.expanded]: isExpanded })} ref={containerRef}>
				<div className={styles.mobile_header}>
					<div className={styles.mobile_currency}>
						{position.promo ? (
							<Tooltip
								id={`promosign_${position.id}`}
								opener={<div className={styles.promo_sign}>P</div>}
								text={formatMessage(commonMessages.promo_code_bonuses)}
							/>
						) : null}
						<span>{position.currency?.name}</span>
					</div>
					<div className={styles.mobile_date_time}>
						<div className={styles.mobile_date_time_item}>
							{dayjs(position.subscribed_at).format("DD/MM/YYYY")}
						</div>
						<div className={styles.mobile_date_time_item}>
							{dayjs(position.subscribed_at).format("HH:mm")}
						</div>
					</div>
					<Badge alpha color={getStatusColor(position.status)}>
						{getStatusName(position.status)}
					</Badge>
					<div className={cn(styles.mobile_action, { [styles.active]: isExpanded })}>
						<ButtonMicro onClick={handleExpandClick}>
							<i className="ai ai-arrow_down" />
						</ButtonMicro>
					</div>
				</div>
				<div className={styles.mobile_content}>
					<div className={styles.mobile_content_info}>
						{position.currency?.code ? (
							<div
								className={styles.mobile_content_icon}
								style={styleProps({
									color: getCurrencyColor(position.currency.code.toUpperCase()),
								})}
							>
								<i className={`ai ai-${position.currency.code.toLowerCase()}`} />
							</div>
						) : null}
						<div className={styles.mobile_content_number}>
							<div className={styles.mobile_content_number_item}>
								<span>{formatMessage(commonMessages.amount)}:</span>
								<span>
									{formatNumber(+position.amount, {
										maximumFractionDigits: 8,
										useGrouping: false,
									})}
									&nbsp;
									{position.currency?.code}
								</span>
							</div>
							{type === "active" && (
								<div className={styles.mobile_content_number_item}>
									<span>{formatMessage(stakingMessages.income)}:</span>
									<span>
										{!position.redeemed_at ? (
											<span className={styles.income}>
												+{formatNumber(income, FORMAT_NUMBER_OPTIONS)}&nbsp;
												{position.currency?.code}
											</span>
										) : (
											"--"
										)}
									</span>
								</div>
							)}
						</div>
					</div>
					{!position.redeemed_at && (
						<>
							{position.plan?.is_resubscribable && isProjectEnabled && (
								<Button
									className={cn(styles.get_interest_button)}
									onClick={openSubscribeModal}
									label={formatMessage(stakingMessages.add_funds)}
								>
									{formatMessage(stakingMessages.add_funds)}
								</Button>
							)}
							{position.plan.is_redemption_instant ? (
								<Button
									color="secondary"
									onClick={openInterestModal}
									disabled={!position.plan.is_redemption_instant}
									className={styles.get_interest_button}
									label={formatMessage(stakingMessages.get_interest)}
								>
									{formatMessage(stakingMessages.get_interest)}
								</Button>
							) : null}
						</>
					)}
				</div>
				{isExpanded && <ExpandedContent />}
			</div>
		);
	},
);

export default PositionMobileCard;

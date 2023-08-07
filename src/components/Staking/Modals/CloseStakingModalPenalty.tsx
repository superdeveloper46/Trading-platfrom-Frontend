import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import stakingMessages from "messages/staking";
import commonMessages from "messages/common";
import cn from "classnames";
import dayjs from "dayjs";
import { IPosition } from "types/staking";
import stylesModal from "styles/components/UI/Modal.module.scss";
import Button from "components/UI/Button";
import InfoSnack from "components/InfoSnack";
import Modal, { ActionGroup, Footer, SuccessScreen } from "components/UI/Modal";
import { toast } from "react-toastify";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<any>;
	onConfirmEarly: () => Promise<any>;
	position: IPosition;
	refetchPositions: () => void;
}

const CloseStakingModalPenalty: React.FC<Props> = React.memo(
	({ position, onConfirm, onConfirmEarly, onClose, isOpen, refetchPositions }) => {
		const { formatMessage, formatNumber } = useIntl();
		const { currency, plan } = position;
		const [isCloseLoading, setIsCloseLoading] = useState<boolean>(false);
		const [success, setSuccess] = useState<boolean>(false);
		const [isPremature, setIsPremature] = useState<boolean>(false);
		const [income, setIncome] = useState<number>(0);
		const [reducedIncome, setReducedIncome] = useState<number>(0);

		const [realIncome, setRealIncome] = useState<number>(
			((+position.amount * +position.interest_rate) / 30 / 24 / 60 / 60) *
				dayjs(dayjs(position.redeemed_at ? position.redeemed_at : Date.now())).diff(
					dayjs(position.subscribed_at),
					"seconds",
				) -
				+position.interest_paid,
		);

		useEffect(() => {
			if (dayjs(Date.now()).format() < dayjs(position.end_at).format()) {
				setIsPremature(true);
			}
			calculateSums();
		}, []);

		// eslint-disable-next-line consistent-return
		useEffect(() => {
			if (!position.redeemed_at) {
				const interval = setInterval(() => {
					setRealIncome(
						((+position.amount * +position.interest_rate) / 30 / 24 / 60 / 60) *
							dayjs(dayjs(Date.now())).diff(dayjs(position.subscribed_at), "seconds") -
							+position.interest_paid,
					);
				}, 1000);
				return () => clearInterval(interval);
			}
		}, [position]);

		const calculateSums = (): void => {
			const amount: number = parseFloat(position.amount);
			const interest: number = position.interest_rate * 100;
			const penalty: number = parseFloat(position.plan.penalty_rate) * 100;

			const gain: number = (amount * interest) / 100;
			const income: number = amount + gain;

			const reducedIncome: number = (realIncome * penalty) / 100 + amount;

			setIncome(income);
			setReducedIncome(reducedIncome);
		};

		const handleClose = (): void => {
			setIsCloseLoading(true);
			if (!position.plan.is_redemption_instant) {
				onConfirmEarly()
					.then(() => {
						setSuccess(true);
						refetchPositions();
					})
					.catch((err) => toast.error(err.message))
					.finally(() => setIsCloseLoading(false));
			} else {
				onConfirm()
					.then(() => {
						setSuccess(true);
						refetchPositions();
					})
					.catch((err) => toast.error(err.message))
					.finally(() => setIsCloseLoading(false));
			}
		};

		useEffect(() => {
			setSuccess(false);
		}, [isOpen]);

		return (
			<Modal
				iconCode="warning"
				label={
					<div className={stylesModal.title}>
						{isPremature
							? formatMessage(stakingMessages.close_staking_early)
							: formatMessage(stakingMessages.close_staking)}
					</div>
				}
				isOpen={isOpen}
				onClose={onClose}
			>
				<InfoSnack color="yellow" align="flex-start" iconCode="info_outlined" justify="center" big>
					<span>
						{formatMessage(stakingMessages.income_promise, {
							time: plan.postpone_period,
						})}
					</span>
				</InfoSnack>
				{success ? (
					<div className={cn(stylesModal.content)}>
						<SuccessScreen>
							{formatMessage(stakingMessages.position_closed)}
							<div className={stylesModal.money_container}>
								{isPremature ? (
									<span className={stylesModal.income_text}>{`${formatNumber(reducedIncome, {
										maximumFractionDigits: 8,
									})} ${currency.code}`}</span>
								) : (
									<span className={stylesModal.income_text}>{`${income} ${currency.code}`}</span>
								)}
							</div>
						</SuccessScreen>
					</div>
				) : (
					<>
						<div className={cn(stylesModal.content)}>
							<div className={stylesModal.modal_icon}>
								<i className={`ai ai-${currency?.code?.toLowerCase()}`} />
							</div>
							<div className={stylesModal.info_container}>
								{/* Money Info */}
								{isPremature ? (
									<div className={stylesModal.money_container}>
										<span className={stylesModal.sum_text}>{`${income} ${currency.code}`}</span>
										<span className={stylesModal.penalty_sum_text}>{`${formatNumber(reducedIncome, {
											maximumFractionDigits: 8,
										})} ${currency.code}`}</span>
									</div>
								) : (
									<div className={stylesModal.money_container}>
										<span className={stylesModal.income_text}>{`${income} ${currency.code}`}</span>
									</div>
								)}
								{/* Text Warning */}
								{isPremature ? (
									<div className={stylesModal.description}>
										{formatMessage(stakingMessages.close_position_early_warning, {
											penalty: formatNumber(parseFloat(plan.penalty_rate) * 100, {
												maximumFractionDigits: 2,
											}),
										})}
									</div>
								) : (
									<div className={stylesModal.description}>
										{formatMessage(stakingMessages.claim_income_description)}
									</div>
								)}
							</div>
						</div>
						<Footer>
							<ActionGroup>
								<Button
									color="secondary"
									fullWidth
									onClick={handleClose}
									isLoading={isCloseLoading}
									label={formatMessage(stakingMessages.positions_table_withdraw_income)}
								/>
								<Button
									label={formatMessage(commonMessages.no)}
									variant="outlined"
									color="secondary"
									fullWidth
									onClick={() => onClose()}
								/>
							</ActionGroup>
						</Footer>
					</>
				)}
			</Modal>
		);
	},
);

export default CloseStakingModalPenalty;

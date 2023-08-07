import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import stakingMessages from "messages/staking";
import stylesModal from "styles/components/UI/Modal.module.scss";
import cn from "classnames";
import Modal, { ActionGroup, Footer } from "components/UI/Modal";
import { IPosition } from "types/staking";
import StakingService from "services/StakingService";
import LoadingSpinner from "components/UI/LoadingSpinner";
import Button from "components/UI/Button";
import { toast } from "react-toastify";
import Result from "./Result";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<any>;
	position: IPosition;
	refetchPositions: () => void;
}

const SubscribeModal: React.FC<Props> = ({
	isOpen,
	onClose,
	onConfirm,
	position,
	refetchPositions,
}) => {
	const { formatMessage, formatNumber } = useIntl();
	const [success, setSuccess] = useState<boolean>(false);
	const currencyCode = position.currency?.code?.toUpperCase() ?? "";
	const [amount, setAmount] = useState<number>(0);
	const [isConfirmLoading, setIsConfirmLoading] = useState<boolean>(false);
	const [isCurrentInterestLoading, setIsCurrentInterestLoading] = useState<boolean>(false);

	const handleConfirm = () => {
		setIsConfirmLoading(true);

		onConfirm()
			.then(() => {
				setSuccess(true);
				refetchPositions();
			})
			.catch((err) => toast.error(err.message))
			.finally(() => setIsConfirmLoading(false));
	};

	useEffect(() => {
		setIsCurrentInterestLoading(true);

		StakingService.getCurrentInterest(position.id)
			.then((res) => {
				setAmount(+res.current_interest);
			})
			.finally(() => setIsCurrentInterestLoading(false));
	}, []);

	useEffect(() => {
		setSuccess(false);
	}, [isOpen]);

	return (
		<Modal
			iconCode="ai-warning"
			label={
				<div className={stylesModal.title}>
					{formatMessage(stakingMessages.get_interest)}
					&nbsp;
					{currencyCode}
				</div>
			}
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className={cn(stylesModal.content)}>
				{isCurrentInterestLoading ? (
					<LoadingSpinner />
				) : success ? (
					<Result amount={amount} currencyCode={currencyCode} />
				) : (
					<>
						<div className={stylesModal.modal_icon}>
							<i className={`ai ai-${currencyCode.toLowerCase()}`} />
						</div>
						<div className={stylesModal.info_container}>
							<div className={stylesModal.body1}>
								{formatNumber(Math.abs(amount), {
									maximumFractionDigits: 8,
									useGrouping: false,
								})}
								&nbsp;
								{currencyCode}
							</div>
							<div className={stylesModal.description}>
								{formatMessage(stakingMessages.claim_income_description)}
							</div>
						</div>
					</>
				)}
			</div>
			{!isCurrentInterestLoading && (
				<Footer>
					<ActionGroup>
						<Button
							color="secondary"
							onClick={handleConfirm}
							fullWidth
							isLoading={isConfirmLoading}
							label={formatMessage(stakingMessages.get_interest)}
						/>
					</ActionGroup>
				</Footer>
			)}
		</Modal>
	);
};

export default SubscribeModal;

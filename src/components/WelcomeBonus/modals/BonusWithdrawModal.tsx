import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { toast } from "react-toastify";

import messages from "messages/welcome_bonus";
import transferMessages from "messages/transfers";
import Button from "components/UI/Button";
import PromoService from "services/PromoService";
import errorHandler from "utils/errorHandler";
import Modal, { Content, Description, Footer } from "components/UI/Modal";
import styles from "styles/pages/WelcomeBonus.module.scss";

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	withdrawAmount: number;
	totalBonus: number;
	alreadyWithdrawn?: number;
}

const BonusWithdrawModal: React.FC<IProps> = ({
	isOpen,
	onClose,
	alreadyWithdrawn = 0,
	withdrawAmount,
	totalBonus,
}) => {
	const { formatMessage } = useIntl();
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = () => {
		setIsLoading(true);
		PromoService.promoPayOut()
			.then(() => {
				onClose();
				toast.success(transferMessages.history_status_30);
			})
			.catch(errorHandler)
			.finally(() => {
				setIsLoading(false);
			});
	};

	const isLastWithdraw = useMemo(
		() => alreadyWithdrawn + withdrawAmount === totalBonus,
		[alreadyWithdrawn, withdrawAmount, totalBonus],
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			iconCode="ai ai-error_outline"
			label={formatMessage(messages.withdrawToBalance)}
		>
			<Content>
				<Description noMargin>
					<i className={cn(styles.modal_currency_icon, "ai ai-usd")} />
					<span className={styles.modal_bonus_amount}>{withdrawAmount} USD</span>
					<span className={styles.modal_bonus_congratulations}>
						{isLastWithdraw
							? formatMessage(messages.congratsWithdrawFull, { amount: <strong>100</strong> })
							: formatMessage(messages.congratsWithdrawHalf, {
									amount: <strong>50</strong>,
									total: <strong>100</strong>,
							  })}
					</span>
					{alreadyWithdrawn > 0 && (
						<div className={styles.modal_bonus_already_withdrawn}>
							{formatMessage(messages.congratsWithdrawFull)}
							<span>{alreadyWithdrawn}</span>
						</div>
					)}
				</Description>
			</Content>
			<Footer>
				<Button
					isLoading={isLoading}
					fullWidth
					variant="filled"
					color="secondary"
					onClick={handleSubmit}
					label={formatMessage(messages.withdrawToBalance)}
				/>
			</Footer>
		</Modal>
	);
};

export default BonusWithdrawModal;

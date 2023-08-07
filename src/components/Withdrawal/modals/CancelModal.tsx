import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import commonMessages from "messages/common";
import financeMessages from "messages/finance";
import Button from "components/UI/Button";
import Modal, { Content, Footer, ActionGroup } from "components/UI/Modal";
import styles from "styles/components/DepositWithdrawal.module.scss";

interface Props {
	isOpen: boolean;
	onConfirm: (slug: string) => void;
	onClose: () => void;
	data: {
		amount: string;
		currencyCode: string;
		slug: string;
	};
}

const CancelModal: React.FC<Props> = React.memo(({ isOpen, onConfirm, onClose, data }) => {
	const { formatMessage, formatNumber } = useIntl();

	const handleConfirmButton = useCallback(() => {
		onConfirm(data.slug);
	}, [data.slug]);

	return (
		<Modal
			iconCode="warning"
			label={formatMessage(financeMessages.withdraw_cancelation)}
			onClose={onClose}
			isOpen={isOpen}
		>
			<Content centered>
				<div className={styles.info_container}>
					<div className={styles.info_title}>
						{formatNumber(parseFloat(data.amount), {
							useGrouping: false,
							maximumFractionDigits: 8,
						})}
						&nbsp;{data.currencyCode}
					</div>
					<div className={styles.info_subtitle}>
						{formatMessage(financeMessages.withdraw_cancelation_question)}
					</div>
				</div>
			</Content>
			<Footer>
				<ActionGroup>
					<Button
						fullWidth
						color="primary"
						onClick={handleConfirmButton}
						label={formatMessage(commonMessages.submit)}
					/>
					<Button
						color="primary"
						fullWidth
						variant="outlined"
						onClick={onClose}
						label={formatMessage(commonMessages.back_btn)}
					/>
				</ActionGroup>
			</Footer>
		</Modal>
	);
});

export default CancelModal;

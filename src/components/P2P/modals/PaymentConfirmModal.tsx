import React, { useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";

import styles from "styles/pages/P2P/Modals.module.scss";
import commonMessages from "messages/common";
import p2pMessages from "messages/p2p";
import Modal, { ActionGroup, Content, ContentForm, Description, Footer } from "components/UI/Modal";
import Button from "components/UI/Button";
import CheckBox from "components/UI/CheckBox";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import userCenterStyles from "styles/pages/P2P/UserCenter.module.scss";
import { IRequisites, P2PSideEnum } from "types/p2p";
import P2PService from "services/P2PService";
import errorHandler from "utils/errorHandler";
import { queryVars } from "constants/query";

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	requisites: IRequisites;
	orderId: number;
	refetch: () => void;
	userSide: P2PSideEnum;
}

const PaymentConfirmModal: React.FC<IProps> = ({
	onClose,
	isOpen,
	requisites,
	orderId,
	refetch,
	userSide,
}) => {
	const { formatMessage } = useIntl();

	const [isFirstRequirementAccepted, toggleFirstRequirement] = useState(false);
	const [isSecondRequirementAccepted, toggleSecondRequirement] = useState(false);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSubmit = () => {
		if (isFirstRequirementAccepted && isSecondRequirementAccepted) {
			setIsLoading(true);
			P2PService.confirmPayment({
				[queryVars.id]: orderId,
				[queryVars.payment_requisites]: requisites.id,
			})
				.then(() => {
					toast.success(formatMessage(p2pMessages.seller_notified));
					onClose();
					refetch();
				})
				.catch(errorHandler)
				.finally(() => setIsLoading(false));
		}
	};

	return (
		<Modal
			className={styles.p2p_modal_container}
			isOpen={isOpen}
			onClose={onClose}
			label={formatMessage(p2pMessages.payment_confirmation)}
		>
			<>
				<Content>
					<Description noMargin>
						<span>
							{userSide === P2PSideEnum.Sell
								? "Text for seller Need to provide text" // FIXME
								: formatMessage(p2pMessages.this_confirmation_is_needed_to_prove)}
						</span>
					</Description>
				</Content>
				<ContentForm>
					<div key={requisites.id} className={userCenterStyles.method}>
						<div className={userCenterStyles.method_info}>
							<div className={userCenterStyles.method_label}>
								<i className="ai ai-check_filled" />
								<span className={p2pStyles.default_text}>{requisites.payment_method.name}</span>
							</div>
						</div>
						<div className={userCenterStyles.attributes}>
							{requisites.attributes_labeled.map(({ label, value }, idx) => (
								<div key={idx} className={userCenterStyles.attribute}>
									<span className={p2pStyles.smallcaps_label}>{label}</span>
									<span className={p2pStyles.default_text}>{value}</span>
								</div>
							))}
						</div>
					</div>
					<CheckBox
						onChange={() => toggleFirstRequirement((prevState) => !prevState)}
						name="use-payment-platform"
						checked={isFirstRequirementAccepted}
					>
						{formatMessage(p2pMessages.understand_that_i_need_to_transfer)}
					</CheckBox>
					<CheckBox
						onChange={() => toggleSecondRequirement((prevState) => !prevState)}
						name="real-name"
						checked={isSecondRequirementAccepted}
					>
						{formatMessage(p2pMessages.i_make_payment_real_name)}
					</CheckBox>
				</ContentForm>
				<Footer>
					<ActionGroup>
						<Button
							variant="filled"
							color="primary"
							onClick={handleSubmit}
							isLoading={isLoading}
							disabled={!(isFirstRequirementAccepted && isSecondRequirementAccepted)}
							fullWidth
							label={formatMessage(commonMessages.confirm)}
						/>
						<Button
							variant="outlined"
							color="primary"
							onClick={onClose}
							fullWidth
							label={formatMessage(commonMessages.cancel)}
						/>
					</ActionGroup>
				</Footer>
			</>
		</Modal>
	);
};

export default PaymentConfirmModal;

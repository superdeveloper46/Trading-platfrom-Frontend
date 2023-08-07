import React, { useState } from "react";
import cn from "classnames";

import Button from "components/UI/Button";
// import Tooltip from "components/UI/Tooltip";
import styles from "styles/pages/P2P/OrderDetails.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import { IOrder, IRequisites, P2POrderStatusEnum, P2PSideEnum } from "types/p2p";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { P2PStatuses } from "constants/p2p";
import styleProps from "utils/styleProps";
import messages from "messages/common";
import p2pMessages from "messages/p2p";
import { useIntl } from "react-intl";
import PaymentConfirmModal from "../modals/PaymentConfirmModal";
import CancelOrderModal from "../modals/CancelOrderModal";
import AppealModal from "../modals/AppealModal";
import ConfirmReleaseModal from "../modals/ConfirmReleaseModal";
import LeaveFeedbackModal from "../modals/LeaveFeedbackModal";
import AdOfflineModal from "../modals/AdOfflineModal";

interface IProps {
	orderDetails?: IOrder;
	refetch: () => void;
	userSide: P2PSideEnum;
	className?: string;
}

const PaymentDetails: React.FC<IProps> = ({ orderDetails, refetch, userSide, className }) => {
	const { formatMessage } = useIntl();
	const [isModalOpened, toggleModal] = useState(false);
	const [isCancelModalOpened, toggleCancelModal] = useState(false);
	const [isAppealModalOpened, toggleAppealModal] = useState(false);
	const [isReleaseModalOpened, toggleReleaseModal] = useState(false);
	const [isFeedbackModalOpened, toggleFeedbackModal] = useState(false);
	const [isAdOfflineModalOpened, toggleIsAdOfflineModalOpened] = useState(false);

	const [chosenRequisites, setChosenRequisites] = useState<IRequisites | undefined>(
		orderDetails?.requisites ? orderDetails?.requisites[0] : undefined,
	);

	const handleChooseRequisites = (r: IRequisites) => {
		setChosenRequisites(r);
	};

	return !orderDetails ? (
		<LoadingSpinner />
	) : (
		<div className={cn(styles.payment_method, className)}>
			<div className={styles.header}>
				<span className={p2pStyles.smallcaps_label}>
					{formatMessage(p2pMessages.payment_method)}
				</span>
				<div className={cn(p2pStyles.tabs_container, p2pStyles.table_tabs_container)}>
					<div className={cn(p2pStyles.nav_bar, p2pStyles.scrollable)}>
						{orderDetails.requisites?.map((requisite, i) => (
							<div
								key={i}
								onClick={() => handleChooseRequisites(requisite)}
								className={cn(p2pStyles.nav_item, p2pStyles.table_nav_item, {
									[p2pStyles.active]: chosenRequisites?.id === requisite.id,
								})}
							>
								{(requisite?.payment_method.image_svg || requisite?.payment_method.image_png) && (
									<img
										className={p2pStyles.payment_method_icon}
										src={requisite.payment_method.image_svg || requisite.payment_method.image_png}
										alt={requisite.payment_method.name}
									/>
								)}
								<span>{requisite.payment_method.name}</span>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className={styles.details}>
				<span className={p2pStyles.smallcaps_label}>
					{formatMessage(p2pMessages.payment_details)}
				</span>
				{chosenRequisites?.attributes_labeled.map(({ label, value }, i) => (
					<span key={i} className={styles.text_info}>
						{label}: <strong>{value}</strong>
					</span>
				))}
			</div>
			<div className={styles.footer}>
				<div className={styles.status}>
					<span className={styles.text_info}>{formatMessage(messages.status)}:</span>
					<span
						style={styleProps({ color: P2PStatuses[orderDetails.status].color })}
						className={cn(styles.text_info, styles.color)}
					>
						{P2PStatuses[orderDetails.status].label}
					</span>
					{/* <Tooltip hint id="status hint" text="Some hint" /> */}
				</div>
				<span className={styles.separator} />
				<div className={styles.action_group}>
					{orderDetails.status === P2POrderStatusEnum.FILLED && (
						<Button
							onClick={() => toggleAppealModal(true)}
							variant="text"
							label={formatMessage(p2pMessages.have_questions)}
						/>
					)}
					{orderDetails.status === P2POrderStatusEnum.OPEN && !orderDetails.buyer_approved_at && (
						<Button
							onClick={() => toggleCancelModal(true)}
							variant="text"
							label={formatMessage(p2pMessages.cancel_order)}
						/>
					)}
					{userSide === P2PSideEnum.Sell &&
						orderDetails.status === P2POrderStatusEnum.OPEN &&
						orderDetails.buyer_approved_at && (
							<Button
								onClick={() => toggleReleaseModal(true)}
								label={formatMessage(p2pMessages.confirm_transfer)}
							/>
						)}
					{userSide === P2PSideEnum.Buy &&
						orderDetails.status === P2POrderStatusEnum.OPEN &&
						!orderDetails.buyer_approved_at &&
						chosenRequisites && (
							<Button
								onClick={() => toggleModal(true)}
								label={formatMessage(p2pMessages.transferred_notify)}
							/>
						)}
					{orderDetails.status === P2POrderStatusEnum.FILLED && (
						<Button
							onClick={() => toggleFeedbackModal(true)}
							variant="text"
							label={formatMessage(p2pMessages.leave_feedback)}
						/>
					)}
				</div>
			</div>
			<AdOfflineModal
				isOpen={isAdOfflineModalOpened}
				onClose={() => toggleIsAdOfflineModalOpened(true)}
			/>
			<ConfirmReleaseModal
				refetch={refetch}
				orderId={orderDetails.id}
				isOpen={isReleaseModalOpened}
				onClose={() => toggleReleaseModal(false)}
			/>
			<AppealModal
				orderId={orderDetails.id}
				refetch={refetch}
				isOpen={isAppealModalOpened}
				onClose={() => toggleAppealModal(false)}
			/>
			<CancelOrderModal
				orderId={orderDetails.id}
				refetch={refetch}
				isOpen={isCancelModalOpened}
				onClose={() => toggleCancelModal(false)}
			/>
			<LeaveFeedbackModal
				orderId={orderDetails.id}
				refetch={refetch}
				isOpen={isFeedbackModalOpened}
				onClose={() => toggleFeedbackModal(false)}
			/>
			<AdOfflineModal
				isOpen={isAdOfflineModalOpened}
				onClose={() => toggleIsAdOfflineModalOpened(false)}
			/>
			{chosenRequisites && isModalOpened && (
				<PaymentConfirmModal
					userSide={userSide}
					refetch={refetch}
					orderId={orderDetails.id}
					requisites={chosenRequisites}
					isOpen={isModalOpened}
					onClose={() => toggleModal(false)}
				/>
			)}
		</div>
	);
};

export default PaymentDetails;

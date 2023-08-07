import React, { useCallback, useState } from "react";

import StakingService from "services/StakingService";
import { IPosition } from "types/staking";
import { IBalance } from "models/Account";
import { queryVars } from "constants/query";
import PositionRow from "./PositionRow";
import PositionMobileCard from "./PositionMobileCard";
import SubscribeModal from "../Modals/SubscribeModal";
import { CloseStakingModal, CloseStakingModalPenalty, GetInterestModal } from "../Modals";

export interface IPositionItemProps {
	position: IPosition;
	type: "active" | "history";
	openSubscribeModal: () => void;
	openInterestModal: () => void;
	openClosePositionModal: () => void;
}

interface Props {
	position: IPosition;
	currency: IBalance | null;
	type: "active" | "history";
	mobile?: boolean;
	refetchPositions: () => void;
}

const PositionItem: React.FC<Props> = React.memo(
	({ position, mobile, currency, type, refetchPositions }) => {
		const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState<boolean>(false);
		const [isInterestModalOpen, setIsInterestModalOpen] = useState<boolean>(false);
		const [isCloseStakingModalOpen, setIsCloseStakingModalOpen] = useState<boolean>(false);
		const [isCloseStakingModalPenaltyOpen, setIsCloseStakingModalPenaltyOpen] =
			useState<boolean>(false);

		const { plan } = position;

		const positionsParams = {
			[queryVars.is_redeemed]: false,
			[queryVars.ordering]:
				type === "active" ? `-${queryVars.subscribed_at}` : `-${queryVars.redeemed_at}`,
		};

		const handleAddFundsConfirm = useCallback(
			(amount: number, promo_code: string) =>
				StakingService.subscribe({
					amount,
					...(promo_code ? { promo_code } : {}),
					plan_id: position.plan.id,
					positionId: position.id,
					positionsParams,
				}).catch((error) => {
					throw error;
				}),
			[position],
		);

		const handleClaimConfirm = useCallback(
			() => StakingService.confirmInterest(position.id),
			[position],
		);

		const handleCloseStakingConfirm = useCallback(
			() => StakingService.redeem(position.id),
			[position],
		);

		const handleCloseReferralStalingEarly = useCallback(
			() => StakingService.redeemEarly(position.id),
			[position],
		);

		const openClosePositionModal = () => {
			if (plan.penalty_rate && plan.penalty_rate.length) {
				setIsCloseStakingModalPenaltyOpen(true);
			} else {
				setIsCloseStakingModalOpen(true);
			}
		};

		const PositionRenderItem = useCallback(
			(props: IPositionItemProps) =>
				mobile ? <PositionMobileCard {...props} /> : <PositionRow {...props} />,
			[mobile],
		);

		return (
			<>
				<PositionRenderItem
					openInterestModal={() => setIsInterestModalOpen(true)}
					openClosePositionModal={openClosePositionModal}
					openSubscribeModal={() => setIsSubscribeModalOpen(true)}
					position={position}
					type={type}
				/>
				<SubscribeModal
					isOpen={isSubscribeModalOpen}
					onClose={() => setIsSubscribeModalOpen(false)}
					onConfirm={handleAddFundsConfirm}
					currency={currency || ({} as IBalance)}
					additionalFunding
					plan={position.plan}
					positionAmount={+position.amount}
				/>
				<CloseStakingModalPenalty
					isOpen={isCloseStakingModalPenaltyOpen}
					onClose={() => setIsCloseStakingModalPenaltyOpen(false)}
					onConfirm={handleCloseStakingConfirm}
					onConfirmEarly={handleCloseReferralStalingEarly}
					position={position}
					refetchPositions={refetchPositions}
				/>
				<CloseStakingModal
					isOpen={isCloseStakingModalOpen}
					onClose={() => setIsCloseStakingModalOpen(false)}
					onConfirm={handleCloseStakingConfirm}
					onConfirmEarly={handleCloseReferralStalingEarly}
					currency={position.currency}
					promo={position.promo}
					position={position}
					refetchPositions={refetchPositions}
				/>
				<GetInterestModal
					isOpen={isInterestModalOpen}
					onClose={() => setIsInterestModalOpen(false)}
					onConfirm={handleClaimConfirm}
					position={position}
					refetchPositions={refetchPositions}
				/>
			</>
		);
	},
);

export default PositionItem;

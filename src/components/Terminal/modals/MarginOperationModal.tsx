import React from "react";
import { AccountTypeEnum } from "types/account";
import { MarginModalEnum } from "types/exchange";
import BorrowModal from "./BorrowModal";
import RepayModal from "./RepayModal";
import TransferModal from "./TransferModal";

interface IProps {
	modal: MarginModalEnum | "";
	onClose: () => void;
	pair?: string;
	code?: string;
	onSuccess?: () => void;
	onBorrowModalOpen?: () => void;
}

const MarginOperationModal: React.FC<IProps> = ({
	modal,
	onClose,
	pair,
	code,
	onSuccess,
	onBorrowModalOpen,
}) => {
	const renderModal = (modal: MarginModalEnum | "") => {
		switch (modal) {
			case MarginModalEnum.BORROW:
				return (
					<BorrowModal
						isOpen
						onClose={onClose}
						type={pair ? AccountTypeEnum.ISOLATED : AccountTypeEnum.CROSS}
						pair={pair}
						onSuccess={onSuccess}
						currency={pair ? code : ""}
						asset={pair ? "" : code}
					/>
				);
			case MarginModalEnum.REPAY:
				return (
					<RepayModal
						isOpen
						onClose={onClose}
						type={pair ? AccountTypeEnum.ISOLATED : AccountTypeEnum.CROSS}
						pair={pair}
						onSuccess={onSuccess}
						currency={pair ? code : ""}
						asset={pair ? "" : code}
					/>
				);
			case MarginModalEnum.TRANSFER:
				return (
					<TransferModal
						isOpen
						onClose={onClose}
						onBorrowModalOpen={onBorrowModalOpen}
						type={pair ? AccountTypeEnum.ISOLATED : AccountTypeEnum.CROSS}
						pair={pair}
						onSuccess={onSuccess}
						currency={pair ? code : ""}
						asset={pair ? "" : code}
					/>
				);
			default:
				return null;
		}
	};

	return renderModal(modal);
};

export default MarginOperationModal;

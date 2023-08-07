import React, { useState } from "react";
import cn from "classnames";
import { useIntl } from "react-intl";

import styles from "styles/pages/P2P/UserCenter.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import p2pMessages from "messages/p2p";
import messages from "messages/common";
import Button from "components/UI/Button";
import { usePaymentRequisites } from "services/P2PService";
import { IRequisites } from "types/p2p";
import LoadingSpinner from "components/UI/LoadingSpinner";
import DeleteCardModal from "../modals/DeleteCardModal";
import SetPaymentMethodModal from "../modals/SetPaymentMethodModal";
import EditPaymentMethodModal from "../modals/EditPaymentMethodModal";

const PaymentMethods = () => {
	const { formatMessage } = useIntl();

	const [isAddMethodModalOpened, toggleAddMethodModal] = useState(false);
	const [isDeleteModalOpened, toggleDeleteModal] = useState(false);
	const [isEditModalOpened, toggleEditModal] = useState(false);

	const [requisiteToDelete, setRequisiteToDelete] = useState<IRequisites | null>(null);
	const [requisiteToEdit, setRequisiteToEdit] = useState<IRequisites | null>(null);

	const { data: requisites, isFetching: isRequisitesLoading, refetch } = usePaymentRequisites(true);

	const handleDeleteModal = (requisite: IRequisites) => {
		setRequisiteToDelete(requisite);
		toggleDeleteModal(true);
	};

	const closeDeleteModal = () => {
		setRequisiteToDelete(null);
		toggleDeleteModal(false);
	};

	const handleEditModal = (requisite: IRequisites) => {
		setRequisiteToEdit(requisite);
		toggleEditModal(true);
	};

	const closeEditModal = () => {
		setRequisiteToEdit(null);
		toggleEditModal(false);
	};

	return (
		<div className={styles.payment_container}>
			<div className={styles.payment_info}>
				<span className={styles.section_title}>{formatMessage(p2pMessages.p2p_payment)}</span>
				<span className={p2pStyles.default_text}>
					{formatMessage(p2pMessages.p2p_payment_desc)}
				</span>
			</div>
			{isRequisitesLoading ? (
				<LoadingSpinner />
			) : (
				<div className={styles.payment_methods_list}>
					{requisites?.results.map((requisite) => (
						<div key={requisite.id} className={styles.method}>
							<div className={styles.method_info}>
								<div className={styles.method_label}>
									{(requisite.payment_method.image_svg || requisite.payment_method.image_png) && (
										<img
											src={requisite.payment_method.image_svg || requisite.payment_method.image_png}
											alt={requisite.payment_method.name}
										/>
									)}
									<span className={cn(p2pStyles.default_text, p2pStyles.bold)}>
										{requisite.payment_method.name}
									</span>
									<span className={p2pStyles.default_text}>{`(${requisite.name})`}</span>
								</div>
								<div className={styles.actions}>
									<Button
										mini
										onClick={() => handleEditModal(requisite)}
										variant="text"
										label={formatMessage(messages.edit)}
									/>
									<Button
										mini
										onClick={() => handleDeleteModal(requisite)}
										variant="text"
										color="secondary"
										label={formatMessage(p2pMessages.delete)}
									/>
								</div>
							</div>
							<div className={styles.attributes}>
								{requisite.attributes_labeled.map(({ label, value }, idx) => (
									<div key={idx} className={styles.attribute}>
										<span className={p2pStyles.smallcaps_label}>{label}</span>
										<span title={value} className={p2pStyles.default_text}>
											{value}
										</span>
									</div>
								))}
							</div>
						</div>
					))}
					<div onClick={() => toggleAddMethodModal(true)} className={styles.add_method}>
						<i className="ai ai-plus" />
						{formatMessage(p2pMessages.add_payment_method)}
					</div>
				</div>
			)}
			{isDeleteModalOpened && (
				<DeleteCardModal
					refetch={refetch}
					requisite={requisiteToDelete}
					isOpen={isDeleteModalOpened}
					onClose={closeDeleteModal}
				/>
			)}
			{isEditModalOpened && (
				<EditPaymentMethodModal
					refetch={refetch}
					requisite={requisiteToEdit}
					isOpen={isEditModalOpened}
					onClose={closeEditModal}
				/>
			)}
			{isAddMethodModalOpened && (
				<SetPaymentMethodModal
					refetch={refetch}
					isOpen={isAddMethodModalOpened}
					onClose={() => toggleAddMethodModal(false)}
				/>
			)}
		</div>
	);
};

export default PaymentMethods;

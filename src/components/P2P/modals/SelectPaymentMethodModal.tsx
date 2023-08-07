import React, { useRef, useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";

import Modal, { ActionGroup, ContentForm, Footer } from "components/UI/Modal";
import Button from "components/UI/Button";
import commonMessages from "messages/common";
import Select, { ISelectOption } from "components/UI/Select";
import { usePaymentRequisites } from "services/P2PService";
import { IPaymentMethod, IRequisites, P2PSideEnum } from "types/p2p";
import styles from "styles/pages/P2P/Modals.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import p2pMessages from "messages/p2p";
import SetPaymentMethodModal from "./SetPaymentMethodModal";

interface IProps {
	setMethod: (method: IRequisites) => void;
	methodOptions?: IPaymentMethod[];
	side: P2PSideEnum;
	isOpen: boolean;
	onClose: () => void;
}

const SelectPaymentMethodModal: React.FC<IProps> = ({
	onClose,
	isOpen,
	side,
	methodOptions,
	setMethod,
}) => {
	const { formatMessage } = useIntl();

	const [isAddMethodModalOpened, toggleAddMethodModal] = useState(false);
	const [chosenRequisites, setChosenRequisites] = useState<IRequisites | null>(null);

	const { data: requisites, refetch, isFetching } = usePaymentRequisites(side === P2PSideEnum.Buy);

	const ref = useRef<HTMLDivElement | null>(null);

	const requisitesOptions: ISelectOption[] = requisites
		? requisites.results
				?.filter(({ payment_method }) => methodOptions?.some(({ id }) => payment_method.id === id))
				.map((r) => ({ value: r.id.toString(), label: `${r.payment_method.name} (${r.name})` }))
		: [];

	const selectOption: ISelectOption | null = chosenRequisites
		? {
				value: chosenRequisites.id.toString(),
				label: `${chosenRequisites.payment_method.name} ${chosenRequisites.name}`,
		  }
		: null;

	const handleSelect = (option: ISelectOption) => {
		setChosenRequisites(requisites?.results.find(({ id }) => Number(option.value) === id) || null);
	};

	const handleSubmit = () => {
		if (chosenRequisites) {
			setMethod(chosenRequisites);
			onClose();
		}
	};

	const handleAddNewMethod = () => {
		ref?.current?.blur(); // Workaround to blur from select when opening new modal (fixing https://alpcomteam.atlassian.net/browse/ALPHA-2661 (cooments))
		toggleAddMethodModal(true);
	};

	const handleCancel = () => {
		onClose();
	};

	const handleAddMethodModalClose = () => {
		toggleAddMethodModal(false);
	};

	return (
		<Modal
			className={cn(styles.funding_transfer_modal, styles.overflow)}
			isOpen={isOpen}
			onClose={onClose}
			label={formatMessage(p2pMessages.select_pm)}
		>
			<>
				<ContentForm>
					<Select
						selectRef={ref}
						options={requisitesOptions}
						onChange={handleSelect}
						placeholder={formatMessage(p2pMessages.payment_method)}
						label={formatMessage(p2pMessages.payment_method)}
						value={selectOption}
						isLoading={isFetching}
						additionalOption={
							// eslint-disable-next-line jsx-a11y/interactive-supports-focus
							<div
								role="button"
								onClick={handleAddNewMethod}
								className={p2pStyles.additional_option}
							>
								<i className="ai ai-circle_plus" />
								{formatMessage(p2pMessages.set_new_pm)}
							</div>
						}
					/>
				</ContentForm>
				<Footer>
					<ActionGroup>
						<Button
							variant="filled"
							color="primary"
							onClick={handleSubmit}
							disabled={!chosenRequisites}
							fullWidth
							label={formatMessage(commonMessages.confirm)}
						/>
						<Button
							variant="outlined"
							color="primary"
							onClick={handleCancel}
							fullWidth
							label={formatMessage(commonMessages.cancel)}
						/>
					</ActionGroup>
				</Footer>
			</>
			{isAddMethodModalOpened && (
				<SetPaymentMethodModal
					refetch={refetch}
					isOpen={isAddMethodModalOpened}
					onClose={handleAddMethodModalClose}
				/>
			)}
		</Modal>
	);
};

export default SelectPaymentMethodModal;

import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import Modal, { ActionGroup, ContentForm, Footer } from "components/UI/Modal";
import Button from "components/UI/Button";
import commonMessages from "messages/common";
import Input from "components/UI/Input";
import P2PService from "services/P2PService";
import errorHandler from "utils/errorHandler";
import { queryVars } from "constants/query";
import styles from "styles/pages/P2P/Modals.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import { IRequisites } from "types/p2p";
import { IError } from "types/general";
import { handleFormErrors } from "utils/form";
import { CARDHOLDER_ATTRIBUTE_NAME } from "constants/p2p";
import p2pMessages from "messages/p2p";

interface IProps {
	isOpen: boolean;
	requisite: IRequisites | null;
	onClose: () => void;
	refetch: () => void;
}

type IFormBody = Record<string, string> & { [queryVars.name]: string };

const INITIAL_STATE = { [queryVars.name]: "" };

const EditPaymentMethodModal: React.FC<IProps> = ({ onClose, isOpen, refetch, requisite }) => {
	const { formatMessage } = useIntl();

	const [formBody, setFormBody] = useState<IFormBody>(INITIAL_STATE);
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		if (name === CARDHOLDER_ATTRIBUTE_NAME) {
			return null;
		}

		return setFormBody((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleErrors = (err: IError) => {
		if (err) {
			errorHandler(err, false);
			const nextErrors = handleFormErrors(err, Object.keys(formBody));
			setFormErrors((prevState) => ({
				...prevState,
				...nextErrors,
			}));
		}
	};

	const handleSubmit = async () => {
		if (requisite) {
			setIsLoading(true);
			const { name, ...attributes } = formBody;
			P2PService.editRequisites({
				[queryVars.id]: requisite.id,
				[queryVars.name]: name,
				[queryVars.attributes]: attributes,
			})
				.then(() => {
					refetch();
					onClose();
					toast.success(formatMessage(p2pMessages.pm_edited));
				})
				.catch(handleErrors)
				.finally(() => setIsLoading(false));
		}
	};

	const handleCancel = () => onClose();

	const handleInputKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSubmit();
		}
	};

	useEffect(() => {
		if (requisite) {
			setFormBody((prevState) => ({
				...prevState,
				...Object.fromEntries(
					requisite?.attributes_labeled.map(({ name, value }) => [name, value]),
				),
				[queryVars.name]: requisite.name,
			}));
		}
	}, [requisite]);

	return (
		<Modal
			className={cn(styles.p2p_modal_container, styles.add_method_modal)}
			isOpen={isOpen}
			onClose={onClose}
			label={formatMessage(p2pMessages.edit_pm)}
		>
			<>
				<ContentForm>
					<div className={styles.chosen_payment_method}>
						{(requisite?.payment_method.image_svg || requisite?.payment_method.image_png) && (
							<img
								src={requisite.payment_method.image_svg || requisite.payment_method.image_png}
								alt={requisite.payment_method.name}
							/>
						)}
						<span className={p2pStyles.default_text}>{requisite?.payment_method.name}</span>
					</div>
					<Input
						value={formBody[queryVars.name]}
						error={formErrors[queryVars.name]}
						labelValue={formatMessage(p2pMessages.name_unique_note)}
						name={queryVars.name}
						onChange={handleInputChange}
					/>
					{requisite?.attributes_labeled.map(({ name, label }, idx, arr) => (
						<Input
							key={idx}
							value={formBody[name]}
							error={formErrors[name]}
							labelValue={label}
							disabled={name === CARDHOLDER_ATTRIBUTE_NAME}
							name={name}
							onChange={handleInputChange}
							onKeyDown={idx === arr.length - 1 ? handleInputKeyDown : undefined}
						/>
					))}
				</ContentForm>
				<Footer>
					<ActionGroup>
						<Button
							variant="filled"
							color="primary"
							onClick={handleSubmit}
							isLoading={isLoading}
							fullWidth
							label={formatMessage(commonMessages.confirm)}
						/>
						<Button
							variant="outlined"
							color="primary"
							onClick={handleCancel}
							disabled={isLoading}
							fullWidth
							label={formatMessage(commonMessages.cancel)}
						/>
					</ActionGroup>
				</Footer>
			</>
		</Modal>
	);
};

export default observer(EditPaymentMethodModal);

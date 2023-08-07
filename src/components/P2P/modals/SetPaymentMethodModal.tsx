import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import Modal, { ActionGroup, ContentForm, Description, Footer } from "components/UI/Modal";
import Button from "components/UI/Button";
import commonMessages from "messages/common";
import p2pMessages from "messages/p2p";
import Input from "components/UI/Input";
import Select, { ISelectOption } from "components/UI/Select";
import P2PService, { usePaymentMethods } from "services/P2PService";
import { IPaymentMethod } from "types/p2p";
import errorHandler from "utils/errorHandler";
import { queryVars } from "constants/query";
import styles from "styles/pages/P2P/Modals.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import { IError } from "types/general";
import { handleFormErrors } from "utils/form";
import { CARDHOLDER_ATTRIBUTE_NAME } from "constants/p2p";
import { useMst } from "models/Root";

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	refetch: () => void;
}

type IFormBody = Record<string, string> & { [queryVars.name]: string };

const INITIAL_STATE = { [queryVars.name]: "" };

enum StepEnum {
	PaymentSelect,
	Submit,
}

const SetPaymentMethodModal: React.FC<IProps> = ({ onClose, isOpen, refetch }) => {
	const { formatMessage } = useIntl();

	const {
		account: { profileStatus },
	} = useMst();

	const [step, setStep] = useState(StepEnum.PaymentSelect);
	const { data: paymentMethods, isFetching: isMethodsLoading } = usePaymentMethods();
	const [formBody, setFormBody] = useState<IFormBody>(INITIAL_STATE);
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const [chosenPaymentMethod, setChosenPaymentMethod] = useState<IPaymentMethod | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const methodsOptions: ISelectOption[] =
		paymentMethods?.results.map(({ name, id }) => ({
			value: id.toString(),
			label: name,
		})) || [];

	const selectOption: ISelectOption | null = chosenPaymentMethod
		? { value: chosenPaymentMethod.id.toString(), label: chosenPaymentMethod.name }
		: null;

	const handleSelect = (option: ISelectOption) => {
		setChosenPaymentMethod(
			paymentMethods?.results?.find(({ id }) => Number(option.value) === id) || null,
		);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormErrors({});
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
		if (step === StepEnum.PaymentSelect && chosenPaymentMethod) {
			return setStep((prev) => prev + 1);
		}
		if (step === StepEnum.Submit && chosenPaymentMethod) {
			setIsLoading(true);
			const { name, ...attributes } = formBody;
			P2PService.setPaymentMethod({
				[queryVars.name]: name,
				[queryVars.payment_method]: chosenPaymentMethod.id,
				[queryVars.attributes]: attributes,
			})
				.then(() => {
					refetch();
					onClose();
					toast.success(formatMessage(p2pMessages.pm_added));
				})
				.catch(handleErrors)
				.finally(() => setIsLoading(false));
		}
		return null;
	};

	const handleCancel = () => {
		if (step === StepEnum.PaymentSelect) {
			return onClose();
		}
		if (step === StepEnum.Submit) {
			return setStep((prev) => prev - 1);
		}
		return null;
	};

	const handleInputKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSubmit();
		}
	};

	useEffect(() => {
		if (chosenPaymentMethod && profileStatus) {
			setFormBody((prevState) => ({
				...prevState,
				...Object.fromEntries(chosenPaymentMethod?.attributes.map(({ name }) => [name, ""])),
				...(chosenPaymentMethod.attributes.some(({ name }) => name === CARDHOLDER_ATTRIBUTE_NAME)
					? { [CARDHOLDER_ATTRIBUTE_NAME]: `${profileStatus.name} ${profileStatus.second_name}` }
					: {}),
			}));
		}
	}, [chosenPaymentMethod, profileStatus]);

	return (
		<Modal
			className={cn(styles.p2p_modal_container, styles.add_method_modal, {
				[styles.overflow]: step === StepEnum.PaymentSelect,
			})}
			isOpen={isOpen}
			onClose={onClose}
			label={formatMessage(p2pMessages.set_new_pm)}
		>
			<>
				<ContentForm>
					{step === StepEnum.Submit && (
						<>
							<Description noMargin>
								<span>{formatMessage(p2pMessages.pm_will_be_shown)}</span>
							</Description>
							<div className={styles.chosen_payment_method}>
								{(chosenPaymentMethod?.image_svg || chosenPaymentMethod?.image_png) && (
									<img
										src={chosenPaymentMethod.image_svg || chosenPaymentMethod.image_png}
										alt={chosenPaymentMethod.name}
									/>
								)}
								<span className={p2pStyles.default_text}>{chosenPaymentMethod?.name}</span>
							</div>
						</>
					)}
					{step === StepEnum.PaymentSelect && (
						<Select
							options={methodsOptions}
							isLoading={isMethodsLoading}
							onChange={handleSelect}
							placeholder={formatMessage(p2pMessages.payment_method)}
							label={formatMessage(p2pMessages.payment_method)}
							value={selectOption}
						/>
					)}

					{step === StepEnum.Submit && (
						<>
							<Input
								value={formBody[queryVars.name]}
								error={formErrors[queryVars.name]}
								labelValue={formatMessage(p2pMessages.name_unique_note)}
								name={queryVars.name}
								onChange={handleInputChange}
							/>
							{chosenPaymentMethod?.attributes.map(({ name, label }, idx, arr) => (
								<Input
									key={idx}
									value={formBody[name]}
									error={formErrors[name]}
									labelValue={label}
									name={name}
									disabled={name === CARDHOLDER_ATTRIBUTE_NAME}
									onChange={handleInputChange}
									onKeyDown={idx === arr.length - 1 ? handleInputKeyDown : undefined}
								/>
							))}
						</>
					)}
				</ContentForm>
				<Footer>
					<ActionGroup>
						<Button
							variant="filled"
							color="primary"
							onClick={handleSubmit}
							isLoading={isLoading}
							disabled={!chosenPaymentMethod}
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

export default observer(SetPaymentMethodModal);

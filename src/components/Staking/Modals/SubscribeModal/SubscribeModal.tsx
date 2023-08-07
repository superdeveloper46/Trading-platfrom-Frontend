import React, { useState, useEffect } from "react";
import { FormatNumberOptions, useIntl } from "react-intl";
import cn from "classnames";
import { toast } from "react-toastify";

import stakingMessages from "messages/staking";
import commonMessages from "messages/common";
import financeMessages from "messages/finance";
import stylesModal from "styles/components/UI/Modal.module.scss";
import styles from "styles/pages/Staking.module.scss";
import Input, { Appender, AppenderButton, AppenderDivider } from "components/UI/Input";
import { IBalance } from "models/Account";
import { IPlan } from "types/staking";
import Button from "components/UI/Button";
import CheckBox from "components/UI/CheckBox";
import Modal, { ActionGroup, Content, Footer } from "components/UI/Modal";
import styleProps from "utils/styleProps";
import InternalLink from "components/InternalLink";
import { routes } from "constants/routing";
import NotEnoughFunds from "./NotEnoughFunds";
import Result from "./Result";

const FORMAT_NUMBER_OPTIONS: FormatNumberOptions = {
	maximumFractionDigits: 8,
	useGrouping: false,
};

const validatePromoCode = (code: string): boolean => {
	const reg = /^[a-zA-Z0-9_\-#]{0,30}$/;
	return reg.test(code);
};

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (amount: number, promoCode: string) => Promise<void>;
	currency: IBalance;
	additionalFunding?: boolean;
	plan: IPlan;
	positionAmount?: number;
}

const SubscribeModal: React.FC<Props> = ({
	isOpen,
	onClose,
	onConfirm,
	currency,
	plan,
	positionAmount = 0,
	additionalFunding = false,
}) => {
	const { formatMessage, formatNumber } = useIntl();
	const [stringifiedAmount, setStringifiedAmount] = useState<string>("");
	const amount = parseFloat(stringifiedAmount) || 0;
	const [sumAmount, setSumAmount] = useState<number>(
		additionalFunding ? amount + positionAmount : amount,
	);
	const [isPromoOpen, setIsPromoOpen] = useState(false);
	const [promoCode, setPromoCode] = useState<string>("");
	const [rulesChecked, setRulesChecked] = useState<boolean>(false);
	const [success, setSuccess] = useState<boolean>(false);
	const [available, setAvailable] = useState<number>(0);
	const [formErrors, setFormErrors] = useState<{
		promoCode: string;
		amount: string;
	}>({
		promoCode: "",
		amount: "",
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [limit, setLimit] = useState<number>(0);
	const [sum, setSum] = useState<number>(0);

	const minAmount: number = +(plan.project?.min_locked_amount ?? "0");
	const maxAmount: number = +(plan.project?.max_locked_amount ?? "0");
	const interestRate: number = parseFloat(plan.interest_rate);
	const currencyCode: string = currency?.code?.toUpperCase() ?? "";
	const projectCurrency = plan.project?.currency;

	useEffect(() => {
		setAvailable(currency.available);
	}, [currency.available]);

	const togglePromo = () => {
		setIsPromoOpen((prev) => !prev);
		setPromoCode("");
	};

	useEffect(() => {
		if (plan.referral_program) {
			setLimit(parseFloat(plan.project.open_position_limit));

			const subscriptionAmountLeft: number =
				+plan.project.open_position_limit - +plan.project.open_position_sum;
			setSum(subscriptionAmountLeft);
		} else {
			setLimit(parseFloat(plan.subscription_amount_limit || ""));

			const subscriptionAmountLeft: number =
				(plan.subscription_amount_limit ? +plan.subscription_amount_limit : 0) -
				(plan.subscription_amount_used ? +plan.subscription_amount_used : 0);

			setSum(subscriptionAmountLeft);
		}
	}, []);

	const handleConfirm = () => {
		if (amount > 0 && onConfirm) {
			if (promoCode && !validatePromoCode(promoCode)) {
				setFormErrors((prevState) => ({
					...prevState,
					promoCode: "Invalid promo code",
				}));
				return;
			}

			setIsLoading(true);

			onConfirm(amount, promoCode)
				.then(() => {
					setSumAmount((prevState) => prevState + amount);
					setAvailable((prevState) => prevState - amount);
					setSuccess(true);
				})
				.catch((error: any) => {
					if (error.message) {
						toast.error(error.message);
					}
					setFormErrors({
						promoCode: error && error.data.promo_code ? error.data.promo_code[0] : "",
						amount: error && error.data.amount ? error.data.amount[0] : "",
					});
				})
				.finally(() => setIsLoading(false));
		}
	};

	const validateInput = (): boolean =>
		parseFloat(stringifiedAmount).toString(10) === stringifiedAmount;

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const value = e.target.value.replace(",", ".");
		setStringifiedAmount(
			maxAmount > 0 && parseFloat(value) > maxAmount ? maxAmount.toString(10) : value,
		);

		setFormErrors((prevState) => ({
			...prevState,
			amount: "",
		}));
	};

	const handleChangePromoCode = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setPromoCode(e.target.value);
		setFormErrors((prevState) => ({
			...prevState,
			promoCode: "",
		}));
	};

	const handleMaxClick = (): void => {
		if (available >= minAmount) {
			setStringifiedAmount(
				formatNumber(
					maxAmount > 0 && available >= maxAmount ? maxAmount : available,
					FORMAT_NUMBER_OPTIONS,
				).replace(",", "."),
			);
		}
	};

	const handleInputKeyDown = (e: React.KeyboardEvent): void => {
		if (e.key === "Enter") {
			handleConfirm();
		}
	};

	const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>): void => {
		if (available >= minAmount) {
			setRulesChecked(e.target.checked);
		}
	};

	const handleReset = (): void => {
		setStringifiedAmount("");
		setSuccess(false);
		setPromoCode("");
	};

	useEffect(() => {
		handleReset();
	}, [isOpen]);

	return (
		<Modal
			iconCode={additionalFunding ? "circle_plus" : "clock"}
			className={styles.subscribe_modal_container}
			iconClassName={styles.modal_icon}
			label={
				<div className={stylesModal.title}>
					{additionalFunding && `${formatMessage(stakingMessages.additional_funding)}. `}
					{formatMessage(commonMessages.staking)}&nbsp;
					{currencyCode}
				</div>
			}
			isOpen={isOpen}
			onClose={onClose}
		>
			{success ? (
				<Result
					additionalFunding={additionalFunding}
					amount={additionalFunding ? sumAmount : amount}
					onReset={handleReset}
					currencyCode={currencyCode}
				/>
			) : (
				<>
					<Content>
						{projectCurrency ? (
							<div className={cn(styles.modal_project_icon, stylesModal.currency_icon)}>
								{projectCurrency.image_svg || projectCurrency.image_png ? (
									<img
										src={projectCurrency.image_svg || projectCurrency.image_png || ""}
										alt={projectCurrency.code}
										width="36"
										height="36"
									/>
								) : (
									<i className={`ai ai-${projectCurrency.code.toLowerCase()}`} />
								)}
							</div>
						) : null}
						<div className={stylesModal.info_container}>
							<div className={styles.info_item_group}>
								<div className={styles.info_item}>
									<div className={styles.info_secondary}>
										{formatMessage(stakingMessages.total_left)}:
									</div>
									<div className={styles.total_left}>{`${formatNumber(sum, {
										maximumFractionDigits: 2,
										useGrouping: false,
									})}/${formatNumber(limit, {
										maximumFractionDigits: 2,
										useGrouping: false,
									})}`}</div>
								</div>
							</div>
							<div
								className={cn(styles.info_item_group, { [styles.disabled]: available < minAmount })}
							>
								{/* Staking type */}
								<div className={styles.info_item}>
									<div className={styles.info_secondary}>
										{formatMessage(stakingMessages.staking_type)}:
									</div>
									<div className={styles.stake_type_row}>
										<div className={styles.stake_type_item}>
											{formatMessage(stakingMessages.flexible)}
										</div>
										{plan.referral_program ? (
											<div className={cn(styles.stake_type_item, styles.referral)}>
												{formatMessage(stakingMessages.referral)}
											</div>
										) : null}
									</div>
								</div>
								{!plan.referral_program ? (
									<div className={styles.info_item}>
										<div className={styles.info_secondary}>
											{formatMessage(stakingMessages.payment_period)}:
										</div>
										<div className={styles.info_secondary}>{`1 ${formatMessage(
											commonMessages.day,
										)}`}</div>
									</div>
								) : null}
								{interestRate > 0 && (
									<div className={styles.info_item}>
										<div className={styles.info_secondary}>
											{formatMessage(stakingMessages.estimated_return_for_30_days)}:
										</div>
										<div className={styles.info_secondary} style={styleProps({ color: "#00C853" })}>
											{formatNumber(interestRate * 100, FORMAT_NUMBER_OPTIONS)}%
										</div>
									</div>
								)}
								{/* Subscription Period Limit */}
								{plan.referral_program && (plan.subscription_period_limit || 0) > 0 ? (
									<div className={styles.info_item}>
										<div className={styles.info_secondary}>
											{formatMessage(stakingMessages.subscription_period_limit)}:
										</div>
										<div className={styles.info_secondary} style={styleProps({ color: "#00C853" })}>
											{formatMessage(stakingMessages.days_plain, {
												count: plan.subscription_period_limit,
											})}
										</div>
									</div>
								) : null}
								{/* Penalty Rate */}
								{/* {plan.referral_program && plan.penalty_rate ? ( */}
								{plan.penalty_rate ? (
									<div className={styles.info_item}>
										<div className={styles.info_secondary}>
											{formatMessage(stakingMessages.penalty_rate)}:
										</div>
										<div
											className={cn(styles.info_secondary, styles.referral)}
											style={styleProps({ color: "#FF5F66" })}
										>
											{formatMessage(stakingMessages.penalty, {
												percent: formatNumber(parseFloat(plan.penalty_rate) * 100, {
													maximumFractionDigits: 2,
												}),
											})}
										</div>
									</div>
								) : null}
							</div>
						</div>
						{available >= minAmount && (
							<>
								<div className={styles.input_group_container}>
									<div className={styles.display_amount_row}>
										<span className={styles.display_amount_text}>{`${formatMessage(
											stakingMessages.available,
										)}: ${currency.available}`}</span>
									</div>
									<Input
										onChange={handleAmountChange}
										value={stringifiedAmount || undefined}
										error={formErrors.amount}
										labelValue={formatMessage(stakingMessages.position_amount)}
										appender={
											<Appender>
												{currency?.code?.toUpperCase() ?? ""}
												<AppenderDivider />
												<AppenderButton onClick={handleMaxClick}>max</AppenderButton>
											</Appender>
										}
										onKeyDown={handleInputKeyDown}
										disabled={available < minAmount}
										helpText={
											<>
												{formatMessage(stakingMessages.min_rate)}:&nbsp;
												{formatNumber(minAmount, FORMAT_NUMBER_OPTIONS)}
												{maxAmount > 0 && (
													<>
														&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
														{formatMessage(stakingMessages.max_rate)}:&nbsp;
														{formatNumber(maxAmount, FORMAT_NUMBER_OPTIONS)}
													</>
												)}
											</>
										}
									/>
								</div>
								{!plan.referral_program ? (
									<div className={styles.promo_container}>
										<div
											className={cn(styles.toggle_button, { [styles.active]: isPromoOpen })}
											onClick={togglePromo}
										>
											<i className={`ai ai-${isPromoOpen ? "minus" : "plus"}_mini`} />
											<span>{formatMessage(commonMessages.i_have_promo_code)}</span>
										</div>
										{isPromoOpen && (
											<Input
												value={promoCode}
												onChange={handleChangePromoCode}
												disabled={available < minAmount}
												error={formErrors.promoCode}
												helpText={
													<div className={styles.promo_code_help_text}>
														<i className="ai ai-warning" />
														<span>{formatMessage(commonMessages.one_time_promo_code_usage)}</span>
													</div>
												}
											/>
										)}
									</div>
								) : null}
								<CheckBox
									onChange={handleCheckBox}
									name="staking-accept"
									required
									checked={rulesChecked}
								>
									{formatMessage(stakingMessages.accept_rules, {
										rules: (
											<InternalLink to={routes.termsOfUse} blank>
												&nbsp;{formatMessage(commonMessages.rules_mult)}
											</InternalLink>
										),
									})}
								</CheckBox>
							</>
						)}
					</Content>
					{available >= minAmount && (
						<Footer>
							<ActionGroup>
								<Button
									color="secondary"
									fullWidth
									iconCode="clock"
									iconAlign="left"
									onClick={handleConfirm}
									isLoading={isLoading}
									disabled={
										!amount ||
										!validateInput() ||
										!rulesChecked ||
										available < minAmount ||
										amount < minAmount
									}
									label={formatMessage(
										additionalFunding
											? stakingMessages.add_funds
											: stakingMessages.landing_stake_now,
									)}
								/>
								<InternalLink to={routes.profile.getDepositCurrency(currencyCode)} blank>
									<Button
										color="secondary"
										variant="outlined"
										fullWidth
										label={formatMessage(financeMessages.deposit)}
									/>
								</InternalLink>
							</ActionGroup>
						</Footer>
					)}
				</>
			)}
			{available < minAmount && !success && (
				<NotEnoughFunds minAmount={minAmount} currencyCode={currencyCode} />
			)}
		</Modal>
	);
};

export default SubscribeModal;

import React, { useEffect, useState } from "react";
import cn from "classnames";
import { MessageDescriptor, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { observer } from "mobx-react-lite";
import { AnyObjectSchema } from "yup";

import Button from "components/UI/Button";
import Input, { Appender, AppenderButton, AppenderDivider } from "components/UI/Input";
import InternalLink from "components/InternalLink";
import { queryVars } from "constants/query";
import { routes } from "constants/routing";
import styles from "styles/pages/P2P/Main.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import { IAd, IRequisites, P2PSideEnum } from "types/p2p";
import P2PService, { useCurrencyBalance } from "services/P2PService";
import errorHandler from "utils/errorHandler";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { useMst } from "models/Root";
import { getPercentageOf } from "utils/p2p";
import { getErrorFromYupValidationRes } from "utils/getter";
import { IError } from "types/general";
import { handleFormErrors } from "utils/form";
import { CREATE_ORDER_VALIDATION_SCHEMA } from "constants/p2p";
import { getRoundedNumber, limitDecimals } from "utils/format";
import commonMessages from "messages/common";
import useWindowSize from "hooks/useWindowSize";
import p2pMessages from "messages/p2p";
import historyMessages from "messages/history";
import financeMessages from "messages/finance";
import buyCryptoMessages from "messages/buy_crypto";
import SelectPaymentMethodModal from "./modals/SelectPaymentMethodModal";
import TradingRequirementsModal from "./modals/TradingRequirementsModal";

interface IProps {
	ad: IAd;
	isUserPage?: boolean;
}

interface IFormBody {
	trade_amount: number;
	receive_amount: number;
	[queryVars.requisites]: number;
}

type IFormErrors = Partial<Record<keyof IFormBody, string>>;

const INITIAL_FORM_STATE: IFormBody = {
	trade_amount: NaN,
	receive_amount: NaN,
	[queryVars.requisites]: NaN,
};

const Ad: React.FC<IProps> = ({
	isUserPage,
	ad: { id, side, pair, price, available, limit, profile, terms, payment_methods },
}) => {
	const { medium } = useWindowSize();
	const {
		global: { isAuthenticated },
		account: { profileStatus },
	} = useMst();
	const { formatNumber, formatMessage } = useIntl();
	const [isActive, toggleIsActive] = useState(false);
	const localeNavigate = useLocaleNavigate();

	const [isPaymentModalOpened, togglePaymentModal] = useState(false);
	const [isRequirementsModalOpened, toggleRequirementsModal] = useState(false);
	const [baseCurrency, quoteCurrency] = pair.symbol.split("_") || [];
	const [formBody, setFormBody] = useState<IFormBody>(INITIAL_FORM_STATE);
	const [formErrors, setFormErrors] = useState<IFormErrors>({});
	const [isLoading, setIsLoading] = useState(false);
	const [selectedRequisites, setSelectedRequisites] = useState<IRequisites | null>();

	const { data: balanceOfBaseCurrency } = useCurrencyBalance(
		isActive && baseCurrency ? baseCurrency : "",
	);

	const paymentMethodLabel = payment_methods?.map(({ name }) => name).join(", ");
	const maximumBaseCurrencyAvailable = +available < +limit.maximum ? +available : +limit.maximum;

	const validate = async (
		schema: (formatMessages: (v: MessageDescriptor) => string) => AnyObjectSchema,
		resolve: (...args: any[]) => void,
		reject: (...args: any[]) => void,
	) => {
		await schema(formatMessage)
			.validate(formBody, {
				abortEarly: false,
			})
			.then((res) => {
				setFormErrors({});
				resolve(res);
			})
			.catch((err) => {
				setFormErrors(getErrorFromYupValidationRes<IFormErrors>(err));
				reject(err);
			});
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
		if (!isAuthenticated) {
			return localeNavigate(routes.login.redirect(routes.p2p.main));
		}

		if (!profileStatus?.p2p_terms_accepted) {
			return toggleRequirementsModal(true);
		}

		if (!isActive) {
			return toggleIsActive(true);
		}

		return new Promise((resolve, reject) => {
			validate(
				(formatter) =>
					CREATE_ORDER_VALIDATION_SCHEMA(
						formatter,
						side,
						+limit.minimal * +price,
						maximumBaseCurrencyAvailable * +price,
						+(balanceOfBaseCurrency?.balance || 0),
					),
				resolve,
				reject,
			);
		})
			.then(() => {
				setIsLoading(true);
				P2PService.createOrder({
					[queryVars.order]: id,
					[queryVars.amount]:
						side === P2PSideEnum.Sell ? formBody.receive_amount : formBody.trade_amount,
					...(side === P2PSideEnum.Buy ? { [queryVars.requisites]: [formBody.requisites] } : {}),
				})
					.then(({ id }) => {
						localeNavigate(routes.p2p.getOrderDetails(id));
						toast.success(formatMessage(p2pMessages.order_created));
					})
					.catch(handleErrors)
					.finally(() => setIsLoading(false));
			})
			.catch((err) => console.log(err));
	};

	const handleSelectMethod = (req: IRequisites) => {
		setSelectedRequisites(req);
		setFormBody((prevState) => ({ ...prevState, requisites: req.id }));
	};

	const getReceiveAmount = (value: number) =>
		getRoundedNumber(
			side === P2PSideEnum.Sell ? value / +price : value * +price,
			side === P2PSideEnum.Sell ? pair.base_currency.precision : pair.quote_currency.precision,
		);

	const getTradeAmount = (value: number) =>
		getRoundedNumber(
			side === P2PSideEnum.Sell ? value * +price : value / +price,
			side === P2PSideEnum.Sell ? pair.quote_currency.precision : pair.base_currency.precision,
		);

	const tradePrecision =
		side === P2PSideEnum.Sell ? pair.quote_currency.precision : pair.base_currency.precision;

	const receivePrecision =
		side === P2PSideEnum.Sell ? pair.base_currency.precision : pair.quote_currency.precision;

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		const formattedValue = limitDecimals(
			value,
			name === "trade_amount" ? tradePrecision : receivePrecision,
		);

		setFormErrors({});
		setFormBody((prevState) => ({
			...prevState,
			[name]: formattedValue,
			...(name === "trade_amount"
				? {
						receive_amount: getReceiveAmount(+formattedValue),
				  }
				: {
						trade_amount: getTradeAmount(+formattedValue),
				  }),
		}));
	};

	const handleSetPayment = () => {
		setFormErrors({});
		togglePaymentModal(true);
	};

	const handleMaxClick = () => {
		const maxAvailableBaseCurrencyToSell =
			+(balanceOfBaseCurrency?.balance || 0) < maximumBaseCurrencyAvailable
				? +(balanceOfBaseCurrency?.balance || 0)
				: maximumBaseCurrencyAvailable;

		const maxTradeAmount =
			side === P2PSideEnum.Sell
				? +price * maximumBaseCurrencyAvailable
				: maxAvailableBaseCurrencyToSell;

		setFormBody((prevState) => ({
			...prevState,
			trade_amount: maxTradeAmount,
			receive_amount: getReceiveAmount(maxTradeAmount),
		}));
	};

	useEffect(() => {
		if (!isActive) {
			setSelectedRequisites(null);
			setFormBody(INITIAL_FORM_STATE);
			setFormErrors({});
		}
	}, [isActive]);

	const isValid = !(!formBody.trade_amount || (side === P2PSideEnum.Buy && !formBody.requisites));

	const tradeForm = (
		<div className={styles.trade_form}>
			<Input
				name="trade_amount"
				type="number"
				value={formBody.trade_amount}
				error={formErrors.trade_amount}
				onChange={handleInputChange}
				labelValue={formatMessage(p2pMessages.i_want_to, {
					value:
						side === P2PSideEnum.Sell
							? formatMessage(p2pMessages.pay)
							: formatMessage(buyCryptoMessages.sell),
				})}
				appender={
					<Appender>
						{side === P2PSideEnum.Sell ? quoteCurrency : baseCurrency}
						<AppenderDivider />
						<AppenderButton onClick={handleMaxClick}>All</AppenderButton>
					</Appender>
				}
				helpText={
					side === P2PSideEnum.Buy ? (
						<span className={p2pStyles.help_text}>
							{formatMessage(commonMessages.available_balance)}{" "}
							<strong>
								{formatNumber(+(balanceOfBaseCurrency?.balance || 0), {
									maximumFractionDigits: balanceOfBaseCurrency?.precision,
								})}{" "}
								{baseCurrency}
							</strong>
						</span>
					) : null
				}
			/>
			<Input
				name="receive_amount"
				type="number"
				onChange={handleInputChange}
				value={formBody.receive_amount}
				error={formErrors.receive_amount}
				labelValue={formatMessage(p2pMessages.i_will_receive)}
				appender={<Appender>{side === P2PSideEnum.Sell ? baseCurrency : quoteCurrency}</Appender>}
			/>
			{side === P2PSideEnum.Buy && (
				<Button
					onClick={handleSetPayment}
					className={styles.payment_method_btn}
					fullWidth={medium}
					variant="outlined"
					label={
						selectedRequisites
							? selectedRequisites.payment_method.name
							: formatMessage(p2pMessages.select_pm)
					}
				/>
			)}
			<Button
				onClick={handleSubmit}
				disabled={!isValid}
				className={styles.confirm_btn}
				isLoading={isLoading}
				color={side === P2PSideEnum.Sell ? "tertiary" : "secondary"}
				label={
					side === P2PSideEnum.Sell
						? formatMessage(buyCryptoMessages.buy)
						: formatMessage(buyCryptoMessages.sell)
				}
			/>
		</div>
	);

	return (
		<>
			{isActive && <div onClick={() => toggleIsActive(false)} className={styles.ad_overlay} />}
			<div className={cn(styles.order, { [styles.isActive]: isActive })}>
				<div className={styles.top}>
					<div className={styles.info_block}>
						<span className={p2pStyles.smallcaps_label}>
							{formatMessage(p2pMessages.price_per)} 1 {baseCurrency}
						</span>
						<span className={styles.price}>
							{formatNumber(+price, {
								useGrouping: true,
								minimumFractionDigits: pair.quote_currency.precision,
								maximumFractionDigits: pair.quote_currency.precision,
							})}{" "}
							{quoteCurrency}
						</span>
					</div>
					{isActive ? (
						<div onClick={() => toggleIsActive(false)} className={styles.close_btn}>
							<i className="ai ai-x_close" />
						</div>
					) : (
						<Button
							isLoading={isLoading}
							className={styles.buy_button}
							color={side === P2PSideEnum.Sell ? "tertiary" : "secondary"}
							label={`${
								side === P2PSideEnum.Sell
									? formatMessage(buyCryptoMessages.buy)
									: formatMessage(buyCryptoMessages.sell)
							} ${baseCurrency}`}
							onClick={handleSubmit}
						/>
					)}
				</div>
				<div className={styles.middle}>
					<div className={cn(styles.info_block, styles.available)}>
						<span className={p2pStyles.smallcaps_label}>
							{formatMessage(historyMessages.funds_available)}
						</span>
						<span className={styles.value}>
							{formatNumber(+available, {
								useGrouping: true,
								minimumFractionDigits: pair.base_currency.precision,
								maximumFractionDigits: pair.base_currency.precision,
							})}{" "}
							{baseCurrency}
						</span>
					</div>
					<div className={cn(styles.info_block, styles.limit)}>
						<span className={p2pStyles.smallcaps_label}>
							{formatMessage(financeMessages.limit)}
						</span>
						<span className={styles.value}>
							{formatNumber(+limit.minimal * +price, {
								useGrouping: true,
								minimumFractionDigits: pair.quote_currency.precision,
								maximumFractionDigits: pair.quote_currency.precision,
							})}{" "}
							-{" "}
							{formatNumber(+limit.maximum * +price, {
								useGrouping: true,
								minimumFractionDigits: pair.quote_currency.precision,
								maximumFractionDigits: pair.quote_currency.precision,
							})}{" "}
							{quoteCurrency}
						</span>
					</div>
					<div className={cn(styles.info_block, styles.payment_method)}>
						<span className={p2pStyles.smallcaps_label}>
							{formatMessage(p2pMessages.payment_method)}
						</span>
						<span className={styles.value}>{paymentMethodLabel}</span>
					</div>
					{isActive && (
						<>
							<div className={cn(styles.info_block, styles.payment_time)}>
								<span className={p2pStyles.smallcaps_label}>
									{formatMessage(p2pMessages.payment_time)}
								</span>
								<span className={styles.value}>{profile.avg_payment_time} min.</span>
							</div>
							{terms && (
								<div className={cn(styles.info_block, styles.terms)}>
									<span className={p2pStyles.smallcaps_label}>
										{formatMessage(p2pMessages.terms_and_conditions)}
									</span>
									<span className={styles.value}>{terms}</span>
								</div>
							)}
							{!medium && tradeForm}
						</>
					)}
				</div>
				<div className={styles.bottom}>
					<div className={styles.merchant}>
						{isUserPage ? (
							<>
								<img
									src={pair.base_currency.image_svg || pair.base_currency.image_png}
									alt={pair.base_currency.code}
								/>
								{baseCurrency}
							</>
						) : (
							<InternalLink to={routes.p2p.getUserDetails(profile.id)}>
								{profile?.is_merchant && (
									<i title="Verified Merchant" className={cn(styles.icon, "ai ai-check_filled")} />
								)}{" "}
								<span title={profile?.nickname}>{profile?.nickname}</span>
							</InternalLink>
						)}
					</div>
					{!isUserPage && (
						<div className={styles.orders_stats}>
							<span>
								{profile?.all_trades} {formatMessage(historyMessages.orders)}
							</span>
							<span>
								{getPercentageOf(profile?.orders_completed, profile?.all_trades)}%{" "}
								{formatMessage(p2pMessages.completion)}
							</span>
						</div>
					)}
				</div>
				{isActive && medium ? <div>{tradeForm}</div> : null}
			</div>
			{isPaymentModalOpened ? (
				<SelectPaymentMethodModal
					side={side}
					setMethod={handleSelectMethod}
					methodOptions={payment_methods}
					isOpen={isPaymentModalOpened}
					onClose={() => togglePaymentModal(false)}
				/>
			) : null}
			<TradingRequirementsModal
				isOpen={isRequirementsModalOpened}
				onClose={() => toggleRequirementsModal(false)}
			/>
		</>
	);
};

export default observer(Ad);

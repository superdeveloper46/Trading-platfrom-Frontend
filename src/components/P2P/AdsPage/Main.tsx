import React, { ChangeEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";
import cn from "classnames";

import { useAds, usePairs, usePaymentMethods } from "services/P2PService";
import commonMessages from "messages/common";
import styles from "styles/pages/P2P/Main.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import { IAdListRequestParams, P2PSideEnum } from "types/p2p";
import Ad from "components/P2P/Ad";
import { getLoadParams, getUrlParams } from "utils/filter";
import useParamQuery from "hooks/useSearchQuery";
import { queryVars } from "constants/query";
import { ADS_PAGE_PAGE_SIZE } from "constants/p2p";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import Input, { Appender, AppenderButton, AppenderDivider } from "components/UI/Input";
import Select, { ISelectOption } from "components/UI/Select";
import Button from "components/UI/Button";
import LoadingSpinner from "components/UI/LoadingSpinner";
import DropdownWithContent from "components/DropdownWithContent";
import CheckBox from "components/UI/CheckBox";
import NewPagination from "components/UI/NewPagination";
import CountrySelect from "components/UI/CountrySelect";
import { useMst } from "models/Root";
import useWindowSize from "hooks/useWindowSize";
import { ReactComponent as FilterIcon } from "assets/icons/filter-funnel-icon.svg";
import p2pMessages from "messages/p2p";
import buyCryptoMessages from "messages/buy_crypto";

interface IFilter {
	[queryVars.side]?: number | P2PSideEnum.Sell;
	// [queryVars.currency]?: string | null;
	[queryVars.page]: number;
	[queryVars.page_size]: number;
	[queryVars.quote_currency]?: string | null;
	[queryVars.base_currency]?: string | null;
	[queryVars.amount_min]?: string;
	[queryVars.payment_method]?: string | null;
	[queryVars.region]?: string | null;
	[queryVars.is_merchant]: boolean;
}

const Main = () => {
	const { smallDesktop, tablet, mobile } = useWindowSize();
	const { formatMessage } = useIntl();
	const {
		global: { locale },
	} = useMst();

	const navigate = useNavigate();
	const query = useParamQuery();
	const querySide = +(query.get(queryVars.side) || P2PSideEnum.Sell);
	const queryPage = +(query.get(queryVars.page) || 1);
	const queryBaseCurrency = query.get(queryVars.base_currency);
	const queryQuoteCurrency = query.get(queryVars.quote_currency);
	const queryAmount = query.get(queryVars.amount_min);
	const queryPaymentMethod = query.get(queryVars.payment_method);
	const queryPaymentRegion = query.get(queryVars.region);
	const queryOnlyMerchant = query.get(queryVars.is_merchant) || false;

	const [filter, setFilter] = useState<IFilter>({
		[queryVars.page]: queryPage,
		[queryVars.page_size]: ADS_PAGE_PAGE_SIZE,
		[queryVars.side]: querySide,
		[queryVars.base_currency]: queryBaseCurrency,
		[queryVars.quote_currency]: queryQuoteCurrency,
		[queryVars.amount_min]: queryAmount || "",
		[queryVars.payment_method]: queryPaymentMethod,
		[queryVars.region]: queryPaymentRegion,
		[queryVars.is_merchant]: Boolean(queryOnlyMerchant),
	});

	const [loadParams, setLoadParams] = useState<IAdListRequestParams>(getLoadParams(filter));
	const { data: ads, isFetching: isAdsLoading, refetch } = useAds(loadParams);
	const { data: pairs, isFetching: isPairsLoading } = usePairs();
	const { data: paymentMethods, isFetching: isMethodsLoading } = usePaymentMethods();

	const handleSideChange = (side: P2PSideEnum) => {
		setFilter((prevState) => ({
			...prevState,
			[queryVars.side]: side,
		}));
		navigate({
			[queryVars.search]: getUrlParams({ ...filter, [queryVars.side]: side, [queryVars.page]: 1 }),
		});
		setLoadParams(
			getLoadParams({
				...filter,
				[queryVars.side]: side,
				[queryVars.page]: 1,
			}),
		);
	};

	const cryptoOptions: IOption[] = useMemo(() => {
		const uniqueCoins: string[] = [];
		if (pairs?.results) {
			return pairs.results
				.filter((v) => {
					if (!uniqueCoins.includes(v.base_currency.code)) {
						uniqueCoins.push(v.base_currency.code);
						return true;
					}
					return false;
				})
				.map(({ base_currency }) => ({
					value: base_currency.code,
					label: {
						code: base_currency.code,
						name: base_currency.name,
						image_png: base_currency.image_png,
						image_svg: base_currency.image_svg,
					},
				}));
		}
		return [];
	}, [pairs?.results]);

	const fiatOptions: IOption[] = useMemo(() => {
		if (pairs?.results) {
			const uniqueCoins: string[] = [];
			return pairs.results
				.filter((v) => {
					if (!uniqueCoins.includes(v.quote_currency.code)) {
						uniqueCoins.push(v.quote_currency.code);
						return true;
					}
					return false;
				})
				.map(({ quote_currency }) => ({
					value: quote_currency.code,
					label: {
						code: quote_currency.code,
						name: quote_currency.name,
						image_png: quote_currency.image_png,
						image_svg: quote_currency.image_svg,
					},
				}));
		}
		return [];
	}, [pairs?.results]);

	const methodsOptions: ISelectOption[] =
		paymentMethods?.results.map(({ name, id }) => ({
			value: id.toString(),
			label: name,
		})) || [];

	const regions = useMemo(() => {
		if (pairs?.results) {
			const uniqueRegions: string[] = [];
			pairs.results.forEach(({ regions }) =>
				regions.forEach((reg) => (!uniqueRegions.includes(reg) ? uniqueRegions.push(reg) : null)),
			);
			return uniqueRegions;
		}
		return [];
	}, [pairs?.results]);

	const handleSelectChange = (name: keyof IFilter, v: IOption | ISelectOption | null): void => {
		const value = v?.value ?? "";
		setFilter((prevState) => ({
			...prevState,
			[name]: value,
		}));
		navigate({
			[queryVars.search]: getUrlParams({ ...filter, [name]: value }),
		});
		setLoadParams(getLoadParams({ ...filter, [name]: value, [queryVars.page]: 1 }));
	};

	const handleRegionChange = (value: string) => {
		setFilter((prevState) => ({
			...prevState,
			[queryVars.region]: value,
		}));
		navigate({
			[queryVars.search]: getUrlParams({ ...filter, [queryVars.region]: value }),
		});
		setLoadParams(getLoadParams({ ...filter, [queryVars.region]: value, [queryVars.page]: 1 }));
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFilter((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handlePageChange = (page: number): void => {
		setFilter((prevState) => ({
			...prevState,
			[queryVars.page]: page,
		}));
		navigate({ [queryVars.search]: getUrlParams({ ...filter, [queryVars.page]: page }) });
		setLoadParams(getLoadParams({ ...filter, [queryVars.page]: page }));
	};

	const handleInputKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const cryptoCurrencyValue =
		cryptoOptions.find((o) => o.label.code === filter.base_currency) ?? undefined;

	const fiatCurrencyValue =
		fiatOptions.find((o) => o.label.code === filter.quote_currency) ?? undefined;

	const paymentValue: ISelectOption | null = useMemo(() => {
		if (filter.payment_method && paymentMethods?.results) {
			const method = paymentMethods.results.find(
				({ id }) => filter.payment_method === id.toString(),
			);
			if (method) {
				return {
					value: method.id.toString(),
					label: method.name,
				};
			}
		}
		return null;
	}, [filter.payment_method, paymentMethods]);

	const handleSearch = () => {
		navigate({ [queryVars.search]: getUrlParams({ ...filter, [queryVars.page]: 1 }) });
		setLoadParams(getLoadParams({ ...filter, [queryVars.page]: 1 }));
	};

	const handleMerchantClick = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = e.target;
		setFilter((prevState) => ({
			...prevState,
			[queryVars.is_merchant]: checked,
		}));
		setLoadParams(
			getLoadParams({
				...filter,
				[queryVars.is_merchant]: checked,
			}),
		);
		navigate({
			[queryVars.search]: getUrlParams({ ...filter, [queryVars.is_merchant]: checked }),
		});
	};

	const fiatSelect = (
		<CurrencySelect
			isClearable
			label="FIAT"
			value={fiatCurrencyValue}
			onSelectChange={(o) => handleSelectChange(queryVars.quote_currency, o)}
			options={fiatOptions}
			isLoading={isPairsLoading}
			className={cn(styles.input_block, styles.currency)}
			autoFocus
			tiny
		/>
	);

	const amountInput = (
		<Input
			name={queryVars.amount_min}
			type="number"
			onChange={handleInputChange}
			value={filter.amount_min}
			labelValue={formatMessage(commonMessages.amount)}
			appender={
				<Appender>
					{queryBaseCurrency}
					<AppenderDivider />
					<AppenderButton onClick={handleSearch}>
						{formatMessage(commonMessages.search)}
					</AppenderButton>
				</Appender>
			}
			containerClassName={cn(styles.input_block, styles.amount_input)}
			onKeyDown={handleInputKeyDown}
		/>
	);

	const methodsSelect = (
		<Select
			isClearable
			options={methodsOptions}
			isLoading={isMethodsLoading}
			onChange={(o: ISelectOption) => handleSelectChange(queryVars.payment_method, o)}
			className={styles.input_block}
			placeholder={formatMessage(p2pMessages.all_payments)}
			label={formatMessage(p2pMessages.all_payments)}
			value={paymentValue}
		/>
	);

	const countrySelect = (
		<CountrySelect
			containerClassname={styles.input_block}
			name="country"
			countries={regions}
			value={filter.region}
			onSelect={(_: never, value: string) => handleRegionChange(value)}
			label={formatMessage(p2pMessages.all_regions)}
			locale={locale}
		/>
	);

	const filterChosenCount = [
		filter.quote_currency,
		filter.region,
		filter.is_merchant,
		filter.payment_method,
		filter.amount_min,
	].reduce((count, item) => (item ? count + 1 : count), 0);

	return (
		<>
			<div className={styles.filters}>
				<div
					className={cn(p2pStyles.side_selector, styles.side_selector, {
						[p2pStyles.right]: filter.side === P2PSideEnum.Buy,
					})}
				>
					<div onClick={() => handleSideChange(P2PSideEnum.Sell)} className={p2pStyles.side_button}>
						{formatMessage(buyCryptoMessages.buy)}
					</div>
					<div onClick={() => handleSideChange(P2PSideEnum.Buy)} className={p2pStyles.side_button}>
						{formatMessage(buyCryptoMessages.sell)}
					</div>
				</div>
				<CurrencySelect
					isClearable
					value={cryptoCurrencyValue}
					onSelectChange={(o) => handleSelectChange(queryVars.base_currency, o)}
					options={cryptoOptions}
					className={cn(styles.input_block, styles.currency)}
					isLoading={isPairsLoading}
					autoFocus
					tiny
				/>
				{!tablet && amountInput}
				{!mobile && (
					<>
						<span className={styles.item_label}>{formatMessage(p2pMessages.for)}</span>
						{fiatSelect}
					</>
				)}
				{!tablet && (
					<>
						<span className={styles.item_label}>{formatMessage(p2pMessages.by)}</span>
						{methodsSelect}
					</>
				)}
				{!smallDesktop && (
					<>
						<span className={styles.item_label}>{formatMessage(p2pMessages.in)}</span>
						{countrySelect}
					</>
				)}
				<DropdownWithContent
					className={styles.dropdown_container}
					label={({ isOpened }) => (
						<div
							// onClick={() => handleNavChange(id)}
							className={styles.filter}
						>
							{smallDesktop && <FilterIcon />}
							{mobile && `(${filterChosenCount})`}
							{!mobile && <span>{formatMessage(p2pMessages.filter)}</span>}
							{!smallDesktop && <i className={`ai ai-arrow_${isOpened ? "up" : "down"}`} />}
						</div>
					)}
				>
					{({ close }) => (
						<div className={styles.filter_content} {...(!smallDesktop ? { onClick: close } : {})}>
							{tablet && amountInput}
							{mobile && fiatSelect}
							{tablet && methodsSelect}
							{smallDesktop && countrySelect}
							<CheckBox
								name="only-merchant"
								checked={filter.is_merchant}
								onChange={handleMerchantClick}
							>
								{formatMessage(p2pMessages.only_merchant)}
							</CheckBox>
						</div>
					)}
				</DropdownWithContent>
				<Button
					className={styles.refresh}
					variant="outlined"
					iconCode="ai ai-change"
					isLoading={isAdsLoading}
					onClick={() => refetch()}
					label={formatMessage(p2pMessages.refresh)}
				/>
				{/* <RefreshModal isOpen={isModalOpened} onClose={() => toggleModal(false)} /> */}
			</div>
			<div className={styles.orders_list}>
				{isAdsLoading ? <LoadingSpinner /> : ads?.results.map((ad, i) => <Ad key={i} ad={ad} />)}
			</div>
			{ads && ads.results.length && ads.count > ADS_PAGE_PAGE_SIZE ? (
				<div className={p2pStyles.pagination_container}>
					<NewPagination
						count={Math.ceil(ads.count / ADS_PAGE_PAGE_SIZE)}
						page={filter.page}
						onChange={handlePageChange}
					/>
				</div>
			) : null}
		</>
	);
};

export default observer(Main);

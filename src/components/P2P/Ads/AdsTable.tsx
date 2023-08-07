import React, { useMemo, useState } from "react";
import cn from "classnames";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

import commonMessages from "messages/common";
import p2pMessages from "messages/p2p";
import buyCryptoMessages from "messages/buy_crypto";
import historyMessages from "messages/history";
import financeMessages from "messages/finance";
import { RowSkeleton } from "components/UI/Table";
import { AlignEnum, IHeader } from "components/UI/Table/Table";
import Select, { ISelectOption } from "components/UI/Select";
import Button from "components/UI/Button";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import { IMyAdsListRequestParams, P2PSideEnum } from "types/p2p";
import { getLoadParams, getUrlParams } from "utils/filter";
import { useMyAds, usePairs } from "services/P2PService";
import useParamQuery from "hooks/useSearchQuery";
import { queryVars } from "constants/query";
import { ADS_PAGE_PAGE_SIZE } from "constants/p2p";
import NewPagination from "components/UI/NewPagination";
import noResultsStyles from "styles/components/Table/NoResultMessage.module.scss";
import styles from "styles/pages/P2P/Main.module.scss";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import { YesNoEnum } from "types/general";
import { Table } from "components/UI/NewTable";
import DropdownWithContent from "components/DropdownWithContent";
import { ReactComponent as FilterIcon } from "assets/icons/filter-funnel-icon.svg";
import useWindowSize from "hooks/useWindowSize";
import AdTableRow from "./AdTableRow";

const PAGE_SIZE = 4;

enum TabOptionsEnum {
	Online,
	History,
}

interface IFilter {
	[queryVars.side]?: string | null;
	[queryVars.page]: number;
	[queryVars.page_size]: number;
	[queryVars.quote_currency]?: string | null;
	[queryVars.base_currency]?: string | null;
	[queryVars.is_active]: string;
}

const AdsTable = () => {
	const { formatMessage } = useIntl();
	const { mobile, smallTablet } = useWindowSize();

	const navigate = useNavigate();
	const query = useParamQuery();
	const querySide = query.get(queryVars.side);
	const queryPage = +(query.get(queryVars.page) || 1);
	const queryBaseCurrency = query.get(queryVars.base_currency);
	const queryQuoteCurrency = query.get(queryVars.quote_currency);
	const queryIsActive = query.get(queryVars.is_active) || YesNoEnum.Yes;

	const [filter, setFilter] = useState<IFilter>({
		[queryVars.page]: queryPage,
		[queryVars.page_size]: ADS_PAGE_PAGE_SIZE,
		[queryVars.side]: querySide,
		[queryVars.base_currency]: queryBaseCurrency,
		[queryVars.quote_currency]: queryQuoteCurrency,
		[queryVars.is_active]: queryIsActive,
	});

	const [loadParams, setLoadParams] = useState<IMyAdsListRequestParams>(getLoadParams(filter));
	const { data: ads, isFetching, refetch } = useMyAds(loadParams);
	const { data: pairs, isFetching: isPairsLoading } = usePairs();

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

	const handleTabChange = (tab: TabOptionsEnum) => {
		setFilter((prevState) => ({
			...prevState,
			[queryVars.page]: 1,
			[queryVars.is_active]: tab === TabOptionsEnum.Online ? YesNoEnum.Yes : YesNoEnum.No,
		}));
		setLoadParams(
			getLoadParams({
				...filter,
				[queryVars.page]: 1,
				[queryVars.is_active]: tab === TabOptionsEnum.Online ? YesNoEnum.Yes : YesNoEnum.No,
			}),
		);
		navigate({
			[queryVars.search]: getUrlParams({
				...filter,
				[queryVars.is_active]: tab === TabOptionsEnum.Online ? YesNoEnum.Yes : YesNoEnum.No,
			}),
		});
	};

	const flowNavItems = [
		{
			id: TabOptionsEnum.Online,
			label: formatMessage(p2pMessages.ads),
		},
		{
			id: TabOptionsEnum.History,
			label: formatMessage(p2pMessages.ads_history),
		},
	];

	const sideOptions: ISelectOption[] = [
		{
			value: P2PSideEnum.Buy.toString(),
			label: formatMessage(buyCryptoMessages.buy),
		},
		{
			value: P2PSideEnum.Sell.toString(),
			label: formatMessage(buyCryptoMessages.sell),
		},
	];

	const headerOptions: IHeader = {
		columns: [
			{
				name: "side",
				label: formatMessage(historyMessages.trades_table_side),
				width: "120px",
				maxWidth: "120px",
			},
			{
				name: "coin",
				label: formatMessage(commonMessages.coin),
				width: "120px",
				maxWidth: "120px",
			},
			{
				name: "fiat-amount",
				label: formatMessage(p2pMessages.fiat_amount),
				width: "180px",
				maxWidth: "180px",
			},
			{
				name: "price",
				label: formatMessage(commonMessages.price),
				width: "180px",
				maxWidth: "180px",
			},
			{
				name: "available-amount",
				label: formatMessage(financeMessages.available),
				width: "180px",
				maxWidth: "180px",
			},
			{
				name: "crypto-amount",
				label: formatMessage(p2pMessages.crypto_amount),
				width: "180px",
				maxWidth: "180px",
			},
			{
				name: "cancel",
				label: formatMessage(historyMessages.active_orders_action_cancel),
				align: AlignEnum.Right,
				width: "120px",
				maxWidth: "120px",
			},
		],
	};

	const handlePageChange = (page: number): void => {
		setFilter((prevState) => ({
			...prevState,
			[queryVars.page]: page,
		}));
		navigate({ [queryVars.search]: getUrlParams({ ...filter, [queryVars.page]: page }) });
		setLoadParams(getLoadParams({ ...filter, [queryVars.page]: page }));
	};

	const handleSelectChange = (name: keyof IFilter, v: IOption | ISelectOption | null): void => {
		const value = v?.value ?? "";
		setFilter((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSearch = (): void => {
		navigate({ [queryVars.search]: getUrlParams({ ...filter, [queryVars.page]: 1 }) });
		setLoadParams(getLoadParams({ ...filter, [queryVars.page]: 1 }));
	};

	const handleReset = (): void => {
		setFilter({
			[queryVars.side]: undefined,
			[queryVars.page]: 1,
			[queryVars.page_size]: PAGE_SIZE,
			[queryVars.is_active]: YesNoEnum.Yes,
			[queryVars.base_currency]: null,
			[queryVars.quote_currency]: null,
		});
	};

	const cryptoCurrencyValue =
		cryptoOptions.find((o) => o.label.code === filter.base_currency) ?? undefined;

	const fiatCurrencyValue =
		fiatOptions.find((o) => o.label.code === filter.quote_currency) ?? undefined;

	const sideValue = sideOptions.find((o) => o.value === filter.side) ?? null;

	const cryptoSelect = (
		<CurrencySelect
			isClearable
			value={cryptoCurrencyValue}
			onSelectChange={(o) => handleSelectChange(queryVars.base_currency, o)}
			options={cryptoOptions}
			className={styles.input_block}
			isLoading={isPairsLoading}
			autoFocus
		/>
	);

	const fiatSelect = (
		<CurrencySelect
			isClearable
			label="FIAT"
			value={fiatCurrencyValue}
			onSelectChange={(o) => handleSelectChange(queryVars.quote_currency, o)}
			options={fiatOptions}
			isLoading={isPairsLoading}
			className={styles.input_block}
			autoFocus
		/>
	);

	const sideSelect = (
		<Select
			value={sideValue}
			options={sideOptions}
			onChange={(o: ISelectOption) => handleSelectChange(queryVars.side, o)}
			isSearchable={false}
			labeled
			label="Type"
			placeholder="Select"
		/>
	);

	const actionGroup = (
		<div className={p2pStyles.table_action_group}>
			<Button
				variant="text"
				color="primary"
				label={formatMessage(commonMessages.reset)}
				onClick={handleReset}
			/>
			<Button
				variant="filled"
				color="primary"
				label={formatMessage(commonMessages.search)}
				onClick={handleSearch}
			/>
		</div>
	);

	return (
		<div className={p2pStyles.table_container}>
			<div
				className={cn(p2pStyles.tabs_container, p2pStyles.table_tabs_container, p2pStyles.header)}
			>
				<div className={p2pStyles.nav_bar}>
					{flowNavItems.map(({ id, label }) => (
						<div
							key={id}
							onClick={() => handleTabChange(id)}
							className={cn(p2pStyles.nav_item, p2pStyles.table_nav_item, {
								[p2pStyles.active]:
									filter.is_active === YesNoEnum.Yes
										? id === TabOptionsEnum.Online
										: id === TabOptionsEnum.History,
							})}
						>
							<span>{label}</span>
						</div>
					))}
					<div />
				</div>
				{smallTablet && (
					<DropdownWithContent
						className={p2pStyles.dropdown_container}
						label={() => (
							<div className={p2pStyles.filter}>
								<FilterIcon />
								{!mobile && <span>Filter</span>}
							</div>
						)}
					>
						{() => (
							<div className={cn(p2pStyles.filter_content, p2pStyles.table_filter)}>
								{cryptoSelect}
								{fiatSelect}
								{sideSelect}
								{actionGroup}
							</div>
						)}
					</DropdownWithContent>
				)}
			</div>
			{!smallTablet && (
				<>
					<div className={p2pStyles.table_filter_container}>
						<div className={p2pStyles.table_filter_select}>{cryptoSelect}</div>
						<div className={p2pStyles.table_filter_select}>{fiatSelect}</div>
						<div className={p2pStyles.table_filter_select}>{sideSelect}</div>
						{actionGroup}
					</div>
					<div className={p2pStyles.table_separator} />
				</>
			)}
			<Table spaceBetween header={headerOptions}>
				{isFetching ? (
					[...new Array(4)].map((_, i: number) => (
						<RowSkeleton cells={headerOptions.columns} key={i} />
					))
				) : ads && ads.results.length > 0 ? (
					ads?.results.map((o, idx) => <AdTableRow refetch={refetch} ad={o} key={idx} />)
				) : (
					<div className={noResultsStyles.no_rows_message_container}>
						<i className="ai ai-dok_empty" />
						{formatMessage(commonMessages.table_no_data)}
					</div>
				)}
			</Table>
			{ads && ads.results.length && ads.count > PAGE_SIZE ? (
				<div className={p2pStyles.pagination_container}>
					<NewPagination
						count={Math.ceil(ads.count / PAGE_SIZE)}
						page={filter.page}
						onChange={handlePageChange}
					/>
				</div>
			) : null}
		</div>
	);
};

export default AdsTable;

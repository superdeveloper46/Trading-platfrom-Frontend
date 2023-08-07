import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import classnames from "classnames";

import useWindowSize from "hooks/useWindowSize";
import { IBalance, IProfileStatus, IRate } from "models/Account";
import styles from "styles/components/Profile/Dashboard/DashboardBalance.module.scss";
import commonMessages from "messages/common";
import accountMessages from "messages/account";
import financeMessages from "messages/finance";
import Button from "components/UI/Button";
import Tab from "components/UI/Tab";
import { AccountTypeEnum } from "types/account";
import { FORMAT_NUMBER_OPTIONS_BTC, FORMAT_NUMBER_OPTIONS_USDT } from "constants/format";
import { Cell, Pie, PieChart, Sector } from "recharts";
import { IChartItem } from "types/dashboard";
import useMarginLevel from "hooks/useMarginLevel";
import { CHART_COLORS, CHART_COLORS_CURRENCIES } from "constants/dahboard";
import styleProps from "utils/styleProps";
import { ITicker } from "models/Ticker";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { routes } from "constants/routing";
import { DashboardCard, DashboardCardHeader } from "./DashboardCard";

interface IProps {
	profileStatus?: IProfileStatus;
	balances: IBalance[];
	balancesIsolated: IBalance[];
	balancesCross: IBalance[];
	tickers: ITicker[];
	rates: IRate[];
	isLoading: boolean;
	isMarginActive?: boolean;
}

const DashboardBalance: React.FC<IProps> = ({
	profileStatus,
	balances,
	balancesIsolated,
	balancesCross,
	tickers,
	rates,
	isLoading,
	isMarginActive,
}) => {
	const { formatMessage, formatNumber } = useIntl();
	const { mobile } = useWindowSize();
	const [activeIndex, setActiveIndex] = useState<number>(-1);
	const [currentTab, setCurrentTab] = useState<AccountTypeEnum>(AccountTypeEnum.SPOT);
	const [currentBalances, setCurrentBalances] = useState<IBalance[]>([]);
	const [sortedBalances, setSortedBalances] = useState<IBalance[]>([]);
	const [mainBalances, setMainBalances] = useState<IBalance[]>([]);
	const [chartData, setChartData] = useState<IChartItem[]>([]);
	const [otherBalancesTotalUSDT, setOtherBalancesTotalUSDT] = useState<number>(0);

	const updateBalances = () => {
		switch (currentTab) {
			case AccountTypeEnum.ISOLATED:
				setCurrentBalances([...balancesIsolated]);
				break;
			case AccountTypeEnum.CROSS:
				setCurrentBalances([...balancesCross]);
				break;
			case AccountTypeEnum.SPOT:
				setCurrentBalances([...balances]);
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		updateBalances();
	}, []);

	useEffect(() => {
		updateBalances();
	}, [currentTab]);

	useEffect(() => {
		setSortedBalances([
			...currentBalances.sort(
				(a: IBalance, b: IBalance) =>
					+b.balance * (b.valuation?.USDT ?? 0) - +a.balance * (a.valuation?.USDT ?? 0),
			),
		]);
	}, [currentBalances]);

	useEffect(() => {
		setMainBalances([...sortedBalances.slice(0, 4)]);
		setOtherBalancesTotalUSDT(
			sortedBalances
				.slice(4)
				.reduce((result: number, b: IBalance) => result + +b.balance * (b.valuation?.USDT ?? 0), 0),
		);
		setOtherBalancesTotalUSDT(
			sortedBalances
				.slice(4)
				.reduce((result: number, b: IBalance) => result + +b.balance * (b.valuation?.USDT ?? 0), 0),
		);
	}, [sortedBalances]);

	useEffect(() => {
		setChartData(
			mainBalances.length
				? [
						...mainBalances.map(
							(b: IBalance, idx: number): IChartItem => ({
								balance: +b.balance,
								value: (b.valuation?.USDT ?? 0) * +b.balance,
								name: b.code,
								color: CHART_COLORS_CURRENCIES[b.code.toLowerCase()] || CHART_COLORS[idx],
							}),
						),
						{
							balance: 0,
							value: otherBalancesTotalUSDT,
							name: formatMessage(accountMessages.others),
							color: "#C4C4C4",
						},
				  ]
				: [],
		);
	}, [mainBalances]);

	const onChangeTab = (name: string) => {
		setCurrentTab(name as AccountTypeEnum);
	};

	const resetActiveIndex = () => setActiveIndex(-1);

	const onChartEnter = (_: unknown, index: number) => setActiveIndex(index);

	const onChangeActiveIndex = (e: React.MouseEvent<HTMLDivElement>): void => {
		const { idx } = e.currentTarget.dataset;
		if (!idx) return;
		setActiveIndex(+idx);
	};

	const balanceBTCValuation = (totalBTC: number, b: IBalance): number =>
		totalBTC + (b.valuation?.BTC ?? 0) * +b.balance;

	const balanceUSDTValuation = (totalUSDT: number, b: IBalance): number =>
		totalUSDT + (b.valuation?.USDT ?? 0) * +b.balance;

	const totalSpotBTC = balances.reduce(balanceBTCValuation, 0);

	const totalSpotUSDT = balances.reduce(balanceUSDTValuation, 0);

	const { totalBTC: totalCrossBTC, totalUSDT: totalCrossUSDT } = useMarginLevel(
		"",
		balancesCross,
		balancesIsolated,
		AccountTypeEnum.CROSS,
	);

	const { totalBTC: totalIsolatedBTC, totalUSDT: totalIsolatedUSDT } = useMarginLevel(
		"",
		balancesCross,
		balancesIsolated,
		AccountTypeEnum.ISOLATED,
	);

	const totalBTC =
		currentTab === AccountTypeEnum.ISOLATED
			? totalIsolatedBTC
			: currentTab === AccountTypeEnum.CROSS
			? totalCrossBTC
			: totalSpotBTC;

	const totalUSDT =
		currentTab === AccountTypeEnum.ISOLATED
			? totalIsolatedUSDT
			: currentTab === AccountTypeEnum.CROSS
			? totalCrossUSDT
			: totalSpotUSDT;

	useEffect(() => {
		if (
			(balances.length || balancesCross.length || balancesIsolated.length) &&
			rates.length &&
			tickers.length
		) {
			updateBalances();
		}
	}, [balances.length, balancesCross.length, balancesIsolated.length, tickers, rates.length]);

	return (
		<DashboardCard>
			<DashboardCardHeader noBorder link={routes.profile.wallets}>
				<div className={styles.card_title}>{formatMessage(accountMessages.balance_details)}</div>
				{mobile && (
					<span>
						<i className="ai ai-chevron_right" />
					</span>
				)}
				<div className={styles.header_links}>
					{profileStatus?.is_withdraw_enabled && (
						<span>
							<Button
								className={styles.button}
								color="primary"
								variant="text"
								iconCode="mini_up_right"
								iconAlign="left"
								label={formatMessage(commonMessages.withdraw)}
								mini
							/>
						</span>
					)}
					{profileStatus?.is_deposit_enabled && (
						<span>
							<Button
								className={styles.button}
								color="primary"
								variant="filled"
								iconCode="mini_down_right"
								iconAlign="left"
								label={formatMessage(commonMessages.deposit)}
								mini
							/>
						</span>
					)}
				</div>
				{!mobile && (
					<span>
						<i className="ai ai-chevron_right" />
					</span>
				)}
			</DashboardCardHeader>

			{isLoading ? (
				<LoadingSpinner verticalMargin="30px" />
			) : (
				<>
					<div className={styles.tabs}>
						<Tab
							name={AccountTypeEnum.SPOT}
							isActive={currentTab === AccountTypeEnum.SPOT}
							onClick={onChangeTab}
						>
							{formatMessage(accountMessages.spot)}
						</Tab>
						{isMarginActive && (
							<>
								<Tab
									name={AccountTypeEnum.CROSS}
									isActive={currentTab === AccountTypeEnum.CROSS}
									onClick={onChangeTab}
								>
									{formatMessage(financeMessages.cross_margin)}
								</Tab>
								<Tab
									name={AccountTypeEnum.ISOLATED}
									isActive={currentTab === AccountTypeEnum.ISOLATED}
									onClick={onChangeTab}
								>
									{formatMessage(financeMessages.isolated_margin)}
								</Tab>
							</>
						)}
					</div>
					<div className={styles.content}>
						<div className={styles.balance_conversions}>
							<div className={styles.balance_conversion}>
								<div className={styles.balance_conversion}>
									<span className={styles.balance_conversion_label}>
										{formatMessage(financeMessages.balance)}:
									</span>
									<div className={styles.balance_conversion_value}>
										{isLoading ? (
											<LoadingSpinner />
										) : (
											<>
												<i className="ai ai-btc" />
												<span>{formatNumber(totalBTC, FORMAT_NUMBER_OPTIONS_BTC)}</span>
												<span>BTC</span>
											</>
										)}
									</div>
								</div>
								<div className={styles.balance_conversion}>
									<span className={styles.balance_conversion_label}>
										{formatMessage(accountMessages.assessed_value)}:
									</span>
									<div className={styles.balance_conversion_value}>
										{isLoading ? (
											<LoadingSpinner />
										) : (
											<>
												≈
												<i className="ai ai-usd" />
												<span>{formatNumber(totalUSDT, FORMAT_NUMBER_OPTIONS_USDT)}</span>
											</>
										)}
									</div>
								</div>
							</div>
						</div>
						{currentTab === AccountTypeEnum.SPOT && (
							<div className={classnames(styles.chart_container, "aa-fade-in")}>
								<PieChart width={150} height={150} onMouseLeave={resetActiveIndex}>
									<Pie
										data={chartData}
										activeShape={renderActiveShape}
										activeIndex={activeIndex}
										dataKey="value"
										nameKey="name"
										paddingAngle={4}
										cx="50%"
										cy="50%"
										innerRadius={40}
										outerRadius={65}
										onMouseEnter={onChartEnter}
									>
										{chartData.map((item: IChartItem, idx: number) => (
											<Cell key={`cell-${idx}`} fill={item.color} stroke={item.color} />
										))}
									</Pie>
								</PieChart>
								<div className={styles.chart_ccy_list} onMouseLeave={resetActiveIndex}>
									{chartData.map((item: IChartItem, idx: number) => (
										<div
											onMouseEnter={onChangeActiveIndex}
											className={styles.chart_ccy_list_item}
											key={idx}
											data-idx={idx}
										>
											<div
												onMouseLeave={resetActiveIndex}
												className={classnames(styles.chart_ccy_list_item_label, {
													[styles.active]: idx === activeIndex,
												})}
												style={styleProps({
													"--ui-balances-ccy-label": item.color ?? "var(--table-table-filter)",
												})}
											>
												<span />
												{item.name}
											</div>
											<div className={styles.chart_ccy_list_item_value}>
												{item.name === "BTC"
													? formatNumber(item.balance, FORMAT_NUMBER_OPTIONS_BTC)
													: formatNumber(item.balance, FORMAT_NUMBER_OPTIONS_USDT)}
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</>
			)}
		</DashboardCard>
	);
};

export default DashboardBalance;

const renderActiveShape = ({
	cx,
	cy,
	innerRadius,
	outerRadius,
	startAngle,
	endAngle,
	fill,
}: any) => (
	<g>
		<Sector
			cx={cx}
			cy={cy}
			innerRadius={innerRadius - 4}
			outerRadius={outerRadius + 4}
			startAngle={startAngle}
			endAngle={endAngle}
			fill={fill}
			cursor="pointer"
		/>
	</g>
);

/* eslint-disable guard-for-in */
import React, { useEffect, useRef, useState } from "react";
import styles from "styles/components/Chart.module.scss";
import { useMst } from "models/Root";
import useLocalStorage from "hooks/useLocalStorage";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import messages from "messages/common";
import { observer } from "mobx-react-lite";
import historyMessages from "messages/history";
import { IHistoryOrder } from "models/History";
import ExchangeService from "services/ExchangeService";
import {
	widget as Widget,
	ChartingLibraryWidgetOptions,
	LanguageCode,
	TimeFrameItem,
	ResolutionString,
	IChartingLibraryWidget,
	CompareSymbol,
	EntityId,
	IBasicDataFeed,
	SearchSymbolResultItem,
	LibrarySymbolInfo,
	SubscribeBarsCallback,
} from "charting_library";
import { ACCOUNT_TYPE } from "constants/exchange";
import useAccountType from "hooks/useAccountType";
import { ChartEventEnum, ChartThemesEnum } from "types/exchange";
import { formatNumberNoRounding } from "utils/format";
import { OrderSideEnum, OrderTypeEnum } from "types/orders";
import { ThemeEnum } from "types/theme";
import { useIntl } from "react-intl";
import {
	TERMINAL_CHART_INTERVAL_CACHE_KEY,
	TERMINAL_CHART_UC_CACHE_KEY,
	TV_DEFAULT_STUDIES_CACHE_KEY,
} from "utils/cacheKeys";
import config from "helpers/config";
import { IRecentTrade, trades } from "models/Terminal";
import cache from "helpers/cache";
import LoadingSpinner from "components/UI/LoadingSpinner";
import QuickOrderPanel from "components/QuickOrder/QuickOrderPanel";
import colors from "./colors";
import {
	availableLocales,
	disabledFeatures,
	enabledFeatures,
	getLoadingScreen,
	getOverrides,
	getStudiesOverrides,
} from "./options";

const historyDepth: Record<
	string | number,
	{
		timeFrame: string | number;
	}
> = {
	"1D": { timeFrame: "30D" }, // 1 day
	"240": { timeFrame: "5D" }, // 4 hours
	"60": { timeFrame: "3D" }, // 1 hour
	"30": { timeFrame: "2D" }, // 30 min
	"15": { timeFrame: "1D" }, // 15 min
	"5": { timeFrame: 360 }, // 5 min
};

const timeFrames: TimeFrameItem[] = [
	{ text: "3y", resolution: "W" as ResolutionString, description: "3 Years" },
	{ text: "8m", resolution: "D" as ResolutionString, description: "8 Month" },
	{ text: "3d", resolution: "5" as ResolutionString, description: "3 Days" },
	{ text: "5y", resolution: "W" as ResolutionString, title: "All" },
];

const containerId = "tv_chart_container";
const libraryPath = "/s/tv/static/";

const MAX_ERRORS_COUNT = 10;

const updateDefaultStudiesCache = (id: string | null) => {
	if (id) {
		const cacheStudiesIds = cache.getItem(TV_DEFAULT_STUDIES_CACHE_KEY, "[]");
		cacheStudiesIds.push(id);
		cache.setItem(TV_DEFAULT_STUDIES_CACHE_KEY, cacheStudiesIds);
	}
};

interface ISubscriber {
	symbol: string;
	resolution: ResolutionString;
	callback: SubscribeBarsCallback;
	resetCache: () => void;
}

const Chart: React.FC = () => {
	const {
		global: { theme, locale },
		terminal: {
			pair,
			displayChartOrders,
			setChartSubscribeSymbol,
			toggleDisplayChartOrders,
			isQuickOrderPlacementOpen,
		},
		history: { openedOrders },
		tickers: { chartCompareSymbols, list },
	} = useMst();
	const [cachedInterval, setCachedInterval] = useLocalStorage(
		TERMINAL_CHART_INTERVAL_CACHE_KEY,
		"15",
	);
	const [cachedUC, setCachedUC] = useLocalStorage(TERMINAL_CHART_UC_CACHE_KEY, "");
	const terminalType = useAccountType();
	const { formatMessage } = useIntl();
	const subscribers = useRef<Record<string, ISubscriber>>({});
	const recentBars = useRef<Record<string, any>>({});
	const showOrdersBtn = useRef<any>(null);
	const displayOrders = useRef<any[]>([]);
	const errorsCount = useRef<number>(0);
	const tvWidget = useRef<IChartingLibraryWidget | null>(null);
	const [hasError, setHasError] = useState<boolean>(false);
	const [quickOrderPanelDragging, setQuickOrderPanelDragging] = useState<boolean>(false);
	const [isChartReady, setIsChartReady] = useState<boolean>(false);
	const [isThemeReady, setIsThemeReady] = useState<boolean>(false);

	const buildOptions = (
		datafeed: IBasicDataFeed,
		interval: ResolutionString,
	): ChartingLibraryWidgetOptions => ({
		symbol: pair?.label ?? "",
		datafeed: datafeed,
		interval: interval,
		container: containerId,
		library_path: libraryPath,
		custom_css_url: `${libraryPath}custom-styles.css?v6`,
		locale: (availableLocales.includes(locale as LanguageCode) ? locale : "en") as LanguageCode,
		fullscreen: false,
		autosize: true,
		toolbar_bg: colors[theme].card,
		loading_screen: getLoadingScreen(theme),
		timeframe: historyDepth[interval].timeFrame.toString(),
		width: 100,
		theme: theme === ThemeEnum.Light ? ChartThemesEnum.LIGHT : ChartThemesEnum.DARK,
		height: 400, // todo parameter
		timezone: "exchange",
		load_last_chart: true,
		drawings_access: { type: "black", tools: [{ name: "Regression Trend" }] },
		disabled_features: disabledFeatures,
		enabled_features: enabledFeatures,
		time_frames: timeFrames,
		time_scale: {
			min_bar_spacing: 2,
		},
		overrides: getOverrides(theme),
		studies_overrides: getStudiesOverrides(theme),
	});

	const getSymbolInfo = (symbol: string): LibrarySymbolInfo | null => {
		const ticker = list.find(
			(t) => t.symbol.replace("/", "_").toLowerCase() === symbol.replace("/", "_").toLowerCase(),
		);
		if (ticker) {
			return {
				name: ticker.label,
				ticker: ticker.symbol,
				description: "",
				pricescale: 10 ** (ticker.price_precision ?? 0),
				minmov: 1,
				timezone: "Etc/UTC",
				session: "24x7",
				has_intraday: true,
				volume_precision: ticker.amount_precision ?? 0,
				exchange: config.department ?? "",
				has_empty_bars: true,
				full_name: ticker.label,
				type: "exchange",
				listed_exchange: config.department ?? "",
				format: "price",
				supported_resolutions: ["5", "15", "30", "60", "240", "1D"] as ResolutionString[],
			};
		}

		return null;
	};

	const addSubscriber = (
		symbolInfo: LibrarySymbolInfo,
		subscriberUID: string,
		resolution: ResolutionString,
		onRealtimeCallback: SubscribeBarsCallback,
		onResetCacheNeededCallback: () => void,
	) => {
		if (!subscribers.current[subscriberUID]) {
			subscribers.current[subscriberUID] = {
				symbol: symbolInfo.ticker ?? "",
				resolution: resolution,
				callback: onRealtimeCallback,
				resetCache: onResetCacheNeededCallback,
			};
		}
	};

	const hideOrdersFromChart = () => {
		displayOrders.current.forEach((order) => {
			const delFunc = order.remove.bind(order);
			delFunc();
		});
		displayOrders.current = [];
	};

	const delSubscriber = (subscriberUID: any) => {
		delete subscribers.current[subscriberUID];
	};

	const buildDataFeed = (): IBasicDataFeed => ({
		onReady: function (callback: any) {
			setTimeout(() => {
				callback({
					supports_search: false,
					supports_group_request: false,
					supports_marks: false,
					supported_resolutions: ["5", "15", "30", "60", "240", "1D"],
				});
			}, 0);
		},
		resolveSymbol: function (
			symbolName: string,
			onSymbolResolvedCallback: any,
			onResolveErrorCallback: any,
		) {
			setTimeout(() => {
				const symbol = getSymbolInfo(symbolName.replace("/", "_"));
				if (symbol) {
					onSymbolResolvedCallback(symbol);
				} else {
					onResolveErrorCallback();
				}
			}, 0);
		},
		getBars: function (
			symbolInfo: any,
			resolution: any,
			periodParams: any,
			onHistoryCallback: any,
			onErrorCallback: any,
		) {
			const { from, to, firstDataRequest } = periodParams;
			const params: any = { since: from };
			if (!firstDataRequest) params.until = to;
			if (symbolInfo && errorsCount.current <= MAX_ERRORS_COUNT) {
				ExchangeService.getChartData(symbolInfo.ticker, resolution, params)
					.then((bars) => {
						if (firstDataRequest && bars.length) {
							recentBars.current[`${symbolInfo.ticker}_${resolution}`] = bars[0];
						}
						setCachedInterval(resolution);
						if (bars.length) {
							bars.reverse().forEach((bar: any) => {
								bar.time *= 1000;
							});
							onHistoryCallback(bars);
						} else {
							onHistoryCallback(bars, { noData: true });
						}
					})
					.catch(() => {
						errorsCount.current += 1;
						if (errorsCount.current > MAX_ERRORS_COUNT) {
							setHasError(true);
						}
						if (typeof onErrorCallback === "function") {
							onErrorCallback();
						}
					});
			}
		},
		subscribeBars: function (
			symbolInfo: LibrarySymbolInfo,
			resolution: ResolutionString,
			onRealtimeCallback: SubscribeBarsCallback,
			subscriberUID: string,
			onResetCacheNeededCallback: () => void,
		) {
			setChartSubscribeSymbol(symbolInfo.ticker ?? "");
			addSubscriber(
				symbolInfo,
				subscriberUID,
				resolution,
				onRealtimeCallback,
				onResetCacheNeededCallback,
			);
		},
		unsubscribeBars: function (subscriberUID: any) {
			delSubscriber(subscriberUID);
		},
		searchSymbols: function (
			userInput: string,
			exchange: string,
			symbolType: string,
			onResultReadyCallback: any,
		) {
			const results = chartCompareSymbols.filter((s) =>
				s.symbol.toLowerCase().includes(userInput.toLowerCase()),
			);
			onResultReadyCallback(results);
		},
	});

	const saveChart = () => {
		if (tvWidget.current) {
			tvWidget.current.save((data: any) => {
				delete data.charts[0].chartProperties;
				setCachedUC(data);
			});
		}
	};

	const handleCancelClick = (id: number) => {
		ExchangeService.cancelOrder(id).then(() => {
			toast(
				<>
					<i className="ai ai-check_outline" />
					{formatMessage(historyMessages.order_was_cancelled)}
				</>,
			);
		});
	};

	const createOrderLine = (
		price: number,
		type: OrderTypeEnum,
		amountUnfilled: number,
		stopPrice: number,
		stopOperator: number,
		color: string,
		id: number,
	) => {
		if (!pair || !tvWidget.current) {
			return null;
		}
		const nextPrice = +formatNumberNoRounding(price, pair.price_precision);
		const nextAmountUnfilled = +formatNumberNoRounding(amountUnfilled, pair.amount_precision);

		return tvWidget.current
			.chart()
			.createPositionLine({})
			.setLineLength(100)
			.onClose("onCancel called", () => {
				handleCancelClick(id);
			})
			.setText(
				type === OrderTypeEnum.STOP_LIMIT
					? `Stop Limit: ${nextAmountUnfilled} ${pair.base_currency_code ?? ""}. Trigger ${
							stopOperator === 1 ? ">=" : "<="
					  } ${stopPrice}`
					: `Limit: ${nextAmountUnfilled} ${pair.base_currency_code ?? ""}`,
			)
			.setQuantity(nextPrice.toString())
			.setPrice(nextPrice)
			.setBodyBorderColor(color)
			.setLineColor(color)
			.setBodyTextColor(colors[theme].primary)
			.setBodyBackgroundColor(colors[theme].background)
			.setBodyFont("normal 10px Verdana")
			.setQuantityBackgroundColor(color)
			.setQuantityBorderColor(color)
			.setCloseButtonBorderColor(color)
			.setCloseButtonBackgroundColor(color)
			.setCloseButtonIconColor("#fff");
	};

	const displayOrdersOnChart = (openedOrders: IHistoryOrder[]) => {
		displayOrders.current.forEach((order) => {
			const delFunc = order.remove.bind(order);
			delFunc();
		});
		displayOrders.current = [];

		openedOrders.forEach((order: IHistoryOrder) => {
			const orderLine = createOrderLine(
				order.price ?? 0,
				order.type as OrderTypeEnum,
				order.amount_unfilled ?? 0,
				order.stop_price ?? 0,
				order.stop_operator ?? 0,
				order.side === OrderSideEnum.SELL
					? colors[theme].orderbookRedPrimary
					: colors[theme].orderbookGreenPrimary,
				order.id,
			);
			if (orderLine) {
				displayOrders.current.push(orderLine);
			}
		});
	};

	const updateChart = (type: string, data: Record<string, any> = {}) => {
		if (isChartReady && tvWidget.current) {
			switch (type) {
				case ChartEventEnum.SYMBOL: {
					tvWidget.current.chart().setResolution(cachedInterval, () => null);
					tvWidget.current.chart().setSymbol(data.symbol, () => null);
					saveChart();
					break;
				}
				case ChartEventEnum.CHANGE_THENE: {
					setIsThemeReady(false);
					tvWidget.current
						.changeTheme(
							data.theme === ThemeEnum.Light ? ChartThemesEnum.LIGHT : ChartThemesEnum.DARK,
						)
						.then(() => {
							tvWidget.current?.applyOverrides(getOverrides(data.theme));
							tvWidget.current?.applyStudiesOverrides(getStudiesOverrides(data.theme));
							setTimeout(() => {
								setIsThemeReady(true);
							}, 200);
						});
					break;
				}
				case ChartEventEnum.ADD_DEFAULT_STUDIES: {
					const cacheStudiesIds = cache.getItem(TV_DEFAULT_STUDIES_CACHE_KEY, "[]");
					if (Array.isArray(cacheStudiesIds)) {
						cacheStudiesIds.forEach((id: EntityId) => {
							tvWidget.current?.activeChart().removeEntity(id);
						});
					}
					cache.setItem(TV_DEFAULT_STUDIES_CACHE_KEY, []);

					if (tvWidget.current) {
						tvWidget.current
							.activeChart()
							.createStudy(
								"Moving Average",
								false,
								false,
								{ length: 10 },
								{ showLabelsOnPriceScale: false, "plot.color": "#798cf2" },
							)
							.then((id) => {
								updateDefaultStudiesCache(id);
							});

						tvWidget.current
							.activeChart()
							.createStudy(
								"Moving Average",
								false,
								false,
								{ length: 30 },
								{ showLabelsOnPriceScale: false, "plot.color": "#d582d4" },
							)
							.then((id) => {
								updateDefaultStudiesCache(id);
							});

						tvWidget.current
							.activeChart()
							.createStudy(
								"Moving Average",
								false,
								false,
								{ length: 60 },
								{ showLabelsOnPriceScale: false, "plot.color": "#ded373" },
							)
							.then((id) => {
								updateDefaultStudiesCache(id);
							});
					}

					break;
				}
				case ChartEventEnum.ADD_TRADE: {
					updateBars(data.trade);
					break;
				}
				case ChartEventEnum.HIDE_ORDERS: {
					hideOrdersFromChart();
					break;
				}
				case ChartEventEnum.DISPLAY_ORDERS: {
					displayOrdersOnChart(data.orders);
					break;
				}
				default:
					break;
			}
		}
	};

	useEffect(() => {
		if (!tvWidget.current && chartCompareSymbols.length && pair?.symbol) {
			const options = buildOptions(buildDataFeed(), cachedInterval);
			tvWidget.current = new Widget(options);
			tvWidget.current.onChartReady(() => {
				setIsChartReady(true);
				tvWidget.current?.headerReady().then(() => {
					if (tvWidget.current) {
						const button = tvWidget.current.createButton();
						if (button) {
							button.setAttribute(
								"title",
								displayChartOrders
									? formatMessage(messages.not_display_chart_orders)
									: formatMessage(messages.display_chart_orders),
							);
							// @ts-ignore
							button.addEventListener("click", toggleDisplayChartOrders);
							button.textContent = displayChartOrders
								? formatMessage(messages.not_display_chart_orders)
								: formatMessage(messages.display_chart_orders);
						}
						showOrdersBtn.current = button;
						tvWidget.current.load(cachedUC);
					}
				});
			});
		}
	}, [pair?.symbol, chartCompareSymbols]);

	useEffect(() => {
		if (isChartReady) {
			updateChart(ChartEventEnum.ADD_DEFAULT_STUDIES);
			updateChart(ChartEventEnum.CHANGE_THENE, { theme });
		}
	}, [theme, isChartReady]);

	useEffect(() => {
		if (displayChartOrders && pair?.symbol) {
			const nextActiveOrders =
				openedOrders.filter(
					(order) =>
						order.symbol === pair.symbol &&
						(terminalType ? order.wallet_type === (ACCOUNT_TYPE[terminalType] ?? 1) : true),
				) ?? [];
			updateChart(ChartEventEnum.DISPLAY_ORDERS, { orders: nextActiveOrders });
		} else {
			updateChart(ChartEventEnum.HIDE_ORDERS);
		}
	}, [displayChartOrders, pair?.symbol, openedOrders.length, terminalType]);

	useEffect(() => {
		if (isChartReady && pair?.symbol) {
			setTimeout(() => {
				const nextActiveOrders =
					openedOrders.filter(
						(order) =>
							order.symbol === pair.symbol &&
							(terminalType ? order.wallet_type === (ACCOUNT_TYPE[terminalType] ?? 1) : true),
					) ?? [];
				updateChart(ChartEventEnum.DISPLAY_ORDERS, { orders: nextActiveOrders });
			}, 500); // delay for fully chart initialization
		}
	}, [isChartReady, pair?.symbol, openedOrders.length, terminalType]);

	useEffect(() => {
		if (showOrdersBtn.current) {
			showOrdersBtn.current.setAttribute(
				"title",
				displayChartOrders
					? formatMessage(messages.not_display_chart_orders)
					: formatMessage(messages.display_chart_orders),
			);
			showOrdersBtn.current.textContent = displayChartOrders
				? formatMessage(messages.not_display_chart_orders)
				: formatMessage(messages.display_chart_orders);
		}
	}, [showOrdersBtn.current, displayChartOrders]);

	useEffect(() => {
		if (isChartReady && pair) {
			for (const subscriber of Object.values(subscribers.current)) {
				subscriber.resetCache();
			}
			setTimeout(() => {
				updateChart(ChartEventEnum.SYMBOL, { symbol: pair.id });
			});
		}
	}, [isChartReady, pair?.id]);

	useEffect(() => {
		if (isChartReady && trades.recentTrade) {
			updateChart(ChartEventEnum.ADD_TRADE, {
				trade: trades.recentTrade,
			});
		}
	}, [isChartReady, trades.recentTrade]);

	useEffect(() => {
		window.onbeforeunload = () => saveChart();
	}, []);

	const updateBars = (trade: IRecentTrade) => {
		if (!trade) {
			return;
		}

		for (const i in subscribers.current) {
			const subscriber = subscribers.current[i];
			if (trade.symbol === subscriber.symbol) {
				const open = trade.price;
				const barKey = `${subscriber.symbol}_${subscriber.resolution}`;
				const barData = {
					resolution: subscriber.resolution,
					bar: recentBars.current[barKey],
					time: trade.date,
					open: open,
					close: trade.price,
					high: open,
					low: open,
					volume: trade.amount,
				};

				const price = trade.price;
				barData.volume += trade.amount;

				if (price > barData.high) barData.high = price;
				else if (price < barData.low) barData.low = price;

				const recentBar = createBar(barData);
				subscriber.callback(recentBar);
				recentBars.current[barKey] = recentBar;
			}
		}
	};

	const createBar = (data: any) => {
		const utc = dayjs(data.time * 1000).utc();
		let timestamp = parseInt(utc.format("X"), 10);

		if (data.resolution === "1D" || data.resolution === "D") {
			timestamp -=
				parseInt(utc.format("H"), 10) * 3600 +
				parseInt(utc.format("m"), 10) * 60 +
				parseInt(utc.format("s"), 10);
		} else {
			timestamp -=
				(parseInt(utc.format("m"), 10) % parseInt(data.resolution, 10)) * 60 +
				parseInt(utc.format("s"), 10);
		}

		timestamp *= 1000;
		// if no last bar or timestams not equals, then build new bar
		const isNew = !data.bar || parseInt(data.bar.time, 10) !== timestamp;

		return {
			time: timestamp,
			open: isNew ? data.open : data.bar.open,
			close: data.close,
			high: isNew ? data.high : Math.max(data.bar.high, data.high),
			low: isNew ? data.low : Math.min(data.bar.low, data.low),
			volume: isNew ? data.volume : data.volume + data.bar.volume,
		};
	};

	const onStartDrag = () => {
		setQuickOrderPanelDragging(true);
	};

	const onStopDrag = () => {
		setQuickOrderPanelDragging(false);
	};

	return (
		<div className={styles.container}>
			{!isThemeReady && (
				<div className={styles.loader}>
					<LoadingSpinner />
				</div>
			)}
			{/* show spinner while pair is loading */}
			{pair ? (
				<div
					id={containerId}
					className="chart-container"
					style={{ pointerEvents: quickOrderPanelDragging ? "none" : "auto" }}
				/>
			) : null}
			{pair && isQuickOrderPlacementOpen ? (
				<QuickOrderPanel onStartDrag={onStartDrag} onStopDrag={onStopDrag} />
			) : null}
			{hasError && (
				<div className={styles.chart_error}>
					<i className="ai ai-warning" />
					<span>
						It looks like something went wrong, please, reload the page or contact our support team.
					</span>
				</div>
			)}
		</div>
	);
};

export default observer(Chart);

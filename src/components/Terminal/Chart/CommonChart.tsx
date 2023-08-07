/* eslint-disable guard-for-in */
import React, { useEffect, useRef, useState } from "react";
import styles from "styles/components/Chart.module.scss";
import terminalStyles from "styles/pages/Terminal.module.scss";
import { useMst } from "models/Root";
import useLocalStorage from "hooks/useLocalStorage";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import ExchangeService from "services/ExchangeService";
import {
	widget as Widget,
	IChartingLibraryWidget,
	ChartingLibraryWidgetOptions,
	LanguageCode,
	TimeFrameItem,
	ResolutionString,
} from "charting_library";
import { ChartEventEnum, ChartThemesEnum } from "types/exchange";
import { ThemeEnum } from "types/theme";
import { TERMINAL_CHART_INTERVAL_CACHE_KEY, TERMINAL_CHART_UC_CACHE_KEY } from "utils/cacheKeys";
import { ITicker } from "models/Ticker";
import LoadingSpinner from "components/UI/LoadingSpinner";
import config from "helpers/config";
import { IRecentTrade } from "models/Terminal";
import colors from "./colors";
import { disabledFeatures, enabledFeatures, getOverrides, getStudiesOverrides } from "./options";

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

const libraryPath = "/s/tv/static/";

const MAX_ERRORS_COUNT = 10;

export interface ITrade extends IRecentTrade {
	symbol: string;
}

interface IProps {
	ticker: ITicker;
	trades: ITrade[];
}

const CommonChart: React.FC<IProps> = ({ ticker, trades }) => {
	const {
		global: { theme, locale },
	} = useMst();
	const [cachedInterval] = useLocalStorage(TERMINAL_CHART_INTERVAL_CACHE_KEY, "15");
	const [cachedUC, setCachedUC] = useLocalStorage(TERMINAL_CHART_UC_CACHE_KEY, "");
	const tvWidget = useRef<IChartingLibraryWidget | null>(null);
	const subscribers = useRef<Record<string, any>>({});
	const recentBars = useRef<Record<string, any>>({});
	const errorsCount = useRef<number>(0);
	const [hasError, setHasError] = useState<boolean>(false);
	const containerId = `tv_chart_container_${ticker.symbol}`;
	const [isChartReady, setIsChartReady] = useState<boolean>(false);

	const recentTrade = trades.length > 0 ? trades[0] : null;

	const buildOptions = (datafeed: any): ChartingLibraryWidgetOptions => ({
		symbol: ticker.symbol ?? "",
		datafeed: datafeed,
		interval: cachedInterval,
		container: containerId,
		library_path: libraryPath,
		custom_css_url: `${libraryPath}custom-styles.css?v6`,
		locale: (locale || "en") as LanguageCode,
		fullscreen: false,
		autosize: true,
		toolbar_bg: colors[theme].card,
		loading_screen: {
			backgroundColor: colors[theme].card,
			foregroundColor: colors[theme].card,
		},
		timeframe: historyDepth[cachedInterval].timeFrame.toString(),
		width: 100,
		theme: theme === ThemeEnum.Light ? ChartThemesEnum.LIGHT : ChartThemesEnum.DARK,
		height: 400, // todo parameter
		timezone: "exchange",
		load_last_chart: true,
		drawings_access: { type: "black", tools: [{ name: "Regression Trend" }] },
		disabled_features: [...disabledFeatures, "header_compare"],
		enabled_features: enabledFeatures,
		time_frames: timeFrames,
		time_scale: {
			min_bar_spacing: 2,
		},
		overrides: getOverrides(theme),
		studies_overrides: getStudiesOverrides(theme),
	});

	const transformCurrentSymbol = () => ({
		name: ticker.label,
		ticker: ticker.symbol,
		description: false,
		pricescale: 10 ** (ticker.price_precision ?? 0),
		minmov: 1,
		timezone: "UTC",
		session: "24x7",
		has_intraday: true,
		has_fractional_volume: true,
		volume_precision: ticker.amount_precision ?? 0,
		exchange: config.department,
		has_empty_bars: true,
	});

	const addSubscriber = (
		subscriberUID: any,
		resolution: any,
		onRealtimeCallback: any,
		onResetCacheNeededCallback: any,
	) => {
		if (!subscribers.current[subscriberUID])
			subscribers.current[subscriberUID] = {
				resolution: resolution,
				callback: onRealtimeCallback,
				resetCache: onResetCacheNeededCallback,
			};
	};

	const delSubscriber = (subscriberUID: any) => {
		delete subscribers.current[subscriberUID];
	};

	const buildDataFeed = () => ({
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
				if (symbolName) {
					onSymbolResolvedCallback(transformCurrentSymbol());
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
							recentBars.current[resolution] = bars[0];
						}
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
			symbolInfo: any,
			resolution: any,
			onRealtimeCallback: any,
			subscriberUID: any,
			onResetCacheNeededCallback: any,
		) {
			addSubscriber(subscriberUID, resolution, onRealtimeCallback, onResetCacheNeededCallback);
		},
		unsubscribeBars: function (subscriberUID: any) {
			delSubscriber(subscriberUID);
		},
		calculateHistoryDepth: function (resolution: any) {
			return historyDepth[resolution];
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

	const updateChart = (type: string, data: Record<string, any> = {}) => {
		if (isChartReady && tvWidget.current) {
			if (tvWidget.current) {
				switch (type) {
					case ChartEventEnum.SYMBOL: {
						tvWidget.current?.chart().setResolution(cachedInterval, () => null);
						tvWidget.current?.chart().setSymbol(data.symbol, () => null);
						saveChart();
						break;
					}
					case ChartEventEnum.CHANGE_THENE: {
						tvWidget.current
							.changeTheme(
								data.theme === ThemeEnum.Light ? ChartThemesEnum.LIGHT : ChartThemesEnum.DARK,
							)
							.then(() => {
								tvWidget.current?.applyOverrides(getOverrides(data.theme));
								tvWidget.current?.applyStudiesOverrides(getStudiesOverrides(data.theme));
							});
						break;
					}
					case ChartEventEnum.ADD_TRADE: {
						updateBars(data.trade);
						break;
					}
					default:
						break;
				}
			}
		}
	};

	useEffect(() => {
		window.onbeforeunload = () => saveChart();
	}, []);

	useEffect(() => {
		if (!tvWidget.current && ticker) {
			tvWidget.current = new Widget(buildOptions(buildDataFeed()));
			tvWidget.current.onChartReady(() => {
				tvWidget.current?.headerReady().then(() => {
					setIsChartReady(true);
					tvWidget.current?.load(cachedUC);
				});
			});
		}
	}, [ticker.symbol]);

	useEffect(() => {
		if (isChartReady) {
			updateChart(ChartEventEnum.ADD_DEFAULT_STUDIES);
			updateChart(ChartEventEnum.CHANGE_THENE, { theme });
		}
	}, [theme, isChartReady]);

	useEffect(() => {
		if (isChartReady && ticker) {
			updateChart(ChartEventEnum.SYMBOL, { symbol: ticker.symbol });
		}
	}, [isChartReady && ticker?.symbol]);

	useEffect(() => {
		updateChart(ChartEventEnum.ADD_TRADE, {
			trade: recentTrade,
		});
	}, [tvWidget.current, recentTrade]);

	const updateBars = (trade: IRecentTrade) => {
		if (!trade) {
			return;
		}

		for (const i in subscribers.current) {
			const subscriber = subscribers.current[i];
			const open = trade.price;
			const barData = {
				resolution: subscriber.resolution,
				bar: recentBars.current[subscriber.resolution],
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
			recentBars.current[subscriber.resolution] = recentBar;
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

	return (
		<div className={styles.container}>
			{tvWidget.current ? null : (
				<div className={terminalStyles.widget_loader}>
					<LoadingSpinner />
				</div>
			)}
			{ticker.symbol ? <div id={containerId} className="chart-container" /> : null}
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

export default observer(CommonChart);

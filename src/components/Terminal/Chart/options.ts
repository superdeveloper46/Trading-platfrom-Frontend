import { LanguageCode } from "charting_library/charting_library";
import colors from "./colors";

export const getOverrides = (theme: string) => ({
	"paneProperties.background": colors[theme].card,
	"paneProperties.backgroundType": "solid",
	"paneProperties.backgroundGradientStartColor": colors[theme].card,
	"paneProperties.backgroundGradientEndColor": colors[theme].card,
	"mainSeriesProperties.lineStyle.color": colors[theme].blue,
	"mainSeriesProperties.candleStyle.upColor": colors[theme].green,
	"mainSeriesProperties.candleStyle.downColor": colors[theme].red,
	"mainSeriesProperties.candleStyle.borderUpColor": colors[theme].green,
	"mainSeriesProperties.candleStyle.borderDownColor": colors[theme].red,
	"mainSeriesProperties.candleStyle.wickUpColor": colors[theme].green,
	"mainSeriesProperties.candleStyle.wickDownColor": colors[theme].red,
	"mainSeriesProperties.hollowCandleStyle.upColor": colors[theme].green,
	"mainSeriesProperties.hollowCandleStyle.downColor": colors[theme].red,
	"paneProperties.vertGridProperties.color": colors[theme].grid,
	"paneProperties.horzGridProperties.color": colors[theme].grid,
	"mainSeriesProperties.hollowCandleStyle.borderUpColor": colors[theme].green,
	"mainSeriesProperties.hollowCandleStyle.borderDownColor": colors[theme].red,
	"mainSeriesProperties.haStyle.upColor": colors[theme].green,
	"mainSeriesProperties.haStyle.downColor": colors[theme].red,
	"mainSeriesProperties.haStyle.borderUpColor": colors[theme].green,
	"mainSeriesProperties.haStyle.borderDownColor": colors[theme].red,
});

export const getStudiesOverrides = (theme: string) => ({
	"volume.volume.color.0": colors[theme].volumeRed,
	"volume.volume.color.1": colors[theme].volumeGreen,
});

export const enabledFeatures = [
	"use_localstorage_for_settings",
	"save_chart_properties_to_local_storage",
	"hide_last_na_study_output",
	"dont_show_boolean_study_arguments",
	"keep_left_toolbar_visible_on_small_screens",
];

export const disabledFeatures = [
	"header_symbol_search",
	"header_interval_dialog_button",
	"symbol_info",
	"volume_force_overlay",
	"edit_buttons_in_legend",
];

export const getLoadingScreen = (theme: string) => ({
	backgroundColor: colors[theme].card,
	foregroundColor: colors[theme].card,
});

export const availableLocales: LanguageCode[] = ["en", "zh", "ru", "fr", "de", "pt", "es", "tr"];

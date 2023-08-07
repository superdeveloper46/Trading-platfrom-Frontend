import React, { useState, useEffect } from "react";
import commonMessages from "messages/common";
import { useIntl } from "react-intl";
import Switch from "components/UI/Switch";
import styles from "styles/pages/TerminalMobile.module.scss";
import cn from "classnames";
import PairSelect from "./PairSelect";

interface Props {
	show: boolean;
	changeFilterState: (...args: any) => void;
	back: () => void;
	typeState: string;
	cancelledState: boolean;
	timeState: string;
	pairSymbol: string;
	pairLabel: string;
}

const HistoryOrdersFilterOverlay: React.FC<Props> = ({
	show,
	changeFilterState,
	back,
	typeState,
	cancelledState,
	timeState,
	pairSymbol,
	pairLabel,
}) => {
	const [allIsActive, setAllIsActive] = useState<boolean>(true);
	const [sellIsActive, setSellIsActive] = useState<boolean>(false);
	const [buyIsActive, setBuyIsActive] = useState<boolean>(false);
	const [dayIsActive, setDayIsActive] = useState<boolean>(true);
	const [daysIsActive, setDaysIsActive] = useState<boolean>(false);
	const [monthIsActive, setMonthIsActive] = useState<boolean>(false);
	const [monthsIsActive, setMonthsIsActive] = useState<boolean>(false);
	const [hideCanceled, setHideCanceled] = useState<boolean>(false);
	const [typeFilterState, setTypeFilterState] = useState<string>("all");
	const [timeFilterState, setTimeFilterState] = useState<string>("months");
	const [pairSymbolState, setPairSymbolState] = useState<string>(pairSymbol);
	const [pairLabelState, setPairLabelState] = useState<string>(pairLabel);

	const { formatMessage } = useIntl();

	useEffect(() => {
		recountTypeFilterValues();
	}, [typeFilterState]);

	useEffect(() => {
		recountTimeFilterValues();
	}, [timeFilterState]);

	useEffect(() => {
		setTypeFilterState(typeState);
		setHideCanceled(cancelledState);
		setTimeFilterState(timeState);
	}, []);

	const recountTypeFilterValues = (): void => {
		switch (typeFilterState) {
			case "day":
				setAllIsActive(true);
				setSellIsActive(false);
				setBuyIsActive(false);
				break;
			case "sell":
				setAllIsActive(false);
				setSellIsActive(true);
				setBuyIsActive(false);
				break;
			case "buy":
				setAllIsActive(false);
				setSellIsActive(false);
				setBuyIsActive(true);
				break;
			default:
				setAllIsActive(true);
				setSellIsActive(false);
				setBuyIsActive(false);
		}
	};

	const recountTimeFilterValues = (): void => {
		switch (timeFilterState) {
			case "day":
				setDayIsActive(true);
				setDaysIsActive(false);
				setMonthIsActive(false);
				setMonthsIsActive(false);
				break;
			case "days":
				setDayIsActive(false);
				setDaysIsActive(true);
				setMonthIsActive(false);
				setMonthsIsActive(false);
				break;
			case "month":
				setDayIsActive(false);
				setDaysIsActive(false);
				setMonthIsActive(true);
				setMonthsIsActive(false);
				break;
			case "months":
				setDayIsActive(false);
				setDaysIsActive(false);
				setMonthIsActive(false);
				setMonthsIsActive(true);
				break;
			default:
				setDayIsActive(true);
				setDaysIsActive(false);
				setMonthIsActive(false);
				setMonthsIsActive(false);
		}
	};

	const handleBack = (): void => {
		back();
	};

	const handleApply = (): void => {
		changeFilterState(
			timeFilterState,
			typeFilterState,
			hideCanceled,
			pairSymbolState,
			pairLabelState,
		);
		back();
	};

	const handleReset = (): void => {
		setDayIsActive(false);
		setDaysIsActive(false);
		setMonthIsActive(false);
		setMonthsIsActive(true);

		setAllIsActive(true);
		setSellIsActive(false);
		setBuyIsActive(false);

		setHideCanceled(false);

		setTimeFilterState("months");
		setTypeFilterState("all");

		setPairSymbolState(pairSymbol);
		setPairLabelState(pairLabel);
	};

	const preventAction = (event: React.MouseEvent): void => {
		event.stopPropagation();
	};

	const changeTypeFilter = (nextFilterState: string) => {
		setTypeFilterState(nextFilterState);
	};

	const changeTimeFilter = (nextFilterState: string) => {
		setTimeFilterState(nextFilterState);
	};

	const handleIncludeCancelled = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setHideCanceled(e.target.checked);
	};

	const passSymbolAndNameBack = (nextSymbol: string, nextLabel: string): void => {
		setPairSymbolState(nextSymbol);
		setPairLabelState(nextLabel);
	};

	return (
		<div
			className={cn(styles.active_filters_overlay_fader, show && styles.show)}
			onClick={handleBack}
		>
			<div
				className={styles.active_filters_overlay_values_wrapper}
				onClick={(event: React.MouseEvent) => preventAction(event)}
			>
				<div className={styles.filter_overlay_title}>
					{formatMessage(commonMessages.active_orders_apply_filter)}
				</div>
				<div className={styles.history_filters_content_wrapper}>
					<div className={styles.history_filter_time_row}>
						<div
							className={cn(styles.history_filter_small_button, dayIsActive && styles.active)}
							onClick={() => changeTimeFilter("day")}
						>
							<span>{`1 ${formatMessage(commonMessages.day)}`}</span>
						</div>
						<div
							className={cn(styles.history_filter_small_button, daysIsActive && styles.active)}
							onClick={() => changeTimeFilter("days")}
						>
							<span>{`7 ${formatMessage(commonMessages.days)}`}</span>
						</div>
						<div
							className={cn(styles.history_filter_small_button, monthIsActive && styles.active)}
							onClick={() => changeTimeFilter("month")}
						>
							<span>{`1 ${formatMessage(commonMessages.month)}`}</span>
						</div>
						<div
							className={cn(styles.history_filter_small_button, monthsIsActive && styles.active)}
							onClick={() => changeTimeFilter("months")}
						>
							<span>{`7 ${formatMessage(commonMessages.months)}`}</span>
						</div>
					</div>
					<span className={styles.history_filter_title}>{formatMessage(commonMessages.pair)}</span>
					<div className={styles.history_filter_pair_row}>
						<PairSelect
							passSymbolAndNameBack={(nextSymbol: string, nextLabel: string) =>
								passSymbolAndNameBack(nextSymbol, nextLabel)
							}
							pairSymbol={pairSymbolState}
							pairLabel={pairLabelState}
						/>
					</div>
					<span className={styles.history_filter_title}>{formatMessage(commonMessages.type)}</span>
					<div className={styles.history_filter_type_row}>
						<div
							className={cn(styles.history_filter_small_button, allIsActive && styles.active)}
							onClick={() => changeTypeFilter("all")}
						>
							<span>{formatMessage(commonMessages.active_orders_all)}</span>
						</div>
						<div
							className={cn(styles.history_filter_small_button, buyIsActive && styles.active)}
							onClick={() => changeTypeFilter("buy")}
						>
							<span>{formatMessage(commonMessages.active_orders_buy)}</span>
						</div>
						<div
							className={cn(styles.history_filter_small_button, sellIsActive && styles.active)}
							onClick={() => changeTypeFilter("sell")}
						>
							<span>{formatMessage(commonMessages.active_orders_sell)}</span>
						</div>
					</div>
					<div className={styles.history_filter_canceled_row}>
						<Switch id="canceled-orders" checked={hideCanceled} onChange={handleIncludeCancelled} />
						<span className={styles.history_filter_cancelled_text}>
							{formatMessage(commonMessages.hide_canceled)}
						</span>
					</div>
				</div>
				<button className={styles.history_filter_apply_button} type="button" onClick={handleApply}>
					{formatMessage(commonMessages.ok)}
				</button>
				<button className={styles.history_filter_reset_button} type="button" onClick={handleReset}>
					{formatMessage(commonMessages.reset)}
				</button>
			</div>
			<button
				className={styles.active_filters_overlay_back_button}
				type="button"
				onClick={handleBack}
			>
				<span className={styles.active_filters_abort_button_text}>
					{formatMessage(commonMessages.back_btn)}
				</span>
			</button>
		</div>
	);
};

export default HistoryOrdersFilterOverlay;

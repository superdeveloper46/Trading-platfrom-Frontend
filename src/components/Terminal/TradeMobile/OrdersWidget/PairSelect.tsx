import React, { useState, useEffect } from "react";
import cn from "classnames";
import styles from "styles/pages/TerminalMobile.module.scss";
import { useMst } from "models/Root";
import { observer } from "mobx-react-lite";
import SelectPairWindow from "./SelectPairWindow";

interface Props {
	passSymbolAndNameBack: (symbol: string, label: string) => void;
	pairSymbol: string;
	pairLabel: string;
}

const PairSelect: React.FC<Props> = ({ passSymbolAndNameBack, pairSymbol, pairLabel }) => {
	const [pairSelectSymbol, setPairSelectSymbol] = useState<string>("");
	const [pairSelectLabel, setPairSelectLabel] = useState<string>("");
	const [showPairWindow, setShowPairWindow] = useState<boolean>(false);
	const { tickers } = useMst();

	useEffect(() => {
		setPairSelectSymbol(pairSymbol);
		setPairSelectLabel(pairLabel);
	}, [pairSymbol]);

	useEffect(() => {
		setPairSelectSymbol(pairSymbol);
		setPairSelectLabel(pairLabel);
	}, []);

	const showFilter = (): void => {
		setShowPairWindow(true);
	};

	const hideFilter = (): void => {
		setShowPairWindow(false);
	};

	const handleSelect = (): void => {
		showFilter();
	};

	const selectPair = (symbol: string, label: string): void => {
		setPairSelectSymbol(symbol);
		setPairSelectLabel(label);
		passSymbolAndNameBack(symbol, label);
	};

	return (
		<div className={styles.history_pair_select_wrapper}>
			<button
				type="button"
				className={styles.history_filter_pair_select}
				value={pairSelectSymbol}
				onClick={handleSelect}
			>
				{pairSelectLabel}
			</button>
			<i className={cn(styles.history_filter_select_arrow_icon, "ai ai-chevron_right")} />
			{showPairWindow ? (
				<SelectPairWindow
					show={showPairWindow}
					back={hideFilter}
					pairs={tickers.list}
					currentPair={pairSelectLabel}
					select={(symbol: string, label: string) => selectPair(symbol, label)}
				/>
			) : null}
		</div>
	);
};

export default observer(PairSelect);

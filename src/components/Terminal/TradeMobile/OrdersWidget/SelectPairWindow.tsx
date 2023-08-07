import React, { useState } from "react";
import { useIntl } from "react-intl";
import commonMessages from "messages/common";
import cn from "classnames";
import styles from "styles/pages/TerminalMobile.module.scss";
import { ITicker } from "models/Ticker";

interface Props {
	show: boolean;
	back: () => void;
	pairs: ITicker[];
	currentPair: string;
	select: (symbol: string, name: string) => void;
}

const SelectPairWindow: React.FC<Props> = ({ show, back, pairs, currentPair, select }) => {
	const [searchInputValue, setSearchInputValue] = useState<string>("");
	const { formatMessage } = useIntl();

	const handleBack = (): void => {
		back();
	};

	const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setSearchInputValue(e.target.value);
	};

	const searchFilter = (pair: ITicker): boolean =>
		pair.label.includes(searchInputValue.toUpperCase());

	const handleSelect = (symbol: string, name: string): void => {
		select(symbol, name);
		handleBack();
	};

	return (
		<div className={cn(styles.show_pair_window_wrapper, show && styles.show)}>
			<div className={styles.all_modal_service_row}>
				<button className={styles.all_modal_close_button} type="button" onClick={handleBack}>
					<i className={cn(styles.all_modal_back_icon, "ai ai-chevron_left")} />
				</button>
				<span className={styles.all_modal_title}>{formatMessage(commonMessages.all_pairs)}</span>
				<div className={styles.all_modal_void} />
			</div>
			<div className={styles.all_pairs_search_row}>
				<input
					className={styles.all_pairs_search_field}
					placeholder={formatMessage(commonMessages.search)}
					type="text"
					value={searchInputValue}
					onChange={handleInputValueChange}
				/>
				<i className={cn(styles.all_pairs_search_icon, "ai ai-search")} />
			</div>
			<div className={styles.all_pairs_items_title_row}>
				<span className={styles.all_pairs_title}>{formatMessage(commonMessages.choose_pair)}</span>
			</div>
			<div className={styles.all_pairs_item_column}>
				{pairs.filter(searchFilter).map((pair: ITicker) => (
					<div
						className={styles.all_pairs_item_row}
						key={pair.label}
						onClick={() => handleSelect(pair.symbol, pair.label)}
					>
						<span className={styles.all_pairs_item_text}>{pair.label}</span>
						{currentPair === pair.label ? (
							<i className={cn(styles.all_pairs_check_icon, "ai ai-check")} />
						) : null}
					</div>
				))}
			</div>
		</div>
	);
};

export default SelectPairWindow;

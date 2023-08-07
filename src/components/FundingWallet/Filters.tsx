import React from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import { useMst } from "models/Root";
import messages from "messages/common";
import styles from "styles/pages/Wallets.module.scss";
import SearchInput, { SearchAppender } from "components/UI/SearchInput";
import useWindowSize from "hooks/useWindowSize";

const Filters: React.FC = () => {
	const {
		finance: { walletsFilter },
	} = useMst();
	const { formatMessage } = useIntl();
	const { tablet } = useWindowSize();

	const handleChangeFilterSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		walletsFilter.setSearch(e.target.value);
	};

	const handleClearSearch = () => {
		walletsFilter.setSearch("");
	};

	const handleChangeFavorites = () => {
		walletsFilter.setFavorites(!walletsFilter.favorites);
	};

	return (
		<div className={styles.filter}>
			<div className={styles.filter_search}>
				<SearchInput
					name="search"
					onChange={handleChangeFilterSearch}
					value={walletsFilter.search}
					noMargin
					appender={
						walletsFilter.search ? (
							<SearchAppender onClick={handleClearSearch}>
								<i className="ai ai-close" />
							</SearchAppender>
						) : null
					}
				/>
			</div>
			<div
				className={cn(styles.filter_favorites, walletsFilter.favorites && styles.active)}
				onClick={handleChangeFavorites}
			>
				<i className={`ai ai-star_${walletsFilter.favorites ? "filled" : "outlined"}`} />
				{!tablet && <span>{formatMessage(messages.favorites)}</span>}
			</div>
			{/* {!tablet && ( */}
			{/*	<div className={styles.filter_checkbox}> */}
			{/*		<CheckBox */}
			{/*			name="show_all" */}
			{/*			checked={walletsFilter.notEmpty} */}
			{/*			onChange={handleChangeNotEmpty} */}
			{/*		> */}
			{/*			{formatMessage(financeMessages.hide_empty_balances)} */}
			{/*		</CheckBox> */}
			{/*	</div> */}
			{/* )} */}
		</div>
	);
};

export default observer(Filters);

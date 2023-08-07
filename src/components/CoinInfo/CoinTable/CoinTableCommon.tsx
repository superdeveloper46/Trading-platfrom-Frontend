import React, { useMemo } from "react";
import cn from "classnames";
import { useIntl } from "react-intl";

import coinInfoStyles from "styles/components/CoinInfo.module.scss";
import styles from "styles/components/CoinInfo/CoinInfoTableRow.module.scss";
import SearchInput from "components/UI/SearchInput";
import { TableData } from "components/UI/Table";
import messages from "messages/coin_info";
import { useMst } from "models/Root";
import commonMessages from "messages/common";
import Button from "components/UI/Button";
import { formatCryptoCurrencyPrice, formatPercent } from "utils/format";

interface ICoinTableFilterProps {
	searchValue: string;
	isFavourite: boolean;
	onFavourite(): void;
	searchCoin(search: string): void;
	handleSearch(): void;
	handleReset(): void;
}

export const CoinTableFilter: React.FC<ICoinTableFilterProps> = ({
	searchValue,
	isFavourite,
	onFavourite,
	searchCoin,
	handleSearch,
	handleReset,
}) => {
	const { formatMessage } = useIntl();
	const {
		global: { isAuthenticated },
	} = useMst();

	const onChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
		searchCoin?.(value);
	};

	return (
		<div className={coinInfoStyles.filter_container}>
			{isAuthenticated && (
				<div
					className={cn(coinInfoStyles.favourite, {
						[coinInfoStyles.active]: isFavourite,
						[coinInfoStyles.favourite]: isFavourite,
					})}
					onClick={onFavourite}
				>
					<i className={`ai ai-star_${isFavourite ? "filled" : "outlined"}`} />
					<span>{formatMessage(messages.favourites)}</span>
				</div>
			)}
			<div className={coinInfoStyles.search}>
				<SearchInput value={searchValue} onChange={onChange} onEnter={handleSearch} />
			</div>
			<div className={coinInfoStyles.buttons_container}>
				<Button
					variant="text"
					color="primary"
					label={formatMessage(commonMessages.reset)}
					mini
					onClick={handleReset}
				/>
				<Button
					variant="filled"
					color="primary"
					label={formatMessage(commonMessages.search)}
					mini
					onClick={handleSearch}
				/>
			</div>
		</div>
	);
};

export interface ICurrencyCellProps {
	logo: string;
	name: string;
	symbol: string;
	isFavourite?: boolean;
	isVoted?: boolean;
	hideFavourite?: boolean;
	isListed?: boolean;
	hideListing?: boolean;
	minWidth?: string;
	onFavourite: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	onVote?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	isAuthenticated?: boolean;
	isFavouriteLoading?: boolean;
	isVoteLoading?: boolean;
}

export const CurrencyCell: React.FC<ICurrencyCellProps> = ({
	logo,
	name,
	symbol,
	hideFavourite,
	isListed,
	isFavourite,
	isVoted,
	hideListing,
	minWidth,
	onFavourite,
	onVote,
	isAuthenticated = false,
	isVoteLoading = false,
	isFavouriteLoading = false,
}) => (
	<TableData minWidth={minWidth}>
		<CoinTableCurrencyTitle
			isAuthenticated={isAuthenticated}
			isFavouriteLoading={isFavouriteLoading}
			isVoteLoading={isVoteLoading}
			isVoted={isVoted}
			isFavourite={isFavourite}
			onFavourite={onFavourite}
			onVote={onVote}
			logo={logo}
			name={name}
			symbol={symbol}
			size="30"
			hideFavourite={hideFavourite}
			isListed={isListed}
			hideListing={hideListing}
		/>
	</TableData>
);

interface ICoinTableCurrencyTitleProps {
	logo: string;
	name: string;
	symbol: string;
	size: string;
	isFavourite?: boolean;
	isVoted?: boolean;
	hideFavourite?: boolean;
	isListed?: boolean;
	hideListing?: boolean;
	isHighlight?: boolean;
	onFavourite?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	onVote?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	isAuthenticated?: boolean;
	isFavouriteLoading?: boolean;
	isVoteLoading?: boolean;
}

export const CoinTableCurrencyTitle: React.FC<ICoinTableCurrencyTitleProps> = ({
	logo,
	name,
	symbol,
	size,
	hideFavourite,
	isListed,
	hideListing,
	isHighlight,
	isFavourite,
	isVoted,
	onFavourite,
	onVote,
	isAuthenticated = false,
	isVoteLoading = false,
	isFavouriteLoading = false,
}) => {
	const { formatMessage } = useIntl();

	const handleOnFavourite = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (onFavourite) {
			onFavourite(e);
		}
	};

	const handleOnVote = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (onVote) {
			onVote(e);
		}
	};

	const actionButton = useMemo(() => {
		if (hideListing) {
			return null;
		}

		if (isListed) {
			return (
				<div role="button" className={cn(styles.status, styles.buy)}>
					<span>{formatMessage(messages.buy)}</span>
				</div>
			);
		}

		if (!isVoted && isAuthenticated) {
			return (
				// eslint-disable-next-line jsx-a11y/interactive-supports-focus
				<div
					role="button"
					onClick={handleOnVote}
					className={cn(styles.status, styles.listing, { [styles.disabled]: isVoteLoading })}
				>
					<span>{formatMessage(messages.request_listing)}</span>
				</div>
			);
		}

		return null;
	}, [hideListing, isListed, onVote, isVoted, isAuthenticated]);

	return (
		<div className={cn(styles.currency, { [styles.highlight]: isHighlight })}>
			{!hideFavourite && (
				<FavouriteIcon
					onFavourite={handleOnFavourite}
					className={cn(styles.favourite_icon, { [styles.disabled]: isFavouriteLoading })}
					isFavourite={isFavourite}
				/>
			)}
			<img className={styles.logo} src={logo} alt={name} width={size} height={size} />
			<span title={name} className={styles.name}>
				{name}
			</span>
			<span title={symbol} className={styles.symbol}>
				{symbol}
			</span>
			{actionButton}
		</div>
	);
};

interface IFavouriteIconProps {
	isFavourite?: boolean;
	className?: string;
	onFavourite: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const FavouriteIcon: React.FC<IFavouriteIconProps> = ({
	isFavourite,
	className,
	onFavourite,
}) => (
	// eslint-disable-next-line jsx-a11y/interactive-supports-focus
	<div
		role="button"
		onClick={onFavourite}
		className={cn(className, {
			[styles.active]: isFavourite,
			[styles.favorite]: isFavourite,
		})}
	>
		<i className={`ai ai-star_${isFavourite ? "filled" : "outlined"}`} />
	</div>
);

interface IPriceCellProps {
	price?: number;
	align?: "right" | "center";
	maxWidth?: string;
	minWidth?: string;
}

export const PriceCell: React.FC<IPriceCellProps> = ({ price, align, maxWidth, minWidth }) => (
	<TableData maxWidth={maxWidth} minWidth={minWidth} align={align}>
		<PriceValue price={price} />
	</TableData>
);

interface IPriceValueProps {
	price?: number;
}

export const PriceValue: React.FC<IPriceValueProps> = ({ price }) => (
	<span className={styles.price}>{formatCryptoCurrencyPrice(price)}</span>
);

interface IPercentCellProps {
	percent?: number;
	align?: "right" | "center";
	minWidth?: string;
}

export const PercentCell: React.FC<IPercentCellProps> = ({ percent, align, minWidth }) => (
	<TableData minWidth={minWidth} align={align}>
		<PercentValue percent={percent} />
	</TableData>
);

interface IPercentValueProps {
	percent?: number;
}

export const PercentValue: React.FC<IPercentValueProps> = ({ percent }) => {
	const icon = useMemo(() => {
		switch (true) {
			case formatPercent(percent) === "0.00 %":
				return null;
			case percent && percent > 0:
				return <i className="ai ai-hint_up" />;
			case percent && percent < 0:
				return <i className="ai ai-hint_down" />;
			default:
				return null;
		}
	}, [percent]);

	return (
		<span
			className={cn(styles.price_change, {
				[styles.positive]: percent && percent > 0,
				[styles.negative]: percent && percent < 0,
				[styles.neutral]: formatPercent(percent) === "0.00 %",
			})}
		>
			{icon}
			{formatPercent(percent)}
		</span>
	);
};

import React from "react";
import { useIntl } from "react-intl";
import cn from "classnames";

import styles from "styles/components/CoinInfo.module.scss";
import messages from "messages/coin_info";
import InternalLink from "components/InternalLink";
import FireImage from "assets/images/coin_info/fire.png";
import { IMarketCapCoin } from "types/coinmarketcap";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { useGainers, useLosers, usePromotedCoins } from "services/CoinMarketCapService";
import { HIGHLIGHTS_COINS_COUNT } from "constants/coin_info";
import { queryVars } from "constants/query";
import { routes } from "constants/routing";
import { CoinTableCurrencyTitle, PercentValue } from "./CoinTable/CoinTableCommon";

interface IRowsData {
	name: string;
	code: string;
	value: number;
	image_url: string;
	image_svg?: string;
	image_png?: string;
}

interface IHighlightInfo {
	isLoading?: boolean;
	highlightInfo: {
		title: string;
		to?: string;
		rowsData: IRowsData[];
	};
	losers?: boolean;
}

interface IProps {
	coins?: IMarketCapCoin[];
	isLoading: boolean;
}

const HighlightsPromoted: React.FC<IProps> = ({ coins, isLoading }) => {
	const { formatMessage } = useIntl();
	return (
		<HighlightCard
			isLoading={isLoading}
			highlightInfo={{
				title: formatMessage(messages.coin_info_promoted_coins),
				rowsData: coins
					? coins.map(
							(coin): IRowsData => ({
								name: coin.name,
								code: coin.symbol,
								value: coin.quote?.USD?.percent_change_24h ?? 0,
								image_url: coin.currency.logo,
							}),
					  )
					: [],
			}}
		/>
	);
};

const HighlightsLeaders: React.FC<IProps> = ({ coins, isLoading }) => {
	const { formatMessage } = useIntl();
	return (
		<HighlightCard
			isLoading={isLoading}
			highlightInfo={{
				title: formatMessage(messages.leaders),
				to: "/coin/leaders/",
				rowsData: coins
					? coins.map(
							(coin): IRowsData => ({
								name: coin.name,
								code: coin.symbol,
								value: coin.quote?.USD?.percent_change_24h ?? 0,
								image_url: coin.currency.logo,
							}),
					  )
					: [],
			}}
		/>
	);
};

const HighlightsLosers: React.FC<IProps> = ({ coins, isLoading }) => {
	const { formatMessage } = useIntl();
	return (
		<HighlightCard
			losers
			isLoading={isLoading}
			highlightInfo={{
				title: formatMessage(messages.losers),
				to: "/coin/leaders/",
				rowsData: coins
					? coins.map(
							(coin): IRowsData => ({
								name: coin.name,
								code: coin.symbol,
								value: coin?.quote?.USD?.percent_change_24h ?? 0,
								image_url: coin.currency.logo,
							}),
					  )
					: [],
			}}
		/>
	);
};

const HighlightCard: React.FC<IHighlightInfo> = ({
	highlightInfo: { title, to, rowsData },
	isLoading,
	losers,
}) => {
	const { formatMessage } = useIntl();

	return (
		<div className={styles.highlight_card}>
			<div className={styles.highlight_card_header}>
				<div className={styles.highlight_card_title}>
					{!losers && <img src={FireImage} alt="" />}
					<span>{title}</span>
				</div>
				<div className={styles.highlight_card_link}>
					{to && (
						<InternalLink to={to}>
							{formatMessage(messages.highlights_link)}
							<i className="ai ai-chevron_right" />
						</InternalLink>
					)}
				</div>
			</div>
			{isLoading && <LoadingSpinner />}
			{rowsData.map((row: IRowsData, i: number) => (
				<InternalLink key={i} to={routes.coin.getCoin(row.code)} className={styles.highlight_row}>
					<div className={styles.currency_data}>
						<span />
						<CoinTableCurrencyTitle
							logo={row.image_url}
							name={row.name}
							symbol={row.code}
							size="20px"
							hideFavourite
							hideListing
							isHighlight
						/>
					</div>
					<span className={cn(styles.value, { [styles.descend]: row.value < 0 })}>
						<PercentValue percent={row.value} />
					</span>
				</InternalLink>
			))}
		</div>
	);
};

const Highlights: React.FC = () => {
	const { isFetching: isGainersLoading, data: gainers } = useGainers({
		[queryVars.page_size]: HIGHLIGHTS_COINS_COUNT,
	});
	const { isFetching: isLosersLoading, data: losers } = useLosers({
		[queryVars.page_size]: HIGHLIGHTS_COINS_COUNT,
	});
	const { isFetching: isPromotedLoading, data: promotedPairs } = usePromotedCoins({});

	return (
		<div className={styles.highlights_container}>
			<HighlightsPromoted coins={promotedPairs?.results} isLoading={isPromotedLoading} />
			<HighlightsLeaders coins={gainers?.results} isLoading={isGainersLoading} />
			<HighlightsLosers coins={losers?.results} isLoading={isLosersLoading} />
		</div>
	);
};

export default Highlights;

import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import cn from "classnames";

import styles from "styles/components/CoinDetails.module.scss";
import { ICurrency, IMarketCapCoin, IMarketCapCoinInfo } from "types/coinmarketcap";
import { FORMAT_NUMBER_OPTIONS_USD } from "constants/format";
import { ICoinDetailLink, useCoinDetails } from "hooks/useCoinDetails";
import { ITicker } from "models/Ticker";
import messages from "messages/coin_info";
import financeMessages from "messages/finance";
import { useMst } from "models/Root";
import DropDownList, { DropDownListTypeEnum } from "components/UI/DropDownList/ DropDownList";
import CoinMarketCapService from "services/CoinMarketCapService";
import errorHandler from "utils/errorHandler";
import Badge from "components/UI/Badge";
import Tooltip from "components/UI/Tooltip";
import Button from "components/UI/Button";
import { formatCryptoCurrencyPrice, formatPercent } from "utils/format";
import config from "helpers/config";
import { RenderModuleEnum } from "types/render";
import { queryVars } from "constants/query";
import { routes } from "constants/routing";

interface InfoCellProps {
	caption: string;
	value: string;
	hint: string;
}

const InfoCell: React.FC<InfoCellProps> = (props) => {
	const { caption, value, hint } = props;

	return (
		<div className={styles.additional_info_cell}>
			<div className={styles.additional_info_cell_caption}>
				<span>
					{caption}
					<div className={styles.additional_info_cell_hint}>
						<Tooltip id={value} hint text={hint} place="top" />
					</div>
				</span>
			</div>
			<span className={styles.additional_info_cell_value}>{value}</span>
		</div>
	);
};

interface IProps {
	coinInfo?: IMarketCapCoinInfo;
	marketCapCoin?: IMarketCapCoin;
	usd?: ICurrency;
	tickers?: ITicker[];
}

const Header: React.FC<IProps> = ({ tickers, usd, marketCapCoin, coinInfo }) => {
	const { formatMessage, formatNumber } = useIntl();
	const {
		global: { isAuthenticated },
	} = useMst();

	const { coinLinks } = useCoinDetails(coinInfo);

	const [isFavourite, setIsFavourite] = useState<boolean>(coinInfo?.is_favorite || false);
	const [isVoted, setIsVoted] = useState<boolean>(coinInfo?.is_voted || false);
	const [isVoteLoading, setIsVoteLoading] = useState<boolean>(false);
	const [isFavouriteLoading, setIsFavouriteLoading] = useState<boolean>(false);

	const handleOnFavouriteClick = () => {
		if (!isFavouriteLoading) {
			setIsFavouriteLoading(true);
			if (coinInfo) {
				CoinMarketCapService.setFavorite({
					[queryVars.currency_id]: coinInfo.id,
					[queryVars.is_favorite]: !isFavourite,
				})
					.then(() => {
						setIsFavourite(!isFavourite);
					})
					.catch(errorHandler)
					.finally(() => setIsFavouriteLoading(false));
			}
		}
	};

	const handleOnListingClick = () => {
		if (coinInfo && !coinInfo.is_voted && isAuthenticated && !isVoteLoading) {
			setIsVoteLoading(true);
			CoinMarketCapService.listingVote({
				currency_id: coinInfo.id,
				vote: true,
			})
				.then(() => {
					setIsVoted(true);
					toast.success(formatMessage(messages.listed_successfully));
				})
				.catch(errorHandler)
				.finally(() => {
					setIsVoteLoading(false);
				});
		}
	};

	const percentIcon = useMemo(() => {
		switch (true) {
			case formatPercent(usd?.percent_change_24h) === "0.00 %":
				return null;
			case usd?.percent_change_24h && usd?.percent_change_24h > 0:
				return <i className="ai ai-hint_up" />;
			case usd?.percent_change_24h && usd?.percent_change_24h < 0:
				return <i className="ai ai-hint_down" />;
			default:
				return null;
		}
	}, [usd?.percent_change_24h]);

	return (
		<div className={styles.header}>
			<div className={styles.info_block}>
				<div className={styles.short_coin_info_container}>
					<div className={styles.short_coin_info}>
						<img src={coinInfo?.logo} alt={marketCapCoin?.symbol} className={styles.coin_logo} />
						<span className={styles.coin_name}>{marketCapCoin?.name}</span>
						<span className={styles.coin_code}>({marketCapCoin?.symbol})</span>
						<div
							className={cn(styles.favorite_icon, {
								[styles.active]: isFavourite,
								[styles.disabled]: isFavouriteLoading,
							})}
							onClick={handleOnFavouriteClick}
						>
							<i className={`ai ai-star_${isFavourite ? "filled" : "outlined"}`} />
						</div>
					</div>
					<HeaderUsefulLinks coinLinks={coinLinks} />
				</div>
				<div className={styles.coin_characteristics}>
					<span className={styles.price_caption}>{formatMessage(messages.price_24h)}</span>
					<div className={styles.price_container}>
						<span className={styles.price}>{formatCryptoCurrencyPrice(usd?.price)}</span>
						<Badge
							className={styles.percent_badge}
							color={(usd?.percent_change_24h ?? 0) < 0 ? "red" : "green"}
							alpha
						>
							{percentIcon}
							<span className={styles.last_diff}>{formatPercent(usd?.percent_change_24h)}</span>
						</Badge>
					</div>
					<div className={styles.additional_info_container}>
						<InfoCell
							caption={formatMessage(messages.market_cap)}
							value={formatCryptoCurrencyPrice(usd?.market_cap)}
							hint={formatMessage(messages.market_cap_hint)}
						/>
						<InfoCell
							caption={formatMessage(messages.fully_diluted_market_cap)}
							value={formatCryptoCurrencyPrice(usd?.fully_diluted_market_cap)}
							hint={formatMessage(messages.fully_diluted_market_cap_hint)}
						/>
						<InfoCell
							caption={formatMessage(messages.volume_24)}
							value={formatCryptoCurrencyPrice(usd?.volume_24h)}
							hint={formatMessage(messages.volume_24_hint)}
						/>
						<InfoCell
							caption={formatMessage(messages.circulating_supply)}
							value={`${formatNumber(
								((usd?.market_cap ?? 0) / (usd?.fully_diluted_market_cap ?? 1)) * 100,
								FORMAT_NUMBER_OPTIONS_USD,
							)}%`}
							hint={formatMessage(messages.circulating_supply_hint)}
						/>
					</div>
				</div>
			</div>
			<div className={styles.buttons_section}>
				{!tickers ||
					(tickers.length === 0 && !isVoted && isAuthenticated && (
						<Button
							onClick={handleOnListingClick}
							color="secondary"
							variant="filled"
							isLoading={isVoteLoading}
							label={formatMessage(messages.request_listing)}
							className={cn(styles.custom_button, styles.primary)}
						/>
					))}
				{tickers && tickers.length > 0 && (
					<>
						{tickers.length > 1 ? (
							<DropDownList
								className={cn(styles.custom_button, styles.dropdown_trade)}
								type={DropDownListTypeEnum.Filled}
								isExternalLink
								placeholder={`${formatMessage(financeMessages.trade)} ${coinInfo?.symbol}`}
								options={tickers.map(({ symbol }) => ({
									label: symbol,
									value: routes.trade.getPair(symbol),
								}))}
							/>
						) : (
							<Button
								isInternalLink
								to={routes.trade.getPair(tickers[0].symbol)}
								color="primary"
								variant="filled"
								label={`${formatMessage(financeMessages.trade)} ${coinInfo?.symbol}`}
								className={styles.custom_button}
							/>
						)}
						<Button
							isInternalLink
							to={routes.profile.getDepositCurrency(coinInfo?.symbol.toLocaleUpperCase() || "")}
							color="primary"
							variant="filled"
							iconCode="mini_down_right"
							iconAlign="left"
							label={formatMessage(messages.deposit)}
							className={styles.custom_button}
						/>
						{config.isModuleOn(RenderModuleEnum.BUY_CRYPTO) && (
							<Button
								isInternalLink
								to={`/buy-crypto/USD_${coinInfo?.symbol.toLocaleUpperCase()}`}
								color="primary"
								variant="filled"
								label={`${formatMessage(messages.buy)} ${coinInfo?.symbol}`}
								className={styles.custom_button}
							/>
						)}
						{config.isModuleOn(RenderModuleEnum.STAKING) && coinInfo?.is_staking && (
							<Button
								isInternalLink
								to={routes.staking.root}
								color="primary"
								variant="filled"
								label={formatMessage(messages.staking)}
								className={styles.custom_button}
							/>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default Header;

interface IHeaderUsefulLinksProps {
	coinLinks: ICoinDetailLink[];
}

const HeaderUsefulLinks: React.FC<IHeaderUsefulLinksProps> = ({ coinLinks }) => (
	<div className={styles.useful_links}>
		{coinLinks.map(({ links, title, icon }) => (
			<Badge color="blue" alpha key={title} className={styles.link}>
				{Array.isArray(links) && links.length > 1 ? (
					<DropDownList
						isExternalLink
						icon={icon}
						placeholder={title}
						options={links.map((link) => ({ label: link, value: link }))}
					/>
				) : (
					<a className={styles.link} href={links[0]} target="_blank" rel="noopener noreferrer">
						<i className={`ai ai-${icon}`} />
						<span>{title}</span>
					</a>
				)}
			</Badge>
		))}
	</div>
);

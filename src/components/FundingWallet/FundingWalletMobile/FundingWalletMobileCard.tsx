import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";
import cn from "classnames";

import cache from "helpers/cache";
import { IBalance } from "models/Account";
import styles from "styles/pages/Wallets.module.scss";
import { FAVORITE_WALLETS_CACHE_KEY } from "utils/cacheKeys";
import { STARS_STR } from "constants/wallet";
import InternalLink from "components/InternalLink";
import { AccountTypeEnum } from "types/account";
import { getFavoriteWallets } from "helpers/wallets";
import { routes, URL_VARS } from "constants/routing";

const FORMAT_NUMBER_OPTIONS = {
	useGrouping: false,
	minimumFractionDigits: 6,
	maximumFractionDigits: 8,
};

interface Props {
	balance: IBalance;
	isBalancesVisible: boolean;
	type: AccountTypeEnum;
}

const FundingWalletMobileCard: React.FC<Props> = ({ balance, isBalancesVisible, type }) => {
	const [isFavorite, setIsFavorite] = useState<boolean>(false);
	const { formatNumber } = useIntl();

	const balanceBase = (
		balance.paired_balance?.is_quoted ? balance : balance.paired_balance
	) as IBalance;
	const balanceQuote = (
		balance.paired_balance?.is_quoted ? balance.paired_balance : balance
	) as IBalance;

	const formatColumnNumber = (value: number) =>
		isBalancesVisible
			? value > 0
				? formatNumber(value, FORMAT_NUMBER_OPTIONS)
				: "0.00"
			: STARS_STR;

	useEffect(() => {
		setIsFavorite(cache.getItem(FAVORITE_WALLETS_CACHE_KEY, "[]").includes(balance.code));
	}, [balance.code]);

	const handleFavoriteClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const favorites = getFavoriteWallets();
		const idx = favorites.findIndex((id: string) => id === balance.code);
		if (idx !== -1) {
			favorites.splice(idx, 1);
			setIsFavorite(false);
		} else {
			favorites.push(balance.code);
			setIsFavorite(true);
		}
		cache.setItem(FAVORITE_WALLETS_CACHE_KEY, favorites);
	};

	const renderBalanceValue = (b: IBalance) => (
		<div className={styles.mobile_card_currency_amount}>
			<div>
				{formatColumnNumber(+b.available)}
				{type === AccountTypeEnum.ISOLATED && <>&nbsp;{b.code}</>}
			</div>
			<div>{formatColumnNumber(+b.reserve)}</div>
		</div>
	);

	return (
		<InternalLink
			className={styles.mobile_card}
			to={routes.profile.getWalletsDetails(balance.code, { [URL_VARS.TYPE]: type })}
		>
			<div className={styles.mobile_card_currency_info}>
				<div
					className={cn(styles.mobile_card_favorites, isFavorite && styles.active)}
					onClick={handleFavoriteClick}
				>
					<i className={`ai ai-star_${isFavorite ? "filled" : "outlined"}`} />
				</div>
				<div className={cn(styles.currency_value, styles.mobile_card_currency_value)}>
					{balance.image_svg || balance.image_png ? (
						<img
							src={balance.image_svg || balance.image_png || ""}
							alt={balance.code}
							width="30"
							height="30"
							loading="lazy"
						/>
					) : (
						<div className={styles.currency_value_icon}>
							<i className={`ai ai-${balance.code?.toLowerCase()}`} />
						</div>
					)}
					<span>
						<b>{type === AccountTypeEnum.ISOLATED ? balance.pair : balance.code}</b>
					</span>
				</div>
			</div>
			{type === AccountTypeEnum.ISOLATED ? (
				<div className={styles.mobile_card_group_value}>
					{renderBalanceValue(balanceBase)}
					{renderBalanceValue(balanceQuote)}
				</div>
			) : (
				renderBalanceValue(balance)
			)}
		</InternalLink>
	);
};

export default observer(FundingWalletMobileCard);

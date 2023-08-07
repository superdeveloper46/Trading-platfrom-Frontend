import useTerminalLayout from "hooks/useTerminalLayout";
import useAccountType from "hooks/useAccountType";
import cn from "classnames";
import useWindowSize from "hooks/useWindowSize";
import { useMst } from "models/Root";
import exchangeMessages from "messages/exchange";
import React from "react";
import { useIntl } from "react-intl";
import styles from "styles/pages/Terminal.module.scss";
import { TerminalLayoutEnum } from "types/exchange";
import { observer } from "mobx-react-lite";
import InternalLink from "components/InternalLink";
import SkeletonLoader from "components/UI/Skeleton";
import { AccountTypeEnum } from "types/account";
import Tooltip from "components/UI/Tooltip";
import { routes } from "constants/routing";

const CoinInfo: React.FC = () => {
	const {
		terminal: {
			pair,
			isTickersAbsolute,
			isLoaded,
			setIsTickersAbsolute,
			isQuickOrderPlacementOpen,
			setIsQuickOrderPlacementOpen,
		},
		render,
	} = useMst();
	const { formatNumber, formatMessage } = useIntl();
	const terminalLayout = useTerminalLayout();
	const terminalType = useAccountType();
	const { width, desktop } = useWindowSize();

	const isCross = terminalType === AccountTypeEnum.CROSS && pair?.cross_margin_leverage;
	const isIsolated = terminalType === AccountTypeEnum.ISOLATED && pair?.isolated_margin_leverage;

	const formatPriceNumberOptions = {
		useGrouping: false,
		maximumFractionDigits: pair?.price_precision ?? 8,
		minimumFractionDigits: pair?.price_precision ?? 0,
	};

	const formatAmountNumberOptions = {
		useGrouping: false,
		maximumFractionDigits: pair?.amount_precision ?? 8,
		minimumFractionDigits: pair?.amount_precision ?? 0,
	};

	const handlePairClick = () => {
		if ((terminalLayout === TerminalLayoutEnum.ADVANCED && width <= 1820) || !desktop) {
			setIsTickersAbsolute(!isTickersAbsolute);
		}
	};

	const handleQuickOrderPlacementClick = () => {
		setIsQuickOrderPlacementOpen(!isQuickOrderPlacementOpen);
	};

	return (
		<div className={styles.coin_info_container}>
			{pair ? (
				<>
					<i className={`ai ai-${pair.base_currency_code.toLowerCase()}`} />
					<div
						className={styles.coin_info_coin_name}
						data-for="detailed-info"
						data-tip={`${pair.base_currency_name}/${pair.quote_currency_name}`}
						onClick={handlePairClick}
					>
						{pair.base_currency_code ?? "--"}&nbsp;
						<span className={styles.coin_info_quote_currency}>
							/&nbsp;{pair.quote_currency_code ?? "--"}
						</span>
						{((terminalLayout === TerminalLayoutEnum.ADVANCED && width <= 1820) || !desktop) && (
							<i className={`ai ai-arrow_${isTickersAbsolute ? "up" : "down"}`} />
						)}
						{isCross ? (
							<span className={styles.margin_leverage_sign}>{pair.cross_margin_leverage}x</span>
						) : isIsolated ? (
							<span className={styles.margin_leverage_sign}>{pair.isolated_margin_leverage}x</span>
						) : null}
					</div>
					<ul className={styles.coin_info_content}>
						<li data-for="detailed-info" data-tip={formatMessage(exchangeMessages.last_price)}>
							<div className={styles.coin_info_param_name}>
								<i className="ai ai-price_mini" />
							</div>
							<div className={styles.coin_info_param_value}>
								{formatNumber(pair.close, formatPriceNumberOptions)}
							</div>
						</li>
						<li data-for="detailed-info" data-tip="Low 24H">
							<div className={styles.coin_info_param_name}>
								<i className="ai ai-arrow_down" />
								24h:
							</div>
							<div className={cn(styles.coin_info_param_value, styles.red)}>
								{formatNumber(pair.low, formatPriceNumberOptions)}
							</div>
						</li>
						<li data-for="detailed-info" data-tip="High 24H">
							<div className={styles.coin_info_param_name}>
								<i className="ai ai-arrow_up" />
								24h:
							</div>
							<div className={cn(styles.coin_info_param_value, styles.green)}>
								{formatNumber(pair.high, formatPriceNumberOptions)}
							</div>
						</li>
						<li data-for="detailed-info" data-tip="Volume 24H">
							<div className={styles.coin_info_param_name}>
								<i className="ai ai-volume" />
							</div>
							<div className={styles.coin_info_param_value}>
								{formatNumber(pair.base_volume, formatAmountNumberOptions)}
								&nbsp;
								{pair.base_currency_code}
							</div>
						</li>
						{render.coinInfo && (
							<InternalLink to={routes.coin.getCoin(pair.base_currency_code)}>
								<li data-for="detailed-info" data-tip="Coin Info">
									<div className={styles.coin_info_param_name}>
										<i className="ai ai-info_filled" />
									</div>
									<div className={styles.coin_info_param_value}>Info</div>
								</li>
							</InternalLink>
						)}
					</ul>
					<button
						className={cn(
							styles.coin_info_quick_order_btn,
							isQuickOrderPlacementOpen && styles.active,
						)}
						onClick={handleQuickOrderPlacementClick}
						type="button"
						data-for="detailed-info"
						data-tip={formatMessage(exchangeMessages.quick_order_placement)}
					>
						<i className="ai ai-flash" />
					</button>
					<Tooltip id="detailed-info" place="bottom" arrowColor="var(--tooltip-background)" />
				</>
			) : !isLoaded ? (
				<div className={styles.coin_info_skeleton}>
					<SkeletonLoader width={50} />
					<SkeletonLoader width={50} />
					<SkeletonLoader width={50} />
					<SkeletonLoader width={50} />
					<SkeletonLoader width={50} />
					<SkeletonLoader width={50} />
				</div>
			) : null}
		</div>
	);
};

export default observer(CoinInfo);

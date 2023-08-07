import React, { useRef, useState } from "react";
import { useMst } from "models/Root";
import { observer } from "mobx-react-lite";
import cn from "classnames";
import styles from "styles/pages/Terminal.module.scss";
import commonMessages from "messages/common";
import { useIntl } from "react-intl";
import { OrderbookViewVariantEnum } from "types/exchange";
import SkeletonLoader from "components/UI/Skeleton";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { getPrecisionMap, toPrecisionSymbol } from "helpers/exchange";
import Tooltip from "components/UI/Tooltip";
import { OrderSideEnum } from "types/orders";
import { formatNumberNoRounding } from "utils/format";
import List from "./List";

interface Props {
	mobile?: boolean;
}

const BuyOrders: React.FC<Props> = ({ mobile }) => (
	<List side={OrderSideEnum.BUY} mobile={mobile} />
);

const SellOrders: React.FC<Props> = ({ mobile }) => (
	<List side={OrderSideEnum.SELL} mobile={mobile} />
);

const OrdersGroup: React.FC = observer(() => {
	const {
		global: { isWSDown },
		terminal: {
			pair,
			isLoaded,
			orderBookPrecision,
			setOrderBookPrecision,
			recentTrade,
			recentTradeDiff,
		},
	} = useMst();
	const [variant, setVariant] = useState<OrderbookViewVariantEnum>(OrderbookViewVariantEnum.GROUP);
	const { formatMessage } = useIntl();
	const [isPrecisionMenuOpen, setIsPrecisionMenuOpen] = useState<boolean>(false);
	const precisionMenuRef = useRef(null);

	const handlePrecisionMenuOpen = () => {
		setIsPrecisionMenuOpen(true);
	};

	const handlePrecisionMenuClose = (e: React.MouseEvent) => {
		setIsPrecisionMenuOpen(false);
	};

	useOnClickOutside(precisionMenuRef, handlePrecisionMenuClose);

	const handlePrecisionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		const { precision } = e.currentTarget.dataset;
		setOrderBookPrecision(+(precision ?? pair?.price_precision ?? 0));
		setIsPrecisionMenuOpen(false);
	};

	const handleVariantChange = (e: React.SyntheticEvent<HTMLDivElement, MouseEvent>): void => {
		const { name } = e.currentTarget.dataset;
		setVariant((name as OrderbookViewVariantEnum) ?? OrderbookViewVariantEnum.GROUP);
	};

	return (
		<div className={cn(styles.orderbook_container, styles[variant])}>
			<div className={styles.orderbook_header}>
				<div className={styles.widget_title}>{formatMessage(commonMessages.orderbook)}</div>
				{pair?.price_precision ? (
					<div className={styles.orderbook_precision}>
						<button
							type="button"
							className={styles.orderbook_precision_value}
							onClick={handlePrecisionMenuOpen}
						>
							{toPrecisionSymbol(orderBookPrecision)}
							<i className="ai ai-hint_down" />
						</button>
						{isPrecisionMenuOpen && (
							<div className={styles.orderbook_precision_dropdown} ref={precisionMenuRef}>
								{Array.from(getPrecisionMap(pair.price_precision, pair.close).entries()).map(
									([precision, label]) => (
										<button
											key={precision}
											type="button"
											data-precision={precision}
											onClick={handlePrecisionClick}
										>
											{label}
										</button>
									),
								)}
							</div>
						)}
					</div>
				) : null}
				<div className={styles.orderbook_view_options}>
					{[
						OrderbookViewVariantEnum.GROUP,
						OrderbookViewVariantEnum.SELL,
						OrderbookViewVariantEnum.BUY,
					].map((key: string, idx: number) => (
						<div
							key={idx}
							data-name={key}
							onClick={handleVariantChange}
							className={cn(styles.orderbook_view_option, variant === key && styles.active)}
						>
							<span />
							<span />
						</div>
					))}
				</div>
			</div>
			{variant !== OrderbookViewVariantEnum.BUY ? (
				<List side={OrderSideEnum.SELL} grouped full={variant === OrderbookViewVariantEnum.SELL} />
			) : (
				// grid space
				<div />
			)}
			{variant === OrderbookViewVariantEnum.GROUP && (
				<div className={styles.orderbook_rate_info}>
					<span
						className={cn(
							pair && recentTradeDiff !== 0 ? (recentTradeDiff > 0 ? styles.up : styles.down) : "",
						)}
					>
						{pair ? (
							<>
								{formatNumberNoRounding(recentTrade?.price ?? 0, pair.price_precision)}
								{recentTradeDiff !== 0 && (
									<i className={`ai ai-hint_${recentTradeDiff > 0 ? "up" : "down"}`} />
								)}
							</>
						) : !isLoaded ? (
							<SkeletonLoader width={60} />
						) : null}
					</span>
					<span
						className={cn(
							pair && pair.change_percent !== 0
								? pair.change_percent > 0
									? styles.up
									: styles.down
								: "",
						)}
						data-tip={
							pair ? `24h: ${formatNumberNoRounding(+(pair.change_percent ?? 0), 2)}%` : "--"
						}
						data-for="rate-info"
					>
						{pair ? (
							<>
								{pair.change_percent > 0 ? "+" : ""}
								{formatNumberNoRounding(+(pair.change_percent ?? 0), 2)}%
							</>
						) : !isLoaded ? (
							<SkeletonLoader width={40} />
						) : null}
					</span>
					<i
						className={cn("ai ai-translation", isWSDown && styles.ws_down)}
						data-tip={isWSDown ? "Connection Error" : "Stable Connection"}
						data-for="rate-info"
					/>
				</div>
			)}
			{variant !== OrderbookViewVariantEnum.SELL ? (
				<List
					side={OrderSideEnum.BUY}
					grouped
					headless
					full={variant === OrderbookViewVariantEnum.BUY}
				/>
			) : (
				// grid space
				<div />
			)}
			<Tooltip id="rate-info" place="bottom" />
		</div>
	);
});

export { BuyOrders, SellOrders, OrdersGroup };

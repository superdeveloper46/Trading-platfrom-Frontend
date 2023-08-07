import React, { useMemo } from "react";
import cn from "classnames";
import { useIntl } from "react-intl";

import styles from "styles/pages/P2P/OrderDetails.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import { IOrder, P2POrderStatusEnum } from "types/p2p";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { usePairs } from "services/P2PService";
import useWindowSize from "hooks/useWindowSize";
import messages from "messages/common";
import p2pMessages from "messages/p2p";
import Timer from "./Timer";

interface IProps {
	orderDetails?: IOrder;
}

const OrderValues: React.FC<IProps> = ({ orderDetails }) => {
	const { smallTablet } = useWindowSize();
	const { formatNumber, formatMessage } = useIntl();
	const [baseCurrencyCode, quoteCurrencyCode] = orderDetails?.pair.symbol.split("_") || [];

	const { data: pairs, isFetching: isPairsFetching } = usePairs();

	const baseCurrency = useMemo(
		() =>
			pairs?.results?.find(({ base_currency }) => base_currency.code === (baseCurrencyCode || ""))
				?.base_currency,
		[pairs?.results],
	);

	const quoteCurrency = useMemo(
		() =>
			pairs?.results?.find(
				({ quote_currency }) => quote_currency.code === (quoteCurrencyCode || ""),
			)?.quote_currency,
		[pairs?.results],
	);

	return !orderDetails || isPairsFetching ? (
		<LoadingSpinner />
	) : (
		<div className={styles.order_values}>
			<div className={styles.item}>
				<span className={p2pStyles.smallcaps_label}>{formatMessage(messages.amount)}</span>
				<span className={styles.value}>
					{formatNumber(+orderDetails.amount, { maximumFractionDigits: baseCurrency?.precision })}{" "}
					{baseCurrencyCode}
				</span>
			</div>
			<div className={styles.item}>
				<span className={p2pStyles.smallcaps_label}>{formatMessage(messages.price)}</span>
				<span className={styles.value}>
					{formatNumber(+orderDetails.price, { maximumFractionDigits: quoteCurrency?.precision })}{" "}
					{quoteCurrencyCode}
				</span>
			</div>
			<div className={styles.item}>
				<span className={p2pStyles.smallcaps_label}>{formatMessage(p2pMessages.sum_to_pay)}</span>
				<span className={cn(styles.value, styles.sum)}>
					{formatNumber(+orderDetails.amount * +orderDetails.price, {
						maximumFractionDigits: quoteCurrency?.precision,
					})}{" "}
					{quoteCurrencyCode}
				</span>
			</div>
			<span className={styles.separator} />
			{smallTablet && (
				<div className={styles.item}>
					<span className={p2pStyles.smallcaps_label}>
						{formatMessage(p2pMessages.payment_time)}
					</span>
					<Timer
						isActive={orderDetails.status === P2POrderStatusEnum.OPEN}
						active_till={orderDetails.active_till}
					/>
				</div>
			)}
		</div>
	);
};

export default OrderValues;

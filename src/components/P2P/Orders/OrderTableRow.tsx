import React, { useLayoutEffect, useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import dayjs from "dayjs";

import { TableData, TableRow } from "components/UI/NewTable";
import styles from "styles/pages/P2P/Orders.module.scss";
import Badge from "components/UI/Badge";
import { IOrder, IP2PCurrency, P2POrderStatusEnum, P2PSideEnum } from "types/p2p";
import useCopyClick from "hooks/useCopyClick";
import { P2PStatuses } from "constants/p2p";
import { getDateFromDiff, getDisplayTimeValue } from "utils/p2p";
import InternalLink from "components/InternalLink";
import { routes } from "constants/routing";
import buyCryptoMessages from "messages/buy_crypto";

interface IProps {
	orderDetails: IOrder;
	baseCurrencies: IP2PCurrency[];
	quoteCurrencies: IP2PCurrency[];
	id: number;
}

const OrderTableRow: React.FC<IProps> = ({ orderDetails, id, baseCurrencies, quoteCurrencies }) => {
	const { formatMessage, formatNumber } = useIntl();
	const copyClick = useCopyClick();

	const [baseCurrencyCode, quoteCurrencyCode] = orderDetails.pair.symbol.split("_") || [];

	const userSide: P2PSideEnum =
		orderDetails?.seller_profile.id === id ? P2PSideEnum.Sell : P2PSideEnum.Buy;

	const [dateDiff, setDateDiff] = useState(
		getDateFromDiff(dayjs(orderDetails?.active_till).diff(dayjs(Date.now()), "seconds")),
	);

	const baseCurrency = baseCurrencies.find(({ code }) => code === baseCurrencyCode);
	const quoteCurrency = quoteCurrencies.find(({ code }) => code === quoteCurrencyCode);

	const handleClickCopy = (): void => {
		if (orderDetails?.id) {
			copyClick(orderDetails.id);
		}
	};

	useLayoutEffect(() => {
		const interval = setInterval(() => {
			const diff = dayjs(orderDetails?.active_till).diff(dayjs(Date.now()), "seconds");

			if (diff > 0) {
				setDateDiff(getDateFromDiff(diff));
			} else {
				setDateDiff(getDateFromDiff(0));
				clearInterval(interval);
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [orderDetails?.active_till]);

	return (
		<TableRow common>
			<TableData width="120px" maxWidth="120px">
				<Badge alpha color={userSide === P2PSideEnum.Sell ? "red" : "green"}>
					{userSide === P2PSideEnum.Sell
						? formatMessage(buyCryptoMessages.sell)
						: formatMessage(buyCryptoMessages.buy)}
				</Badge>
			</TableData>
			<TableData width="120px" maxWidth="120px">
				{baseCurrencyCode}
			</TableData>
			<TableData width="220px" maxWidth="220px">
				{orderDetails.created_at
					? dayjs.utc(dayjs(orderDetails.created_at)).format("DD-MM-YYYY HH:mm:ss")
					: "--"}
			</TableData>
			<TableData
				title={`${formatNumber(+orderDetails.amount * +orderDetails.price, {
					maximumFractionDigits: quoteCurrency?.precision,
				})} ${quoteCurrencyCode}`}
				width="190px"
				maxWidth="190px"
				crop
			>
				{formatNumber(+orderDetails.amount * +orderDetails.price, {
					maximumFractionDigits: quoteCurrency?.precision,
				})}{" "}
				{quoteCurrencyCode}
			</TableData>
			<TableData
				title={`${formatNumber(+orderDetails.price, {
					maximumFractionDigits: quoteCurrency?.precision,
				})} ${quoteCurrencyCode}`}
				width="180px"
				maxWidth="180px"
				crop
			>
				{formatNumber(+orderDetails.price, {
					maximumFractionDigits: quoteCurrency?.precision,
				})}{" "}
				{quoteCurrencyCode}
			</TableData>
			<TableData
				title={`${formatNumber(+orderDetails.amount, {
					maximumFractionDigits: baseCurrency?.precision,
				})} ${baseCurrencyCode}`}
				width="180px"
				maxWidth="180px"
				crop
			>
				{formatNumber(+orderDetails.amount, {
					maximumFractionDigits: baseCurrency?.precision,
				})}{" "}
				{baseCurrencyCode}
			</TableData>
			<TableData
				title={
					userSide === P2PSideEnum.Buy
						? orderDetails.seller_profile.nickname
						: orderDetails.buyer_profile.nickname
				}
				width="180px"
				maxWidth="180px"
				crop
			>
				{userSide === P2PSideEnum.Buy
					? orderDetails.seller_profile.nickname
					: orderDetails.buyer_profile.nickname}
			</TableData>
			<TableData width="250px" maxWidth="250px">
				{P2PStatuses[orderDetails.status].label}{" "}
				{orderDetails.status === P2POrderStatusEnum.OPEN && (
					<span className={styles.timer}>
						({getDisplayTimeValue(dateDiff.minutes).map((char) => char)}:
						{getDisplayTimeValue(dateDiff.seconds).map((char) => char)})
					</span>
				)}
			</TableData>
			<TableData
				title={orderDetails.id.toString()}
				align="right"
				width="150px"
				maxWidth="150px"
				crop
			>
				<InternalLink
					className={styles.order_link}
					to={routes.p2p.getOrderDetails(orderDetails.id)}
				>
					{orderDetails.id}
				</InternalLink>
				<i onClick={handleClickCopy} className={cn(styles.copy_btn, "ai ai-copy_new")} />
			</TableData>
		</TableRow>
	);
};

export default OrderTableRow;

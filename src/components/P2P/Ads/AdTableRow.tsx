import React, { useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";

import { TableData, TableRow } from "components/UI/NewTable";
import Badge from "components/UI/Badge";
import { IAd, P2PSideEnum } from "types/p2p";
import P2PService from "services/P2PService";
import errorHandler from "utils/errorHandler";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import Button from "components/UI/Button";
import p2pMessages from "messages/p2p";
import buyCryptoMessages from "messages/buy_crypto";
import commonMessages from "messages/common";

interface IProps {
	ad: IAd;
	refetch: () => void;
}

const AdTableRow: React.FC<IProps> = ({ ad, refetch }) => {
	const { formatMessage, formatNumber } = useIntl();

	const [baseCurrencyCode, quoteCurrencyCode] = ad.pair.symbol.split("_");

	const [isCancelling, toggleIsCancelling] = useState(false);

	const handleCancel = () => {
		toggleIsCancelling(true);
		return P2PService.cancelAd(ad.id)
			.then(() => {
				refetch();
				toast.success(formatMessage(p2pMessages.ad_is_cancelled));
			})
			.catch(errorHandler)
			.finally(() => toggleIsCancelling(false));
	};
	return (
		<TableRow common>
			<TableData width="120px" maxWidth="120px">
				<Badge alpha color={ad.side === P2PSideEnum.Sell ? "red" : "green"}>
					{ad.side === P2PSideEnum.Sell
						? formatMessage(buyCryptoMessages.sell)
						: formatMessage(buyCryptoMessages.buy)}
				</Badge>
			</TableData>
			<TableData width="120px" maxWidth="120px">
				{baseCurrencyCode}
			</TableData>
			<TableData
				title={`${formatNumber(+ad.amount * +ad.price, {
					maximumFractionDigits: ad.pair.quote_currency.precision,
				})} ${quoteCurrencyCode}`}
				width="180px"
				maxWidth="180px"
				crop
			>
				{formatNumber(+ad.amount * +ad.price, {
					maximumFractionDigits: ad.pair.quote_currency.precision,
				})}{" "}
				{quoteCurrencyCode}
			</TableData>
			<TableData
				title={formatNumber(+ad.price, {
					maximumFractionDigits: ad.pair.quote_currency.precision,
				})}
				width="180px"
				maxWidth="180px"
				crop
			>
				{formatNumber(+ad.price, {
					maximumFractionDigits: ad.pair.quote_currency.precision,
				})}{" "}
				{quoteCurrencyCode}
			</TableData>
			<TableData
				title={formatNumber(+ad.available, {
					maximumFractionDigits: ad.pair.base_currency.precision,
				})}
				width="180px"
				maxWidth="180px"
				crop
			>
				{formatNumber(+ad.available, {
					maximumFractionDigits: ad.pair.base_currency.precision,
				})}{" "}
				{baseCurrencyCode}
			</TableData>
			<TableData
				title={formatNumber(+ad.amount, {
					maximumFractionDigits: ad.pair.base_currency.precision,
				})}
				width="180px"
				maxWidth="180px"
				crop
			>
				{formatNumber(+ad.amount, {
					maximumFractionDigits: ad.pair.base_currency.precision,
				})}{" "}
				{baseCurrencyCode}
			</TableData>
			<TableData align="right" width="120px" maxWidth="120px">
				<Button
					label={formatMessage(commonMessages.cancel)}
					variant="text"
					mini
					onClick={handleCancel}
					isLoading={isCancelling}
					className={p2pStyles.table_btn}
				/>
			</TableData>
		</TableRow>
	);
};

export default AdTableRow;

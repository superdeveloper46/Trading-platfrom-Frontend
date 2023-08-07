import Table, { IHeaderColumn } from "components/UI/Table/Table";
import React from "react";
import { useIntl } from "react-intl";
import feesMessages from "messages/fees_trading";
import styles from "styles/pages/TradingFees.module.scss";
import { useMst } from "models/Root";
import { IGetTradingFeesRes } from "types/tradingFees";
import { observer } from "mobx-react-lite";
import FeeSpotTableRow, { InfoRow } from "./FeeSpotTableRow";
import { sortTiers } from "../TradingFeesCommon";

interface IProps {
	tradingFees?: IGetTradingFeesRes;
}

const FeeSpotDesktop: React.FC<IProps> = ({ tradingFees }) => {
	const { formatMessage } = useIntl();
	const { render } = useMst();
	const tiers = tradingFees?.tiers;
	const personal = tradingFees?.personal;
	const columns: IHeaderColumn[] = render.alpCoin
		? [
				{
					label: formatMessage(feesMessages.table_level),
					width: "80px",
					maxWidth: "80px",
				},
				{
					label: formatMessage(feesMessages.table_trading_volume),
					width: "100px",
					maxWidth: "100px",
					align: "right",
				},
				{
					width: "35px",
					maxWidth: "35px",
				},
				{
					label: formatMessage(feesMessages.table_alp_holding),
					width: "100px",
					maxWidth: "100px",
				},
				{
					width: "45px",
					maxWidth: "45px",
				},
				{
					label: formatMessage(feesMessages.table_fee_rate),
					width: "180px",
					maxWidth: "180px",
				},
				{
					width: "45px",
					maxWidth: "45px",
				},
				{
					label: formatMessage(feesMessages.table_fee_rate_alp, {
						percentage: "-20%",
					}),
					width: "180px",
					maxWidth: "180px",
				},
				{
					width: "45px",
					maxWidth: "45px",
				},
				{
					label: formatMessage(feesMessages.table_fee_rate_alp_discount, {
						percentage_cashback: "20%",
						percentage_discount: "20%",
					}),
					width: "180px",
					maxWidth: "180px",
				},
		  ]
		: [
				{
					label: formatMessage(feesMessages.table_level),
					width: "80px",
					maxWidth: "80px",
				},
				{
					label: formatMessage(feesMessages.table_trading_volume),
					width: "100px",
					align: "right",
				},
				{
					width: "45px",
				},
				{
					label: formatMessage(feesMessages.table_fee_rate),
					width: "180px",
				},
		  ];

	return (
		<Table
			className={styles.fee_table}
			header={{
				primary: true,
				className: styles.fee_table_header,
				columns,
			}}
		>
			<>
				<InfoRow hasALPFee={render.alpCoin} />
				{tiers &&
					tiers.length > 0 &&
					tiers
						.sort(sortTiers)
						.map((tier) => (
							<FeeSpotTableRow
								key={tier.code}
								tier={tier}
								hasALPFee={render.alpCoin}
								isCurrentTier={personal?.fee_tier?.code === tier.code}
							/>
						))}
			</>
		</Table>
	);
};

export default observer(FeeSpotDesktop);

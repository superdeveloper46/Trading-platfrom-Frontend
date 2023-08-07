import React from "react";
import styles from "styles/pages/TradingFees.module.scss";
import NoRowsMessage from "components/Table/NoRowsMessage";
import useWindowSize from "hooks/useWindowSize";
import { useMst } from "models/Root";
import { observer } from "mobx-react-lite";
import { IGetTradingFeesRes } from "types/tradingFees";
import FeeSpotTableRowMobile from "./FeeSpotTable/FeeSpotTableRowMobile";
import FeeSpotDesktop from "./FeeSpotTable/FeeSpotDesktop";
import { sortTiers } from "./TradingFeesCommon";

interface IProps {
	tradingFees?: IGetTradingFeesRes;
}

const FeeSpotTable: React.FC<IProps> = ({ tradingFees }) => {
	const { desktop } = useWindowSize();
	return (
		<div className={styles.fee_table_container}>
			{desktop && <FeeSpotDesktop tradingFees={tradingFees} />}
			{!desktop && <FeeSpotMobile tradingFees={tradingFees} />}
		</div>
	);
};

export default FeeSpotTable;

const FeeSpotMobile: React.FC<IProps> = observer(({ tradingFees }) => {
	const { render } = useMst();
	const tiers = tradingFees?.tiers;
	const personal = tradingFees?.personal;

	return tiers && tiers.length ? (
		<>
			{tiers.sort(sortTiers).map((tier, index) => (
				<FeeSpotTableRowMobile
					first={index === 0}
					key={tier.code}
					hasALPFee={render.alpCoin}
					tier={tier}
					isCurrentTier={personal?.fee_tier?.code === tier.code}
				/>
			))}
		</>
	) : (
		<NoRowsMessage />
	);
});

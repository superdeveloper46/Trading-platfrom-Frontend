import classNames from "classnames";
import React, { useState } from "react";
import styles from "styles/pages/TradingFees.module.scss";
import feesMessages from "messages/fees_trading";
import { FormatNumberOptions, useIntl } from "react-intl";
import { ITradingFeesTier } from "types/tradingFees";
import ButtonMicro from "components/UI/Button/ButtonMicro";

const FORMAT_NUMBER_OPTIONS: FormatNumberOptions = {
	useGrouping: false,
	minimumFractionDigits: 4,
	maximumFractionDigits: 4,
};

interface IActiveTierMobile {
	tier?: ITradingFeesTier;
	isCurrentTier?: boolean;
}

const ActiveTierMobile: React.FC<IActiveTierMobile> = () => (
	<div className={classNames(styles.fee_active_tier, styles.mobile)} />
);

interface IProps {
	tier: ITradingFeesTier;
	isCurrentTier: boolean;
	first: boolean;
	hasALPFee: boolean;
}

const FeeSpotTableRowMobile: React.FC<IProps> = ({ tier, hasALPFee, isCurrentTier, first }) => {
	const { formatMessage, formatNumber } = useIntl();
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	return (
		<div className={classNames(styles.fee_mobile_card, { [styles.first]: first })}>
			<div className={styles.fee_mobile_card_header}>
				<div className={styles.fee_mobile_tier_name}>
					<span>{tier.name}</span>
					{isCurrentTier && <ActiveTierMobile />}
				</div>
				<div className={classNames(styles.fee_card_mobile_action, { [styles.active]: isExpanded })}>
					<ButtonMicro isSmall onClick={() => setIsExpanded(!isExpanded)}>
						<i className="ai ai-arrow_down" />
					</ButtonMicro>
				</div>
			</div>
			<div className={styles.fee_card_mobile_content}>
				<div className={styles.fee_card_mobile_content_group}>
					<span>{formatMessage(feesMessages.table_trading_volume)}</span>
					<span>{`>= ${tier.min_volume} BTC`}</span>
				</div>
				{hasALPFee && (
					<div className={styles.fee_card_mobile_content_group}>
						<span>{formatMessage(feesMessages.table_alp_holding)}</span>
						<span>{`>= ${tier.min_token} ALP`}</span>
					</div>
				)}
				{isExpanded && (
					<div className={styles.fee_card_mobile_content_hidden}>
						<div className={styles.fee_card_mobile_content_group}>
							<span>{formatMessage(feesMessages.table_fee_rate)}</span>
						</div>
						<div className={styles.fee_card_mobile_content_group}>
							<span>Maker</span>
							<span>{formatNumber((tier.maker_fee_rate ?? 0) * 100, FORMAT_NUMBER_OPTIONS)}</span>
						</div>
						<div className={styles.fee_card_mobile_content_group}>
							<span>Taker</span>
							<span>{formatNumber((tier.taker_fee_rate ?? 0) * 100, FORMAT_NUMBER_OPTIONS)}</span>
						</div>
						{hasALPFee && (
							<>
								<div className={styles.fee_card_mobile_content_group}>
									<span>
										{formatMessage(feesMessages.table_fee_rate_alp, {
											percentage: "-20%",
										})}
									</span>
								</div>
								<div className={styles.fee_card_mobile_content_group}>
									<span>Maker</span>
									<span>
										{formatNumber((tier.maker_fee_rate ?? 0) * 100 * 0.8, FORMAT_NUMBER_OPTIONS)}%
									</span>
								</div>
								<div className={styles.fee_card_mobile_content_group}>
									<span>Taker</span>
									<span>
										{formatNumber((tier.taker_fee_rate ?? 0) * 100 * 0.8, FORMAT_NUMBER_OPTIONS)}%
									</span>
								</div>
								<div className={styles.fee_card_mobile_content_group}>
									<span>
										{formatMessage(feesMessages.table_fee_rate_alp_discount, {
											percentage_cashback: "20%",
											percentage_discount: "20%",
										})}
									</span>
								</div>
								<div className={styles.fee_card_mobile_content_group}>
									<span>Maker</span>
									<span>
										{formatNumber((tier.maker_fee_rate ?? 0) * 100 * 0.64, FORMAT_NUMBER_OPTIONS)}%
									</span>
								</div>
								<div className={styles.fee_card_mobile_content_group}>
									<span>Taker</span>
									<span>
										{formatNumber((tier.taker_fee_rate ?? 0) * 100 * 0.64, FORMAT_NUMBER_OPTIONS)}%
									</span>
								</div>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default FeeSpotTableRowMobile;

import React, { useEffect, useState } from "react";
import { FormatNumberOptions, useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import styles from "styles/pages/TradingFees.module.scss";
import commonMessages from "messages/common";
import feesTradingMessages from "messages/fees_trading";
import { useMst } from "models/Root";
import InternalLink from "components/InternalLink";
import { IGetTradingFeesRes, ITradingFeesPersonal, ITradingFeesTier } from "types/tradingFees";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { routes } from "constants/routing";
import { Balance } from "./TradingFeesCommon";

const FORMAT_NUMBER_OPTIONS: FormatNumberOptions = {
	useGrouping: false,
	maximumFractionDigits: 8,
};

interface IProps {
	tradingFees?: IGetTradingFeesRes;
	isLoading?: boolean;
}

const TradingFeeLevel: React.FC<IProps> = ({ tradingFees, isLoading }) => {
	const {
		global: { isAuthenticated },
		render,
	} = useMst();
	const { formatNumber, formatMessage } = useIntl();
	const tiers = tradingFees?.tiers ?? [];
	const [personal, setPersonal] = useState<ITradingFeesPersonal | undefined>();
	const [currentFeeTier, setCurrentFeeTier] = useState<ITradingFeesTier | null>(null);
	const [currentLevelIdx, setCurrentLevelIdx] = useState(-1);
	const [nextFeeTier, setNextFeeTier] = useState<ITradingFeesTier | null>(null);
	const [progressVolume, setProgressVolume] = useState<number>(0);
	const [progressToken, setProgressToken] = useState<number>(0);

	useEffect(() => {
		setPersonal(tradingFees?.personal);
		setCurrentFeeTier(personal?.fee_tier ?? null);
	}, [isLoading, tradingFees]);

	useEffect(() => {
		setCurrentLevelIdx(
			currentFeeTier
				? tiers.findIndex((tier: ITradingFeesTier) => tier.code === currentFeeTier.code)
				: -1,
		);
	}, [currentFeeTier]);

	useEffect(() => {
		setNextFeeTier(
			currentLevelIdx !== -1 && currentLevelIdx < tiers.length - 1
				? tiers[currentLevelIdx + 1]
				: null,
		);
	}, [currentLevelIdx]);

	useEffect(() => {
		setProgressVolume(
			personal && nextFeeTier?.min_volume ? (personal.volume / nextFeeTier.min_volume) * 100 : 0,
		);
		setProgressToken(
			personal && nextFeeTier?.min_token
				? (personal.token_balance / nextFeeTier.min_token) * 100
				: 0,
		);
	}, [nextFeeTier, personal]);

	return (
		<div className={styles.fee_card}>
			<div className={styles.fee_header_content}>
				<div className={styles.fee_card_title}>
					{formatMessage(feesTradingMessages.your_trading_fee_level)}
					<span>
						<i className="ai ai-vip" />
						{personal?.fee_tier?.name ?? "VIP ?"}
					</span>
				</div>
				{isLoading ? (
					<LoadingSpinner />
				) : personal?.is_fixed ? (
					<FeeDescription text={formatMessage(feesTradingMessages.your_fee_is_fixed)} />
				) : render.alpCoin ? (
					nextFeeTier ? (
						<FeeDescription
							text={formatMessage(feesTradingMessages.reach_vip_level, {
								level: currentLevelIdx + 2,
								amount_btc: formatNumber(nextFeeTier.min_volume ?? 0, {
									useGrouping: false,
									maximumFractionDigits: 2,
								}),
								amount_alp: formatNumber(nextFeeTier.min_token ?? 0, {
									useGrouping: false,
									maximumFractionDigits: 2,
								}),
							})}
						/>
					) : currentFeeTier ? (
						<FeeDescription
							text={formatMessage(feesTradingMessages.you_reached_max_level, {
								amount_btc: formatNumber(currentFeeTier.min_volume ?? 0, {
									useGrouping: false,
									maximumFractionDigits: 2,
								}),
								amount_alp: formatNumber(currentFeeTier.min_token ?? 0, {
									useGrouping: false,
									maximumFractionDigits: 2,
								}),
							})}
						/>
					) : (
						<FeeDescription text="" />
					)
				) : (
					<FeeDescription text="" />
				)}
			</div>
			{isAuthenticated && personal && (
				<div className={styles.fee_balances}>
					<Balance
						text={formatMessage(feesTradingMessages.spot_trading_volume_30_days)}
						amount={formatNumber(personal.volume ?? 0, FORMAT_NUMBER_OPTIONS)}
						ccy="BTC"
						progress={progressVolume}
					/>
					{render.alpCoin && (
						<Balance
							text={formatMessage(feesTradingMessages.your_alp_balance)}
							amount={formatNumber(personal.token_balance ?? 0, FORMAT_NUMBER_OPTIONS)}
							ccy="ALP"
							progress={progressToken}
							primary
						/>
					)}
				</div>
			)}
			{!isAuthenticated && <LoginStub />}
		</div>
	);
};

interface IFeeDescriptionProps {
	text: string;
}

const FeeDescription: React.FC<IFeeDescriptionProps> = ({ text }) => (
	<span className={styles.fee_description}>{text}</span>
);

const LoginStub: React.FC = () => {
	const { formatMessage } = useIntl();
	return (
		<div className={styles.fee_login_stub}>
			<i className="ai ai-user" />
			<span>
				{formatMessage(feesTradingMessages.to_see_your_current_commission_level, {
					login: (
						<InternalLink to={routes.login.root}>
							{formatMessage(commonMessages.login_noun)}
						</InternalLink>
					),
					register: (
						<InternalLink to={routes.register.root}>
							{formatMessage(commonMessages.registerAction)}
						</InternalLink>
					),
				})}
			</span>
		</div>
	);
};

export default observer(TradingFeeLevel);

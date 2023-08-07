import React, { useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import buyCryptoMessages from "messages/buy_crypto";
import formMessages from "messages/form";
import mastercardLogo from "assets/images/buy_crypto/mastercard.svg";
import visaLogo from "assets/images/buy_crypto/visa.svg";
import mirLogo from "assets/images/buy_crypto/mir.svg";
import Button from "components/UI/Button";
import styles from "styles/pages/BuyCrypto.module.scss";
import { IChannel, ICurrency } from "models/BuyCrypto";
import { useMst } from "models/Root";
import { routes } from "constants/routing";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import ConfirmModal from "../ConfirmModal";
import VerificationModal from "../VerificationModal";

const PAYMENT_SYSTEMS: { [key: string]: string } = {
	mastercard: mastercardLogo,
	visa: visaLogo,
	mir: mirLogo,
};

interface Props {
	cryptoCurrency: ICurrency;
	fiatCurrency: ICurrency;
	fiatAmount: number;
	exchangeRate: string;
	channel: IChannel;
	rateId: number;
	verificationLevel: number;
}

const Method: React.FC<Props> = ({
	cryptoCurrency,
	fiatCurrency,
	fiatAmount,
	exchangeRate,
	channel,
	verificationLevel,
	rateId,
}) => {
	const { formatMessage, formatNumber } = useIntl();

	const {
		buyCrypto: { sendPurchase, setAmountError },
		global: { isAuthenticated, theme },
	} = useMst();

	const localeNavigate = useLocaleNavigate();
	const [verificationModalOpened, setVerificationModalOpened] = useState(false);
	const [confirmModalOpened, setConfirmModalOpened] = useState(false);

	const handleConfirmPurchase = () => {
		sendPurchase({
			fiat_amount: fiatAmount.toFixed(8),
			rate: rateId,
			amount: (fiatAmount / +exchangeRate).toFixed(8),
		});
		setConfirmModalOpened(false);
	};

	const handleSubmit = () => {
		setAmountError("");

		if (!isAuthenticated) {
			localeNavigate(routes.login.root);
		} else if (verificationLevel < 1) {
			setVerificationModalOpened(true);
		} else if (+fiatAmount > 0) {
			setConfirmModalOpened(true);
		} else {
			setAmountError(formatMessage(formMessages.required));
		}
	};

	return (
		<div className={styles.method_container}>
			<VerificationModal
				isOpen={verificationModalOpened}
				onClose={() => setVerificationModalOpened(false)}
			/>
			<ConfirmModal
				isOpen={confirmModalOpened}
				onConfirm={handleConfirmPurchase}
				currency={cryptoCurrency}
				amount={fiatAmount / +exchangeRate}
				siteDomain={channel.site_domain}
				onClose={() => setConfirmModalOpened(false)}
			/>
			<div
				className={cn(
					styles.method_logo,
					channel.code === "mercuryo" && theme === "dark" && styles.method_logo_brightness,
				)}
			>
				<img src={channel.image_svg || channel.image_png || ""} alt={channel.label} />
			</div>
			<div className={cn(styles.method_info, styles.method_info_column)}>
				<span className={styles.method_label}>{channel.label}</span>
				<span className={styles.method_description}>
					{channel.description?.slice(0, 110)}
					{channel.description?.length > 110 ? "..." : ""}
				</span>
				<div className={styles.method_payment_icons}>
					{channel.payment_icons.map((label: string) => (
						<img src={PAYMENT_SYSTEMS[label]} alt={label} key={label} />
					))}
				</div>
			</div>
			<div className={styles.method_action}>
				<div className={styles.method_action_receive}>
					<span>{formatMessage(buyCryptoMessages.you_will_get)}:</span>
					<span>
						≈&nbsp;
						<i className={`ai ai-${cryptoCurrency.code.toLowerCase()}`} />
						<span className={styles.method_action_currency_amount}>
							{formatNumber(+fiatAmount / +exchangeRate, {
								useGrouping: false,
								maximumFractionDigits: 8,
							})}
							&nbsp;
							{cryptoCurrency.code}
						</span>
					</span>
				</div>
				<Button
					color="tertiary"
					fullWidth
					iconCode="credit_card"
					iconAlign="left"
					onClick={handleSubmit}
					label={formatMessage(buyCryptoMessages.get_now, {
						currency: cryptoCurrency.code,
					})}
				/>
				<div className={styles.method_exchange_rate}>
					{formatMessage(buyCryptoMessages.exchange_rate)}: 1&nbsp;
					{cryptoCurrency.code} =&nbsp;
					{formatNumber(+exchangeRate, {
						useGrouping: false,
						maximumFractionDigits: 8,
					})}
					&nbsp;{fiatCurrency.code}
				</div>
			</div>
		</div>
	);
};

export default observer(Method);

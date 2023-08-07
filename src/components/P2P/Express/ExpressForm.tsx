import React, { useState } from "react";
import cn from "classnames";
import { useIntl } from "react-intl";

import styles from "styles/pages/P2P/OrderCreate.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import Button from "components/UI/Button";
import Input, { Appender } from "components/UI/Input";
import CurrencyMiniSelect from "components/UI/CurrencyMiniSelect";
import buyCryptoMessages from "messages/buy_crypto";

const paymentsMock = [
	{
		label: "monobank",
		amount: "771,741.42 UAH",
		isActive: true,
	},
	{
		label: "Privat Bank (Universal Card)",
		amount: "771,741.42 UAH",
	},
];

const coinsMock = [
	{
		label: {
			code: "ALP",
			name: "ALP Coin",
			image_svg: "https://front.alpcom.dev/media/currency/ALP/AJ8r1mfD.svg",
			image_png: "https://front.alpcom.dev/media/currency/ALP/anDDZwXX.png",
			available: "0.00000000",
			precision: 8,
		},
		value: "alp",
	},
	{
		label: {
			code: "BTC",
			name: "Bitcoin",
			image_svg: "https://front.alpcom.dev/media/currency/BTC/kqIenGPU.svg",
			image_png: "https://front.alpcom.dev/media/currency/BTC/pCpOSO9P.png",
			precision: 8,
			available: "0.00000000",
		},
		value: "btc",
	},
];

const ExpressForm = () => {
	const { formatMessage } = useIntl();
	const [side, setSide] = useState("buy");

	const [option, setOption] = useState();

	const handleSelect = (o: any) => {
		setOption(o);
	};

	return (
		<div className={styles.form_wrapper}>
			<div className={styles.form_container}>
				<span className={cn(styles.form_title, styles.margin)}>P2P Express</span>
				<div className={cn(p2pStyles.side_selector, { [p2pStyles.right]: side === "sell" })}>
					<div onClick={() => setSide("buy")} className={p2pStyles.side_button}>
						{formatMessage(buyCryptoMessages.buy)}
					</div>
					<div onClick={() => setSide("sell")} className={p2pStyles.side_button}>
						{formatMessage(buyCryptoMessages.sell)}
					</div>
				</div>
				<Input
					name="amount_input"
					type="number"
					labelValue="I want to pay"
					onChange={() => console.log("amount")}
					appender={
						<Appender className={styles.currency_appender}>
							<CurrencyMiniSelect
								onSelectChange={handleSelect}
								value={option}
								options={coinsMock}
								className={styles.input_block}
							/>
						</Appender>
					}
				/>
				<Input
					name="amount_input"
					type="number"
					labelValue="I will receive"
					onChange={() => console.log("amount")}
					appender={
						<Appender className={styles.currency_appender}>
							<CurrencyMiniSelect
								onSelectChange={handleSelect}
								value={option}
								options={coinsMock}
								className={styles.input_block}
							/>
						</Appender>
					}
				/>
				<span className={styles.form_secondary_text}>
					Reference price: <strong>771,741.42 UAH</strong>
				</span>
				<div className={styles.controls_container}>
					<Button fullWidth label="Next step" />
					<Button fullWidth variant="outlined" label="Cancel" />
				</div>
			</div>
			<div className={cn(styles.form_container)}>
				<span className={styles.form_title}>Confirm payment</span>
				<span className={p2pStyles.smallcaps_label}>Select payment method</span>
				<div className={styles.payment_methods_radio_container}>
					{paymentsMock.map(({ label, amount, isActive }, i) => (
						<div key={i} className={cn(styles.method_item, { [styles.active]: isActive })}>
							<div className={styles.checkbox} />
							<div className={styles.title}>{label}</div>
							<div className={cn(p2pStyles.default_text, p2pStyles.bold)}>{amount}</div>
						</div>
					))}
				</div>
				<div className={styles.controls_container}>
					<Button fullWidth label="Next step" />
					<Button fullWidth variant="outlined" label="Cancel" />
				</div>
			</div>
		</div>
	);
};

export default ExpressForm;

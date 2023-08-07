import React, { useCallback, useRef, useState, useEffect } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import buyCryptoMessages from "messages/buy_crypto";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import styles from "styles/pages/BuyCrypto.module.scss";
import dropdownListStyles from "styles/components/DropdownList.module.scss";
import ExchangeCryptoInput from "components/UI/ExchangeCryptoInput";
import InternalLink from "components/InternalLink";
import { useMst } from "models/Root";
import { ISelectOption } from "components/UI/Select";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";

const Form: React.FC = () => {
	const {
		buyCrypto: {
			amount,
			fiatCurrency,
			cryptoCurrency,
			amountError,
			setAmount,
			setAmountError,
			fiatOptions,
			cryptoOptions,
			currentCryptoOption,
		},
	} = useMst();
	const { formatMessage } = useIntl();
	const localeNavigate = useLocaleNavigate();
	const fiatCurrentRef = useRef<HTMLDivElement>(null);
	const [fiatListIsOpen, setFiatListIsOpen] = useState<boolean>(false);

	const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const formattedValue = e.target.value.replace(",", ".");
		if (/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/.test(formattedValue) || !formattedValue) {
			setAmount(Math.max(0, +formattedValue).toString());
		}
		setAmountError("");
	}, []);

	const handleCloseFiatList = useCallback(
		(e: MouseEvent) => {
			if (fiatCurrentRef?.current && !fiatCurrentRef.current.contains(e.target as Node)) {
				setFiatListIsOpen(false);
			}
		},
		[fiatCurrentRef],
	);

	const handleSelectChange = useCallback(
		(option: ISelectOption) => {
			const value = option.value.toUpperCase();
			localeNavigate(routes.buyCrypto.getPair(`${fiatCurrency}_${value}`));
		},
		[fiatCurrency],
	);

	useEffect(() => {
		if (fiatListIsOpen) {
			document.addEventListener("click", handleCloseFiatList);
		} else {
			document.removeEventListener("click", handleCloseFiatList);
		}
		return () => document.removeEventListener("click", handleCloseFiatList);
	}, [fiatListIsOpen]);

	return fiatCurrency && cryptoCurrency ? (
		<div className={styles.form_container}>
			<div className={styles.currency_container}>
				<span className={styles.form_label}>{formatMessage(buyCryptoMessages.i_give)}:</span>
				<div className={styles.fiat_container}>
					{amountError !== "" && <div className={styles.error_popup}>{amountError}</div>}
					<ExchangeCryptoInput
						icon={<i className={`ai ai-${fiatCurrency.toLowerCase()}`} />}
						type="number"
						value={amount}
						onChange={handleAmountChange}
						placeholder="0"
						indicatorIsActive={fiatListIsOpen}
					/>
					<div
						className={styles.fiat_current}
						ref={fiatCurrentRef}
						onClick={() => setFiatListIsOpen(!fiatListIsOpen)}
					>
						<span>{fiatCurrency}</span>
						<i className="ai ai-hint_down" />
					</div>
					{fiatListIsOpen && (
						<div className={cn(styles.fiat_list)}>
							{fiatOptions.map((option: IOption) => (
								<InternalLink
									to={routes.buyCrypto.getPair(`${option.value.toUpperCase()}_${cryptoCurrency}`)}
									key={option.value}
								>
									<div className={cn(dropdownListStyles.dropdown_list_item, styles.fiat_list_item)}>
										<i className={`ai ai-${option.value.toLowerCase()}`} />
										{option.value.toUpperCase()}
										<span>({option.label.name})</span>
										{option.value === fiatCurrency && <i className="ai ai-check_mini" />}
									</div>
								</InternalLink>
							))}
						</div>
					)}
				</div>
			</div>
			<i className={cn(styles.exchange_arrow, "ai ai-mini_right")} />
			<div className={styles.currency_container}>
				<span className={styles.form_label}>{formatMessage(buyCryptoMessages.i_want_to_get)}:</span>
				<CurrencySelect
					onSelectChange={handleSelectChange}
					options={cryptoOptions}
					value={currentCryptoOption}
					autoFocus
					withoutLabel
				/>
			</div>
		</div>
	) : null;
};

export default observer(Form);

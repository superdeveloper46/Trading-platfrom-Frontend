import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import messages from "messages/finance";
import { ISelectOption as IUISelectOption } from "components/UI/Select";
import { useMst } from "models/Root";
import { IDepositMethodNote } from "models/Deposit";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import styles from "styles/components/DepositWithdrawal.module.scss";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";

const CoinStep: React.FC = () => {
	const {
		deposit: { processedCurrencies, currentCurrency, currentMethod },
	} = useMst();
	const { formatMessage, formatNumber } = useIntl();
	const localeNavigate = useLocaleNavigate();

	const currentOption =
		processedCurrencies && currentCurrency
			? processedCurrencies.find(
					(o: IOption) => o.value.toUpperCase() === currentCurrency.code.toUpperCase(),
			  )
			: undefined;
	const feeRate = currentMethod ? parseFloat(currentMethod.deposit_fee_rate ?? "0") : 0;
	const feeAmount = currentMethod ? parseFloat(currentMethod.deposit_fee_amount ?? "0") : 0;

	const handleSelectChange = useCallback((e: IUISelectOption) => {
		const value = e.value.toUpperCase();
		localeNavigate(routes.profile.getDepositCurrency(value));
	}, []);

	return (
		<div className={styles.step_container}>
			<div className={styles.step_container_section}>
				<div className={styles.step_info}>
					<span className={styles.step_info_title}>
						1.&nbsp;
						{formatMessage(messages.select_currency)}
					</span>
				</div>
				<div className={styles.form_container}>
					<CurrencySelect
						onSelectChange={handleSelectChange}
						options={processedCurrencies}
						value={currentOption}
						autoFocus
					/>
					{currentCurrency ? (
						<div className={styles.form_group_container}>
							<div className={styles.form_group}>
								<span className={styles.form_group_value}>
									{formatMessage(messages.overall_balance)}:
								</span>
							</div>
							<div className={styles.form_group}>
								<span className={cn(styles.form_group_value, styles.primary)}>
									{formatNumber(parseFloat(currentCurrency.balance ?? "0"), {
										maximumFractionDigits: 8,
										useGrouping: false,
									})}
									&nbsp;{currentCurrency.code}
								</span>
							</div>
						</div>
					) : null}
				</div>
				<div className={styles.deposit_warning_container}>
					<div className={styles.info_small_secondary}>
						<i className="ai ai-warning" />
						{formatMessage(messages.deposit_warning, {
							currency: currentCurrency?.code ?? "-",
						})}
					</div>
				</div>
				{currentMethod ? (
					<div className={styles.note_list}>
						{currentMethod.deposit_confirmations_need > 0 && (
							<div className={styles.note_list_item}>
								{formatMessage(messages.deposit_confirmations, {
									confirmations: <span>{currentMethod.deposit_confirmations_need}</span>,
									networkName: currentMethod?.network?.name || currentCurrency?.code,
								})}
							</div>
						)}
						<div className={styles.note_list_item}>
							{feeAmount === 0 && feeRate === 0
								? formatMessage(messages.no_fee_on_deposit, {
										currency: currentCurrency?.code,
								  })
								: formatMessage(messages.deposit_fee_is, {
										fee: (
											<>
												{feeAmount > 0 &&
													`${feeAmount} ${currentMethod.currency?.code ?? ""} ${
														feeRate > 0 ? "+" : ""
													} `}
												{feeRate > 0 &&
													`${formatNumber(feeRate * 100, {
														maximumFractionDigits: 8,
														useGrouping: false,
													})}%`}
											</>
										),
								  })}
						</div>
						{currentMethod.notes?.map((note: IDepositMethodNote, idx: number) => (
							<div className={styles.note_list_item} key={idx}>
								{note.message}
							</div>
						))}
					</div>
				) : null}
			</div>
		</div>
	);
};

export default observer(CoinStep);

import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import messages from "messages/finance";
import { useMst } from "models/Root";
import useWindowSize from "hooks/useWindowSize";
import styles from "styles/components/DepositWithdrawal.module.scss";
import CurrencySelect, { IOption } from "components/UI/CurrencySelect";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";
import LimitInfo from "./LimitInfo";
import HelpInfo from "./HelpInfo";

const CoinStep: React.FC = () => {
	const {
		withdrawal: { processedCurrencies, currentCurrency },
		render,
	} = useMst();
	const { formatMessage, formatNumber } = useIntl();
	const { mobile } = useWindowSize();
	const localeNavigate = useLocaleNavigate();

	const currentOption =
		processedCurrencies && currentCurrency
			? processedCurrencies.find(
					(o: IOption) => o.value.toUpperCase() === currentCurrency.code.toUpperCase(),
			  )
			: undefined;

	const handleSelectChange = useCallback((e: any) => {
		const value = e.value.toUpperCase();
		localeNavigate(routes.profile.getWithdrawCurrency(value));
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
								<span className={styles.form_group_value}>{formatMessage(messages.reserve)}:</span>
								<span className={styles.form_group_value}>
									{formatMessage(messages.available)}:
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
								<span className={styles.form_group_value}>
									{formatNumber(parseFloat(currentCurrency.reserve ?? "0"), {
										maximumFractionDigits: 8,
										useGrouping: false,
									})}
									&nbsp;{currentCurrency.code}
								</span>
								<span className={cn(styles.form_group_value, styles.primary)}>
									{formatNumber(currentCurrency.available ?? "0", {
										maximumFractionDigits: 8,
										useGrouping: false,
									})}
									&nbsp;{currentCurrency.code}
								</span>
							</div>
						</div>
					) : null}
				</div>
				<div className={styles.limit_container}>
					<LimitInfo />
				</div>
			</div>
			{!mobile && render.supportCenter && <HelpInfo />}
		</div>
	);
};

export default observer(CoinStep);

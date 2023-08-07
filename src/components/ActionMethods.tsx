import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import dayjs from "utils/dayjs";
import financeMessages from "messages/finance";
import coinInfoMessages from "messages/exchange";
import visaMastercardImage from "assets/images/finance/visa-mastercard-method.png";
import styles from "styles/components/ActionMethods.module.scss";
import cn from "classnames";
import { IWithdrawalMethod } from "models/Withdrawal";
import { IDepositMethod } from "models/Deposit";

interface Props {
	title: string;
	type: "withdraw" | "deposit";
	methods: (IWithdrawalMethod | IDepositMethod)[];
	currentMethod?: IWithdrawalMethod | IDepositMethod;
	onChange: (method: any) => void;
}

const ActionMethods: React.FC<Props> = ({ title, methods = [], currentMethod, onChange, type }) => {
	const { formatMessage, formatNumber } = useIntl();

	const handleActionMethodClick = useCallback(
		(e: React.MouseEvent<{ dataset: any }>) => {
			const { id } = e.currentTarget.dataset;
			if (methods.length) {
				const method = methods.find((m) => m.id === +id);
				// @ts-ignore
				if (method[`is_${type}_enabled`]) {
					onChange(method);
				}
			}
		},
		[methods, onChange],
	);

	return (
		<div className={styles.container}>
			<div className={styles.title}>
				<span>{title}</span>
			</div>
			<div className={styles.method_list}>
				{methods?.map((method: IWithdrawalMethod | IDepositMethod) => {
					// @ts-ignore
					const feeRate = parseFloat(method[`${type}_fee_rate`] ?? "0");
					// @ts-ignore
					const feeAmount = parseFloat(method[`${type}_fee_amount`] ?? "0");
					const feeCurrency =
						// @ts-ignore
						type === "withdraw" ? method.withdraw_fee_currency?.code : method.currency?.code;
					// @ts-ignore
					const disabled = !method[`is_${type}_enabled`];

					const methodIcon =
						method.image_png ||
						method.image_svg ||
						method.currency?.image_svg ||
						method.currency?.image_png ||
						"";

					return (
						<div
							className={cn(styles.method, {
								[styles.disabled]: disabled,
								[styles.active]: currentMethod ? currentMethod.id === method.id : false,
							})}
							key={method.id}
							data-id={method.id}
							onClick={handleActionMethodClick}
						>
							{methodIcon ? (
								<img src={methodIcon} alt={method.name} />
							) : method.currency?.code ? (
								<i className={`ai ai-${method.currency?.code.toLowerCase()}`} />
							) : (
								<i className="ai ai-box" />
							)}
							<span className={styles.method_label}>
								{method.network?.name && method.network?.name !== method.name
									? method.name.replace(method.network?.name, `(${method.network?.name})`)
									: method.name}
							</span>
							<span className={cn(styles.method_fee, { [styles.active]: feeRate === 0 })}>
								{feeRate === 0 && feeAmount === 0 ? (
									formatMessage(financeMessages.no_fee)
								) : (
									<>
										{formatMessage(coinInfoMessages.fee)}:&nbsp;
										{feeAmount > 0 &&
											`${feeAmount} ${feeCurrency ?? ""} ${feeRate > 0 ? "+" : ""} `}
										{feeRate > 0 &&
											`${formatNumber(feeRate * 100, {
												maximumFractionDigits: 8,
												useGrouping: false,
											})}%`}
									</>
								)}
							</span>
							<i className="ai ai-check_mini" />
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ActionMethods;

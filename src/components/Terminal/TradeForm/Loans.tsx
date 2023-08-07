import { IBalance } from "models/Account";
import React from "react";
import { useIntl } from "react-intl";
import styles from "styles/pages/Terminal.module.scss";

interface Props {
	loans: IBalance[];
}

const Loans: React.FC<Props> = ({ loans }) => {
	const { formatNumber } = useIntl();

	return (
		<div className={styles.trade_form_loans}>
			<span>Loans</span>
			<div className={styles.trade_form_loans_list}>
				{loans.length > 0 ? (
					loans.map((b: IBalance, i: number) => (
						<div className={styles.trade_form_loans_list_item} key={i}>
							<span>{b.code}</span>
							<span>
								{formatNumber(b.debt, {
									useGrouping: false,
									minimumFractionDigits: b.precision ?? 0,
									maximumFractionDigits: b.precision ?? 8,
								})}
							</span>
						</div>
					))
				) : (
					<div className={styles.trade_form_loans_list_item}>
						<span>--</span>
						<span>--</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default Loans;

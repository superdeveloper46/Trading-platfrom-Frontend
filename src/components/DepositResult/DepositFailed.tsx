import React from "react";

import styles from "styles/components/DepositResult.module.scss";
import { queryVars } from "constants/query";
import useParamQuery from "hooks/useSearchQuery";
import { ScreenCanceled } from "../StatusScreens";

const DepositFailed: React.FC = () => {
	const paramQuery = useParamQuery();
	const amount = paramQuery.get(queryVars.amount);
	const currency = paramQuery.get(queryVars.currency);
	const payment_type_name = paramQuery.get(queryVars.payment_type_name);

	return (
		<div className={styles.container}>
			<ScreenCanceled
				type="deposit"
				amount={`${amount ?? ""}`}
				paymentType={`${payment_type_name ?? ""}`}
				currency={`${currency ?? ""}`}
			/>
		</div>
	);
};

export default DepositFailed;

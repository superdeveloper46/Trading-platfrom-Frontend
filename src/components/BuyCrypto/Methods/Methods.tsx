import React from "react";
import LoadingSpinner from "components/UI/LoadingSpinner";
import styles from "styles/pages/BuyCrypto.module.scss";
import pageStyles from "styles/pages/Page.module.scss";
import cn from "classnames";
import { IRate } from "models/BuyCrypto";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";
import useWindowSize from "hooks/useWindowSize";
import Method from "./Method";
import MethodMobile from "./MethodMobile";

const Methods: React.FC = () => {
	const {
		buyCrypto: { rates, isLoading, fiatCurrency, cryptoCurrency, amount },
		account: { profileStatus },
	} = useMst();

	const { tablet } = useWindowSize();

	return (
		<div className={pageStyles.section_container}>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div className={cn(styles.method_list, styles.method_list_column)}>
					{rates
						.filter(
							(rate: IRate) =>
								rate.fiat_currency?.code === fiatCurrency &&
								rate.crypto_currency?.code === cryptoCurrency,
						)
						.sort((r1: IRate, r2: IRate) => +r1.exchange_rate - +r2.exchange_rate)
						.map((rate: IRate) =>
							tablet ? (
								<MethodMobile
									key={rate.id}
									rateId={rate.id}
									fiatAmount={+amount}
									cryptoCurrency={rate.crypto_currency}
									fiatCurrency={rate.fiat_currency}
									exchangeRate={rate.exchange_rate}
									channel={rate.channel}
									verificationLevel={profileStatus?.verification_level ?? 0}
								/>
							) : (
								<Method
									key={rate.id}
									rateId={rate.id}
									fiatAmount={+amount}
									cryptoCurrency={rate.crypto_currency}
									fiatCurrency={rate.fiat_currency}
									exchangeRate={rate.exchange_rate}
									channel={rate.channel}
									verificationLevel={profileStatus?.verification_level ?? 0}
								/>
							),
						)}
				</div>
			)}
		</div>
	);
};

export default observer(Methods);

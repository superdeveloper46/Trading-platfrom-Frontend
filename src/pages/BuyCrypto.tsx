import React, { useEffect } from "react";
import MainLayout from "layouts/MainLayout";
import { Helmet } from "react-helmet";
import styles from "styles/pages/BuyCrypto.module.scss";
import commonMessages from "messages/common";
import { observer } from "mobx-react-lite";
import { PageHeader, Methods, StepsInfo, Form, HelpInfo } from "components/BuyCrypto";
import { useParams } from "react-router-dom";
import { useMst } from "models/Root";
import { getPageTitle } from "helpers/global";
import { useIntl } from "react-intl";
import { queryVars } from "constants/query";

const BuyCrypto: React.FC = () => {
	const { pair } = useParams<{ [queryVars.pair]: string }>();
	const { buyCrypto: model } = useMst();
	const { formatMessage } = useIntl();
	const text = getPageTitle(formatMessage(commonMessages.buy_crypto));

	useEffect(() => {
		if (pair) {
			const splitted = pair.split("_");
			const fiatCurrency = splitted ? splitted[0] : "";
			const cryptoCurrency = splitted ? splitted[1] : "";
			model.setFiatCurrency(fiatCurrency);
			model.setCryptoCurrency(cryptoCurrency);
		} else {
			model.setFiatCurrency("USD");
			model.setCryptoCurrency("BTC");
		}
		model.loadFiatRates({ direction: 1 });
	}, [pair]);

	return (
		<MainLayout>
			<Helmet
				title={text}
				meta={[
					{ name: "description", content: text },
					{ property: "og:title", content: text },
					{ property: "twitter:title", content: text },
					{ property: "og:description", content: text },
					{ name: "twitter:description", content: text },
				]}
			/>
			<div>
				<PageHeader />
				<div className={styles.buy_crypto}>
					<Form />
					<Methods />
					<StepsInfo />
				</div>
				<HelpInfo />
			</div>
		</MainLayout>
	);
};

export default observer(BuyCrypto);

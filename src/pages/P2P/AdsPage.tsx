import React from "react";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";

import styles from "styles/pages/P2P/Main.module.scss";
import Main from "components/P2P/AdsPage/Main";
import { queryVars } from "constants/query";
import useParamQuery from "hooks/useSearchQuery";
import p2pMessages from "messages/p2p";

const AdsPage = () => {
	const { formatMessage } = useIntl();
	const query = useParamQuery();
	const queryBaseCurrency = query.get(queryVars.base_currency);
	const title = `${formatMessage(p2pMessages.ads_page_helmet, {
		value: queryBaseCurrency,
	})} | ALP.COM P2P`;

	return (
		<div className={styles.container}>
			<Helmet
				title={title}
				meta={[
					{ name: "description", content: title },
					{ property: "og:title", content: title },
					{ property: "twitter:title", content: title },
					{ property: "og:description", content: title },
					{ name: "twitter:description", content: title },
				]}
			/>
			<Main />
		</div>
	);
};

export default AdsPage;

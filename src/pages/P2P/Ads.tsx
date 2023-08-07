import React from "react";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";

import AdsTable from "components/P2P/Ads/AdsTable";
import styles from "styles/pages/P2P/UserCenter.module.scss";
import p2pMessages from "messages/p2p";

const Orders = () => {
	const { formatMessage } = useIntl();

	const title = `P2P ${formatMessage(p2pMessages.ads)} | ALP.COM`;

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
			<AdsTable />
		</div>
	);
};

export default Orders;

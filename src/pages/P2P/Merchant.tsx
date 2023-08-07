import React from "react";
import cn from "classnames";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";

import MerchantCards from "components/P2P/Merchant/MerchantCards";
import styles from "styles/pages/P2P/Merchant.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import p2pMessages from "messages/p2p";

const Merchant = () => {
	const { formatMessage } = useIntl();
	const title = `P2P ${formatMessage(p2pMessages.merchant)} | ALP.COM`;

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
			<div className={styles.welcome_block}>
				<span className={styles.main_title}>P2P Merchant Application</span>
				<span className={cn(p2pStyles.default_text, p2pStyles.center)}>
					ALP P2P Merchant status provides extra benefits such as:
				</span>
			</div>
			<MerchantCards />
		</div>
	);
};

export default Merchant;

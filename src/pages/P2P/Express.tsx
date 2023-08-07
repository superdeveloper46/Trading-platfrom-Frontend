import React from "react";
import { Helmet } from "react-helmet";

import ExpressForm from "components/P2P/Express/ExpressForm";
import styles from "styles/pages/P2P/OrderCreate.module.scss";

const Express = () => {
	const title = `P2P Express | ALP.COM`;

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
			<ExpressForm />
		</div>
	);
};

export default Express;

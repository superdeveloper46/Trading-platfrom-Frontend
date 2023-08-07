---
to: src/pages/<%=Name%>.tsx
---

<% Layout = layout[0].toUpperCase() + layout.slice(1) %>import React from "react";
import <%=Layout%>Layout from "layouts/<%= Layout %>Layout";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import styles from "styles/pages/<%=Name%>.module.scss";

const <%=Name%>: React.FC = () => {
		const { formatMessage } = useIntl();
	const title = `... | ALP.COM`;

	return (
		<<%=Layout%>Layout>
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
			<div className={styles.container}>{/* TODO */}</div>
		</<%=Layout%>Layout>
	)
};

export default <%=Name%>;

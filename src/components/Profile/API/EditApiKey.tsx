import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";
import { observer } from "mobx-react-lite";

import commonMessages from "messages/common";
import apiMessages from "messages/api";
import InternalLink from "components/InternalLink";
import styles from "styles/pages/ProfileAPI.module.scss";
import { useMst } from "models/Root";
import { getPageTitle } from "helpers/global";
import { routes } from "constants/routing";
import { EditApiKeyForm } from "./components";

const EditApiKey: React.FC = () => {
	const { formatMessage } = useIntl();
	const { tickers } = useMst();

	useEffect(() => {
		tickers.loadTickers();
	}, []);

	return (
		<>
			<Helmet title={getPageTitle(formatMessage(apiMessages.api_settings))} />
			<div className={styles.page_content_container}>
				<div className={styles.breadcrumbs}>
					<InternalLink to={routes.api.root}>
						<i className="ai ai-chevron_left" />
						{formatMessage(commonMessages.api)}
					</InternalLink>
					<span>Edit Api Key</span>
				</div>
				<EditApiKeyForm />
			</div>
		</>
	);
};

export default observer(EditApiKey);

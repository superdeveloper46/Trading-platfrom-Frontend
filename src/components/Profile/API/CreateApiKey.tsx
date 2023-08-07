import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";
import messages from "messages/api";
import { observer } from "mobx-react-lite";
import styles from "styles/pages/ProfileAPI.module.scss";
import { useMst } from "models/Root";
import { getPageTitle } from "helpers/global";
import { PageHeader, CreateApiKeyForm, ApiKeys } from "./components";

const CreateApiKey: React.FC = () => {
	const {
		global: { isAuthenticated },
		tickers,
		apiKeys,
	} = useMst();
	const { formatMessage } = useIntl();

	useEffect(() => {
		if (isAuthenticated) {
			apiKeys.getApiKeys();
			tickers.loadTickers();
		}
	}, [isAuthenticated]);

	return (
		<>
			<Helmet title={getPageTitle(formatMessage(messages.api_settings))} />
			<div className={styles.page_content_container}>
				<PageHeader />
				<CreateApiKeyForm />
				<ApiKeys />
			</div>
		</>
	);
};

export default observer(CreateApiKey);

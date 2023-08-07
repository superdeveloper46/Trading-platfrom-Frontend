import React from "react";
import { Route, Routes } from "react-router-dom";
import Helmet from "react-helmet";
import { useIntl } from "react-intl";

import SectionActions from "components/AlphaCodes/SectionActions";
import SectionTables from "components/AlphaCodes/SectionTables";
import messages from "messages/alpha_codes";
import SectionHistory from "components/AlphaCodes/SectionHistory";
import styles from "styles/pages/AlphaCodes.module.scss";
import ProfileLayout from "layouts/ProfileLayout";
import { SidebarMenuLevelsEnum } from "types/sidebarMenuLevels";
import { getPageTitle } from "helpers/global";
import WebSocket, { WSListenEventEnum } from "components/WebSocket";
import { URL_VARS } from "constants/routing";

const AlphaCodesHistory: React.FC = () => (
	<div className={styles.codes_wrapper}>
		<SectionHistory />
	</div>
);

const AlphaCodesDashboard: React.FC = () => (
	<div className={styles.codes_wrapper}>
		<SectionActions />
		<SectionTables />
	</div>
);

const AlphaCodes: React.FC = () => {
	const { formatMessage } = useIntl();
	const title = getPageTitle(formatMessage(messages.alpha_code));

	return (
		<ProfileLayout sidebarMenuLevel={SidebarMenuLevelsEnum.AlphaCodes}>
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
			<Routes>
				<Route path={URL_VARS.ROOT} element={<AlphaCodesDashboard />} />
				<Route path={URL_VARS.HISTORY} element={<AlphaCodesHistory />} />
			</Routes>
			<WebSocket events={[WSListenEventEnum.WALLETS]} />
		</ProfileLayout>
	);
};

export default AlphaCodes;

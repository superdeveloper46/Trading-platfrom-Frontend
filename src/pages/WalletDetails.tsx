import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { useIntl } from "react-intl";
import messages from "messages/finance";
import styles from "styles/pages/WalletDetails.module.scss";
import ProfileLayout from "layouts/ProfileLayout";
import { SidebarMenuLevelsEnum } from "types/sidebarMenuLevels";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";
import WebSocket, { WSListenEventEnum } from "components/WebSocket";
import useAutoFetch from "hooks/useAutoFetch";
import WalletDetailsCard from "components/Wallets/WalletDetailsCard";
import { getPageTitle } from "helpers/global";

const WalletDetails: React.FC = () => {
	const {
		account: { loadRates },
		finance: { loadMarginOptions },
		tickers: { loadTickers },
		global: { isWSDown },
	} = useMst();
	const { formatMessage } = useIntl();
	const title = getPageTitle(formatMessage(messages.my_wallet));

	useEffect(() => {
		loadTickers();
		loadRates();
		loadMarginOptions();
	}, []);

	useAutoFetch(loadTickers, isWSDown);

	return (
		<ProfileLayout sidebarMenuLevel={SidebarMenuLevelsEnum.Wallets}>
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
			<div className={styles.container}>
				<WalletDetailsCard />
			</div>
			<WebSocket events={[WSListenEventEnum.TICKERS, WSListenEventEnum.WALLETS]} />
		</ProfileLayout>
	);
};

export default observer(WalletDetails);

import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { useIntl } from "react-intl";
import messages from "messages/finance";
import styles from "styles/pages/Wallets.module.scss";
import ProfileLayout from "layouts/ProfileLayout";
import { SidebarMenuLevelsEnum } from "types/sidebarMenuLevels";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";
import WebSocket, { WSListenEventEnum } from "components/WebSocket";
import useWindowSize from "hooks/useWindowSize";
import { WalletsTable, WalletsBalance, WalletsMobile } from "components/Wallets";
import useAutoFetch from "hooks/useAutoFetch";
import { getPageTitle } from "helpers/global";

const Wallets: React.FC = () => {
	const {
		account: { loadRates },
		finance: { loadMarginOptions },
		tickers: { loadTickers },
		global: { isWSDown },
	} = useMst();
	const { formatMessage } = useIntl();
	const { tablet } = useWindowSize();
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
				<WalletsBalance />
				{tablet ? <WalletsMobile /> : <WalletsTable />}
			</div>
			<WebSocket events={[WSListenEventEnum.TICKERS, WSListenEventEnum.WALLETS]} />
		</ProfileLayout>
	);
};

export default observer(Wallets);

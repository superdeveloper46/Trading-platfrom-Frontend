import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import messages from "messages/common";
import styles from "styles/pages/Wallets.module.scss";
import ProfileLayout from "layouts/ProfileLayout";
import { SidebarMenuLevelsEnum } from "types/sidebarMenuLevels";
import { useMst } from "models/Root";
import WebSocket, { WSListenEventEnum } from "components/WebSocket";
import useWindowSize from "hooks/useWindowSize";
import useAutoFetch from "hooks/useAutoFetch";
import { getPageTitle } from "helpers/global";
import { FundingWalletBalance, FundingWalletTable } from "components/FundingWallet";
import { useBalances } from "services/P2PService";
import FundingTransferModal from "components/FundingWallet/FundingTransferModal";

const FundingWallet: React.FC = () => {
	const {
		account: { loadRates },
		finance: { loadMarginOptions },
		tickers: { loadTickers },
		global: { isWSDown },
	} = useMst();
	const { formatMessage } = useIntl();
	const title = getPageTitle(formatMessage(messages.funding_wallet));

	const [transferAsset, setTransferAsset] = useState("");
	const [isTransferModalOpened, toggleTransferModal] = useState(false);

	const { data: balances, isFetching: isBalancesLoading, refetch } = useBalances();

	useEffect(() => {
		loadTickers();
		loadRates();
		loadMarginOptions();
	}, []);

	useAutoFetch(loadTickers, isWSDown);

	const openTransferModal = (asset?: string) => {
		setTransferAsset(asset || "");
		toggleTransferModal(true);
	};

	return (
		<ProfileLayout sidebarMenuLevel={SidebarMenuLevelsEnum.FundingWallet}>
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
				<FundingWalletBalance openTransferModal={openTransferModal} />
				{/* {tablet ? ( */}
				{/*	<FundingWalletMobile /> */}
				{/* ) : ( */}
				<FundingWalletTable
					openTransferModal={openTransferModal}
					balances={balances}
					isBalancesLoading={isBalancesLoading}
				/>
				{/* )} */}
			</div>
			<FundingTransferModal
				asset={transferAsset}
				refetchFundingBalances={refetch}
				fundingBalances={balances || []}
				isOpen={isTransferModalOpened}
				onClose={() => toggleTransferModal(false)}
			/>
			<WebSocket events={[WSListenEventEnum.TICKERS, WSListenEventEnum.WALLETS]} />
		</ProfileLayout>
	);
};

export default observer(FundingWallet);

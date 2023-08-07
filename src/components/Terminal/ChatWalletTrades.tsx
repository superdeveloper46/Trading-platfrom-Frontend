import React, { useState } from "react";
import { useMst } from "models/Root";
import Tab from "components/UI/Tab";
import messages from "messages/exchange";
import styles from "styles/pages/Terminal.module.scss";
import { CHAT_WALLET_TRADES_CACHE_KEY } from "utils/cacheKeys";
import { ChatWalletsTradesEnum } from "types/exchange";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import useLocalStorage from "hooks/useLocalStorage";
import RecentTrades from "./RecentTrades";
import Wallets from "./Wallets";

const ChatWalletTrades: React.FC = () => {
	const {
		global: { isAuthenticated },
	} = useMst();
	const [cachedTab, setCachedTab] = useLocalStorage(
		CHAT_WALLET_TRADES_CACHE_KEY,
		ChatWalletsTradesEnum.TRADES,
	);
	const { formatMessage } = useIntl();
	const [activeTab, setActiveTab] = useState<ChatWalletsTradesEnum>(
		isAuthenticated ? cachedTab : ChatWalletsTradesEnum.TRADES,
	);

	const handleTabsChange = (name: string) => {
		setActiveTab(name as ChatWalletsTradesEnum);
		setCachedTab(name);
	};

	const renderTabContent = () => {
		switch (activeTab) {
			case ChatWalletsTradesEnum.TRADES:
				return <RecentTrades />;
			case ChatWalletsTradesEnum.WALLETS:
				return <Wallets />;
			default:
				return null;
		}
	};

	return (
		<div className={styles.widget}>
			<div className={styles.tabs}>
				<Tab
					name={ChatWalletsTradesEnum.TRADES}
					onClick={handleTabsChange}
					label={formatMessage(messages.recent_trades)}
					isActive={activeTab === ChatWalletsTradesEnum.TRADES}
				/>
				{isAuthenticated && (
					<Tab
						name={ChatWalletsTradesEnum.WALLETS}
						onClick={handleTabsChange}
						label={formatMessage(messages.wallets)}
						isActive={activeTab === ChatWalletsTradesEnum.WALLETS}
					/>
				)}
				{/* <Tab
					name={ChatWalletsTradesEnum.CHAT}
					onClick={handleTabsChange}
					label={formatMessage(messages.chat)}
					isActive={activeTab === ChatWalletsTradesEnum.CHAT}
				/> */}
			</div>
			{renderTabContent()}
		</div>
	);
};

export default observer(ChatWalletTrades);

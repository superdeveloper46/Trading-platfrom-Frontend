import React from "react";
import { useIntl } from "react-intl";
import styles from "styles/pages/TerminalMobile.module.scss";
import cn from "classnames";
import { TerminalMobileWidgetEnum } from "types/exchange";
import messages from "messages/exchange";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";
import Wallets from "./Wallets";
import RecentTrades from "./RecentTrades";
import Tickers from "./Tickers";
import TradeMobile from "./TradeMobile";

const TerminalMobile: React.FC = () => {
	const {
		terminal: { mobileActiveWidget, setMobileActiveWidget },
	} = useMst();

	const { formatMessage } = useIntl();

	const handleTabsChange = (e: React.SyntheticEvent<HTMLDivElement>): void => {
		const { name } = e.currentTarget.dataset;
		setMobileActiveWidget(name as TerminalMobileWidgetEnum);
	};

	const currentTabComponent = (name: TerminalMobileWidgetEnum) => {
		switch (name) {
			case TerminalMobileWidgetEnum.WALLETS:
				return <Wallets />;
			case TerminalMobileWidgetEnum.RECENT_TRADES:
				return <RecentTrades />;
			case TerminalMobileWidgetEnum.MARKETS:
				return <Tickers />;
			default:
				return <TradeMobile />;
		}
	};

	return (
		<div className={styles.mobile_container}>
			{currentTabComponent(mobileActiveWidget as TerminalMobileWidgetEnum)}
			<div className={styles.mobile_nav_tabs}>
				<div
					className={cn(
						styles.mobile_nav_tab,
						mobileActiveWidget === TerminalMobileWidgetEnum.MARKETS && styles.active,
					)}
					data-name={TerminalMobileWidgetEnum.MARKETS}
					onClick={handleTabsChange}
				>
					<i className="ai ai-bar_chart_3" />
					{formatMessage(messages.mobile_currency)}
				</div>
				<div
					className={cn(
						styles.mobile_nav_tab,
						mobileActiveWidget === TerminalMobileWidgetEnum.RECENT_TRADES && styles.active,
					)}
					data-name={TerminalMobileWidgetEnum.RECENT_TRADES}
					onClick={handleTabsChange}
				>
					<i className="ai ai-chart_outline_2" />
					{formatMessage(messages.mobile_deals)}
				</div>
				<div
					className={cn(
						styles.mobile_nav_tab,
						mobileActiveWidget === TerminalMobileWidgetEnum.TRADE && styles.active,
					)}
					data-name={TerminalMobileWidgetEnum.TRADE}
					onClick={handleTabsChange}
				>
					<i className="ai ai-trade-candle-01" />
					{formatMessage(messages.mobile_trade)}
				</div>
				<div
					className={cn(
						styles.mobile_nav_tab,
						mobileActiveWidget === TerminalMobileWidgetEnum.WALLETS && styles.active,
					)}
					data-name={TerminalMobileWidgetEnum.WALLETS}
					onClick={handleTabsChange}
				>
					<i className="ai ai-balance_outline" />
					{formatMessage(messages.mobile_wallets)}
				</div>
			</div>
		</div>
	);
};

export default observer(TerminalMobile);

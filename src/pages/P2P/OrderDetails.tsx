import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import cn from "classnames";
import { Helmet } from "react-helmet";

import Header from "components/P2P/OrderDetails/Header";
import OrderValues from "components/P2P/OrderDetails/OrderValues";
import PaymentDetails from "components/P2P/OrderDetails/PaymentDetails";
import FAQ from "components/P2P/OrderDetails/FAQ";
import styles from "styles/pages/P2P/OrderDetails.module.scss";
import { useMyUserDetails, useOrderDetails } from "services/P2PService";
import { URL_VARS } from "constants/routing";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { P2PSideEnum } from "types/p2p";
import { useMst } from "models/Root";
import Tabs, { INavItem } from "components/P2P/UserCenter/Tabs";
import useWindowSize from "hooks/useWindowSize";
import Chat from "components/P2P/OrderDetails/Chat";
import p2pMessages from "messages/p2p";
import { useIntl } from "react-intl";

enum TabsEnum {
	PaymentDetails = "payment-details",
	Chat = "chat",
}

const OrderDetails = () => {
	const { formatMessage } = useIntl();
	const title = `P2P ${formatMessage(p2pMessages.order_details)} | ALP.COM`;

	const { id = "" } = useParams<{ [URL_VARS.ID]: string }>();
	const { smallTablet } = useWindowSize();

	const [tab, setTab] = useState<TabsEnum>(TabsEnum.PaymentDetails);

	const {
		account: { isProfileStatusLoaded },
	} = useMst();

	const { data: orderDetails, refetch, isFetching } = useOrderDetails(id);
	const { data: userInfo, isFetching: isUserInfoLoading } = useMyUserDetails();

	const userSide: P2PSideEnum =
		orderDetails?.seller_profile.id === userInfo?.id ? P2PSideEnum.Sell : P2PSideEnum.Buy;

	const handleTabChange = (t: string) => {
		setTab(t as TabsEnum);
	};

	const flowNavItems: INavItem[] = [
		{
			id: TabsEnum.PaymentDetails,
			label: "Payment Details",
		},
		{
			id: TabsEnum.Chat,
			label: "Chat",
		},
	];

	return isFetching || !isProfileStatusLoaded || isUserInfoLoading ? (
		<LoadingSpinner />
	) : (
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
			<Header userSide={userSide} orderDetails={orderDetails} />
			<div className={styles.main_container}>
				<OrderValues orderDetails={orderDetails} />
				{smallTablet && (
					<Tabs
						tabClassName={styles.tab}
						navItems={flowNavItems}
						tab={tab}
						onChange={handleTabChange}
					/>
				)}
				<PaymentDetails
					className={cn({ [styles.hidden]: smallTablet && tab !== TabsEnum.PaymentDetails })}
					userSide={userSide}
					refetch={refetch}
					orderDetails={orderDetails}
				/>
				{orderDetails && (
					<Chat
						userId={userInfo?.id || -1}
						companionId={
							userSide === P2PSideEnum.Buy
								? orderDetails.seller_profile.id
								: orderDetails.buyer_profile.id
						}
						orderDetails={orderDetails}
						hidden={smallTablet && tab !== TabsEnum.Chat}
					/>
				)}
			</div>
			<FAQ />
		</div>
	);
};

export default observer(OrderDetails);

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";

import UserStats from "components/P2P/UserPage/UserStats";
import Tabs, { INavItem } from "components/P2P/UserCenter/Tabs";
import styles from "styles/pages/P2P/UserCenter.module.scss";
import Feedback from "components/P2P/UserCenter/Feedback";
import Ads from "components/P2P/UserPage/Ads";
import useParamQuery from "hooks/useSearchQuery";
import { queryVars } from "constants/query";
import { URL_VARS } from "constants/routing";
import { useUserDetails } from "services/P2PService";
import { getUrlParams } from "utils/filter";
import p2pMessages from "messages/p2p";

export type TTabType = typeof URL_VARS.ADS | typeof URL_VARS.FEEDBACK;

const UserDetails = () => {
	const { formatMessage } = useIntl();
	const title = `P2P ${formatMessage(p2pMessages.user_details)} | ALP.COM`;

	const { id = "" } = useParams<{ [URL_VARS.ID]: string }>();

	const navigate = useNavigate();
	const query = useParamQuery();
	const queryTab = query.get(queryVars.tab) || URL_VARS.ADS;

	const [tab, setTab] = useState<TTabType>(queryTab as TTabType);
	const { data: userInfo, isFetching, refetch } = useUserDetails(+id);

	const handleTabChange = (t: string) => {
		navigate({
			[queryVars.search]: getUrlParams({ [queryVars.tab]: t }),
		});
	};

	const flowNavItems: INavItem[] = [
		{
			id: URL_VARS.ADS,
			label: "Online Ads",
		},
		{
			id: URL_VARS.FEEDBACK,
			label: `Feedback (${
				(userInfo?.positive_feedback_count || 0) + (userInfo?.negative_feedback_count || 0)
			})`,
		},
	];

	const displayContent = (() => {
		switch (tab) {
			case URL_VARS.FEEDBACK:
				return (
					<Feedback
						negativeCount={userInfo?.negative_feedback_count || 0}
						positiveCount={userInfo?.positive_feedback_count || 0}
						id={+id}
					/>
				);
			case URL_VARS.ADS:
				return <Ads uid={id} />;
			default:
				return <Ads uid={id} />;
		}
	})();

	useEffect(() => {
		setTab(queryTab as TTabType);
	}, [queryTab]);

	return (
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
			<UserStats isLoading={isFetching} refetch={refetch} profileInfo={userInfo} />
			<Tabs
				containerClassName={styles.tabs}
				navItems={flowNavItems}
				tab={tab}
				onChange={handleTabChange}
			/>
			{displayContent}
		</div>
	);
};

export default UserDetails;

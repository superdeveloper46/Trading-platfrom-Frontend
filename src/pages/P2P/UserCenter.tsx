import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import UserStats from "components/P2P/UserCenter/UserStats";
import PaymentMethods from "components/P2P/UserCenter/PaymentMethods";
import Tabs, { INavItem } from "components/P2P/UserCenter/Tabs";
import Feedback from "components/P2P/UserCenter/Feedback";
import BlockedUsers from "components/P2P/UserCenter/BlockedUsers";
import styles from "styles/pages/P2P/UserCenter.module.scss";
import { useMyUserDetails, useMyVolumes } from "services/P2PService";
import { useMst } from "models/Root";
import useParamQuery from "hooks/useSearchQuery";
import { queryVars } from "constants/query";
import { URL_VARS } from "constants/routing";
import { getUrlParams } from "utils/filter";
import { useRatesUSDT } from "services/AccountService";
import { getPriceByRate } from "helpers/account";
import { RateAlgoPlanEnum } from "types/account";
import { IRateAlgo } from "models/Account";
import p2pMessages from "messages/p2p";
import { useIntl } from "react-intl";

const getUSDTAmount = (algoRate: IRateAlgo, quoteAmount: number): number => {
	const price = getPriceByRate(algoRate.type as RateAlgoPlanEnum, algoRate.rate, algoRate.rate);
	if (price !== 0) {
		return quoteAmount / price;
	}
	return 0;
};

export type TTabType =
	| typeof URL_VARS.PAYMENT_METHODS
	| typeof URL_VARS.FEEDBACK
	| typeof URL_VARS.BLOCKED_USERS;

const UserCenter = () => {
	const { formatMessage } = useIntl();

	const title = `P2P ${formatMessage(p2pMessages.user_center)} | ALP.COM`;

	const {
		account: { profileStatus },
	} = useMst();

	const navigate = useNavigate();
	const query = useParamQuery();
	const queryTab = query.get(queryVars.tab) || URL_VARS.PAYMENT_METHODS;

	const [tab, setTab] = useState<TTabType>(queryTab as TTabType);
	const { data: userInfo, isFetching: isUserInfoLoading } = useMyUserDetails();
	const { data: rates, isFetching: isRatesLoading } = useRatesUSDT();
	const { data: volumes, isFetching: isVolumesLoading } = useMyVolumes();

	const isLoading = isUserInfoLoading || isRatesLoading || isVolumesLoading;

	const handleTabChange = (t: string) => {
		navigate({
			[queryVars.search]: getUrlParams({ [queryVars.tab]: t }),
		});
	};

	const flowNavItems: INavItem[] = [
		{
			id: URL_VARS.PAYMENT_METHODS,
			label: "P2P Payment Methods",
		},
		{
			id: URL_VARS.FEEDBACK,
			label: `Feedback (${
				(userInfo?.positive_feedback_count || 0) + (userInfo?.negative_feedback_count || 0)
			})`,
		},
		{
			id: URL_VARS.BLOCKED_USERS,
			label: "Blocked Users",
		},
	];

	const allTimeUSDTVolume = useMemo(() => {
		if (!volumes || !rates) {
			return 0;
		}
		return volumes.reduce((total, volume) => {
			const [, quoteCurrency] = volume.symbol.split("_");
			const quoteRate = rates.find(({ currency }) => quoteCurrency === currency);

			if (quoteRate) {
				return total + getUSDTAmount(quoteRate, +volume.avg_price * +volume.amount);
			}

			return total;
		}, 0);
	}, [volumes, rates]);

	const monthUSDTVolume = useMemo(() => {
		if (!volumes || !rates) {
			return 0;
		}
		return volumes.reduce((total, volume) => {
			const [, quoteCurrency] = volume.symbol.split("_");
			const quoteRate = rates.find(({ currency }) => quoteCurrency === currency);

			if (quoteRate) {
				return total + getUSDTAmount(quoteRate, +volume.amount_30 * +volume.avg_price_30);
			}

			return total;
		}, 0);
	}, [volumes, rates]);

	const displayContent = (() => {
		switch (tab) {
			case URL_VARS.PAYMENT_METHODS:
				return <PaymentMethods />;
			case URL_VARS.FEEDBACK:
				return (
					<Feedback
						negativeCount={userInfo?.negative_feedback_count || 0}
						positiveCount={userInfo?.positive_feedback_count || 0}
						id={userInfo?.id || -1}
					/>
				);
			case URL_VARS.BLOCKED_USERS:
				return <BlockedUsers />;
			default:
				return <PaymentMethods />;
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
			<UserStats
				allTimeVolume={allTimeUSDTVolume}
				monthVolume={monthUSDTVolume}
				isLoading={isLoading}
				nickname={profileStatus?.username || ""}
				profileInfo={userInfo}
			/>
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

export default observer(UserCenter);

import React, { useState } from "react";
import { useIntl } from "react-intl";

import styles from "styles/pages/P2P/UserCenter.module.scss";
import { useAds } from "services/P2PService";
import { P2PSideEnum } from "types/p2p";
import { queryVars } from "constants/query";
import LoadingSpinner from "components/UI/LoadingSpinner";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import p2pMessages from "messages/p2p";
import NewPagination from "components/UI/NewPagination";
import Ad from "../Ad";

const PAGE_SIZE = 2;

interface IProps {
	uid: string;
}

const Ads: React.FC<IProps> = ({ uid }) => {
	const { formatMessage } = useIntl();

	const [pageToBuy, setPageToBuy] = useState(1);
	const [pageToSell, setPageToSell] = useState(1);

	const { data: adsToBuy, isFetching: isOrdersToBuyLoading } = useAds({
		[queryVars.owner]: uid,
		[queryVars.side]: P2PSideEnum.Sell,
		[queryVars.page_size]: PAGE_SIZE,
		[queryVars.page]: pageToBuy,
	});

	const { data: adsToSell, isFetching: isOrdersToSellLoading } = useAds({
		[queryVars.owner]: uid,
		[queryVars.side]: P2PSideEnum.Buy,
		[queryVars.page_size]: PAGE_SIZE,
		[queryVars.page]: pageToSell,
	});

	return (
		<div className={styles.ads_container}>
			{isOrdersToBuyLoading ? (
				<LoadingSpinner />
			) : adsToBuy && adsToBuy.results.length ? (
				<>
					<span className={styles.ads_title}>{formatMessage(p2pMessages.buy_from_user)}</span>
					<div className={styles.ads_list}>
						{adsToBuy.results.map((ad, i) => (
							<Ad isUserPage key={i} ad={ad} />
						))}
					</div>
					{adsToBuy && adsToBuy.results.length && adsToBuy.count > PAGE_SIZE ? (
						<div className={p2pStyles.pagination_container}>
							<NewPagination
								count={Math.ceil(adsToBuy.count / PAGE_SIZE)}
								page={pageToBuy}
								onChange={setPageToBuy}
							/>
						</div>
					) : null}
				</>
			) : null}
			{isOrdersToSellLoading ? (
				<LoadingSpinner />
			) : adsToSell && adsToSell.results.length ? (
				<>
					<span className={styles.ads_title}>{formatMessage(p2pMessages.sell_to_user)}</span>
					<div className={styles.ads_list}>
						{adsToSell.results.map((ad, i) => (
							<Ad isUserPage key={i} ad={ad} />
						))}
					</div>
					{adsToSell && adsToSell.results.length && adsToSell.count > PAGE_SIZE ? (
						<div className={p2pStyles.pagination_container}>
							<NewPagination
								count={Math.ceil(adsToSell.count / PAGE_SIZE)}
								page={pageToSell}
								onChange={setPageToSell}
							/>
						</div>
					) : null}
				</>
			) : null}
		</div>
	);
};

export default Ads;

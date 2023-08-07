import React, { useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router";

import subStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import accountMessages from "messages/account";
import { BalanceDetailsTable, Header } from "components/SubAccounts/BalanceDetails";
import { useMst } from "models/Root";
import { getPageTitle } from "helpers/global";
import {
	useCrossSubAccBalances,
	useIsolatedSubAccBalances,
	useSubAccWallets,
} from "services/SubAccountsService";
import { IRate, IRateAlgo } from "models/Account";
import { convertRatePrice } from "helpers/account";
import {
	ICrossBalanceExtended,
	IIsolatedBalanceExtended,
	IWalletExtended,
} from "components/SubAccounts/BalanceDetails/BalanceDetailsTable/BalanceDetailsTable";

const BalanceDetails: React.FC = () => {
	const { formatMessage } = useIntl();

	const {
		account: { loadRates, rates },
		tickers: { list: tickerList, loadTickers },
		subAccounts: { getBalances },
		finance: { loadMarginOptions },
	} = useMst();

	const { uid } = useParams<{ uid: string }>();

	const {
		isFetching: isSpotLoading,
		data: spotBalances,
		refetch: refetchSpot,
	} = useSubAccWallets(uid || "");
	const {
		isFetching: isCrossLoading,
		data: crossBalances,
		refetch: refetchCross,
	} = useCrossSubAccBalances(uid || "");
	const {
		isFetching: isIsolatedLoading,
		data: isolatedBalances,
		refetch: refetchIsolated,
	} = useIsolatedSubAccBalances(uid || "");

	const refetchAllBalances = () => {
		refetchSpot();
		refetchCross();
		refetchIsolated();
	};

	const isBalancesLoading = useMemo(
		() => isSpotLoading || isCrossLoading || isIsolatedLoading,
		[isSpotLoading, isCrossLoading, isIsolatedLoading],
	);

	const getValuatedBalances = (
		balances: IIsolatedBalanceExtended[] | ICrossBalanceExtended[] | IWalletExtended[],
	) => {
		const nextBalances = [...balances];

		rates.forEach((rate: IRate) => {
			rate.rates.forEach((plan: IRateAlgo) => {
				const price = convertRatePrice(plan, tickerList);
				const filteredBalances = nextBalances.filter((w) => w.code === plan.currency);
				filteredBalances.forEach((w) => {
					w.valuation = {
						...w.valuation,
						[rate.currency]: price,
					};
				});
			});
		});

		return nextBalances;
	};

	const formattedSpotBalances: IWalletExtended[] = useMemo(() => {
		if (spotBalances?.length && rates.length && tickerList.length) {
			return getValuatedBalances(spotBalances) as IWalletExtended[];
		}
		return [];
	}, [spotBalances, rates.length, tickerList.length]);

	const formattedCrossBalances: ICrossBalanceExtended[] = useMemo(() => {
		if (crossBalances?.length && rates.length && tickerList.length) {
			const nextBalances: ICrossBalanceExtended[] = crossBalances.filter(
				({ balance, reserve }) => +balance - +reserve > 0,
			);

			return getValuatedBalances(nextBalances) as ICrossBalanceExtended[];
		}
		return [];
	}, [crossBalances, rates.length, tickerList.length]);

	const formattedIsolatedBalances = useMemo(() => {
		if (isolatedBalances?.length && rates.length && tickerList.length) {
			const valuatedBalances = getValuatedBalances(isolatedBalances) as IIsolatedBalanceExtended[];
			const pairedBalances: IIsolatedBalanceExtended[] = [];

			const uniqueIsolatedPairs = Array.from(new Set(valuatedBalances.map((b) => b.pair)));
			uniqueIsolatedPairs.forEach((pair?: string) => {
				if (pair) {
					const nextBalancesIsolated = valuatedBalances.filter((b) => b.pair === pair);
					if (nextBalancesIsolated.length) {
						const b = nextBalancesIsolated[0];
						const paired = nextBalancesIsolated[1];

						const [, quoteCurrencyCode] = pair.split("/");
						const isQuoted = quoteCurrencyCode === paired.code;

						pairedBalances.push({
							...b,
							available: +(b.balance || 0) - +(b.reserve || 0),
							debt: +(b.borrowed || 0) + +(b.interest || 0),
							paired_balance: {
								...paired,
								available: +(paired.balance || 0) - +(paired.reserve || 0),
								debt: +(paired.borrowed || 0) + +(paired.interest || 0),
								is_quoted: isQuoted,
							},
						});
					}
				}
			});

			return pairedBalances.filter(
				({ available, debt, paired_balance }) =>
					available > 0 || debt || paired_balance.available > 0,
			);
		}
		return [];
	}, [isolatedBalances, rates.length, tickerList.length]);

	useEffect(() => {
		getBalances();
		loadTickers();
		loadRates();
		loadMarginOptions();
	}, []);

	return (
		<>
			<Helmet title={getPageTitle(formatMessage(accountMessages.balance_details))} />
			<div className={subStyles.container}>
				<Header
					spotBalances={formattedSpotBalances}
					crossBalances={formattedCrossBalances}
					isolatedBalances={isolatedBalances || []}
					uid={uid || ""}
				/>
				<BalanceDetailsTable
					refetchAllBalances={refetchAllBalances}
					spotBalances={formattedSpotBalances}
					crossBalances={formattedCrossBalances}
					formattedIsolatedBalances={formattedIsolatedBalances}
					isolatedBalances={isolatedBalances || []}
					uid={uid || ""}
					isBalancesLoading={isBalancesLoading}
				/>
			</div>
		</>
	);
};

export default observer(BalanceDetails);

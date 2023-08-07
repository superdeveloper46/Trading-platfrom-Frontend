import React from "react";
import NoRowsMessage from "components/Table/NoRowsMessage";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { formatWallets, moveValuableToTop } from "helpers/wallets";
import financeMessages from "messages/finance";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";
import { useIntl } from "react-intl";
import styles from "styles/pages/Wallets.module.scss";
import { AccountTypeEnum } from "types/account";
import CheckBox from "components/UI/CheckBox";
import Filters from "../Filters";
import Tabs from "../Tabs";
import WalletsMobileCard from "./WalletsMobileCard";

const WalletsMobile: React.FC = () => {
	const {
		finance: { walletsFilter, isBalancesVisible, crossMarginOption },
		account: { balancesCross, balancesIsolated, isBalancesLoaded, getWalletBalancesByType },
	} = useMst();
	const { formatMessage } = useIntl();

	const currentBalances = getWalletBalancesByType(walletsFilter.accountType as AccountTypeEnum);
	const filteredBalances = formatWallets(
		currentBalances,
		walletsFilter,
		crossMarginOption ?? null,
		balancesCross,
		balancesIsolated,
	);

	const handleChangeNotEmpty = () => {
		walletsFilter.setNotEmpty(!walletsFilter.notEmpty);
	};

	let balancesToShow = walletsFilter.showFiltered ? filteredBalances : currentBalances;

	if (walletsFilter.accountType === AccountTypeEnum.SPOT) {
		balancesToShow = moveValuableToTop(balancesToShow);
	}

	return (
		<div className={styles.mobile_container}>
			<div className={styles.fixed_content}>
				<Tabs />
				<Filters />
				<div className={styles.mobile_table_header}>
					<div className={styles.filter_checkbox}>
						<CheckBox
							name="show_all"
							checked={walletsFilter.notEmpty}
							onChange={handleChangeNotEmpty}
						>
							{formatMessage(financeMessages.hide_empty_balances)}
						</CheckBox>
					</div>
					<div className={styles.mobile_table_subtitle}>
						<span>{formatMessage(financeMessages.available)}</span>
						<span>/{formatMessage(financeMessages.reserve)}</span>
					</div>
				</div>
			</div>
			<div className={styles.mobile_list}>
				{!isBalancesLoaded ? (
					<LoadingSpinner />
				) : balancesToShow.length > 0 ? (
					balancesToShow.map((b, idx) => (
						<WalletsMobileCard
							key={idx}
							balance={b}
							isBalancesVisible={isBalancesVisible}
							type={walletsFilter.accountType as AccountTypeEnum}
						/>
					))
				) : (
					<NoRowsMessage />
				)}
			</div>
		</div>
	);
};

export default observer(WalletsMobile);

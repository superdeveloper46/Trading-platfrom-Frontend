import React, { useMemo } from "react";
import { useIntl } from "react-intl";

import subAccountMessages from "messages/sub_accounts";
import { TableData, TableRow } from "components/UI/Table";
import { FORMAT_NUMBER_OPTIONS_BTC } from "constants/format";
import { AlignEnum } from "components/UI/Table/Table";
import InternalLink from "components/InternalLink";
import styles from "styles/pages/SubAccounts/Balances.module.scss";
import subAccountsStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import walletsStyles from "styles/pages/Wallets.module.scss";
import { queryVars } from "constants/query";
import { IWalletExtended } from "./BalanceDetailsTable";

interface Props {
	masterUid: string;
	uid: string;
	wallet: IWalletExtended;
}

const BalanceTableRow: React.FC<Props> = ({ wallet, uid, masterUid }) => {
	const { formatMessage, formatNumber } = useIntl();

	const balance = +wallet.balance;
	const available = +wallet.available;
	const reserve = +wallet.reserve;

	const balanceInBTC = useMemo(
		() =>
			wallet.valuation && wallet.valuation.BTC
				? formatNumber((wallet.valuation.BTC ?? 0) * +wallet.balance, FORMAT_NUMBER_OPTIONS_BTC)
				: "--",
		[wallet.valuation],
	);

	return (
		<TableRow className={subAccountsStyles.table_row} common>
			<TableData width="150px">
				<div className={walletsStyles.currency_value}>
					{wallet.image_svg || wallet.image_png ? (
						<img
							src={wallet.image_svg || wallet.image_png || ""}
							alt={wallet.code}
							width="24"
							height="24"
							loading="lazy"
						/>
					) : (
						<i className={`ai ai-${wallet.code?.toLowerCase()}`} />
					)}
					<span>
						<b>{wallet.code ?? "-"}</b>
						{wallet.name}
					</span>
				</div>
			</TableData>
			<TableData align={AlignEnum.Right} width="150px">
				{balance > 0
					? formatNumber(balance, {
							useGrouping: false,
							maximumFractionDigits: 8,
					  })
					: "--"}
			</TableData>
			<TableData align={AlignEnum.Right} width="150px">
				{available > 0
					? formatNumber(available, {
							useGrouping: false,
							maximumFractionDigits: 8,
					  })
					: "--"}
			</TableData>
			<TableData align={AlignEnum.Right} width="150px">
				{reserve > 0
					? formatNumber(reserve, {
							useGrouping: false,
							maximumFractionDigits: 8,
					  })
					: "--"}
			</TableData>
			<TableData align={AlignEnum.Right} width="150px">
				{balanceInBTC}
			</TableData>
			<TableData width="60px" maxWidth="60px" />
			<TableData width="200px">
				<div className={styles.table_data_transfer}>
					<InternalLink
						to={`/profile/sub-account/transfer?${queryVars.in}=${uid}&${queryVars.out}${queryVars.in}=${masterUid}&${queryVars.currency}=${wallet.code}`}
					>
						<span>{formatMessage(subAccountMessages.transfer)}</span>
					</InternalLink>
				</div>
			</TableData>
		</TableRow>
	);
};

export default BalanceTableRow;

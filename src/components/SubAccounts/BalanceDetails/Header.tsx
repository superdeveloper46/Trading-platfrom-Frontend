import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";

import subAccStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import styles from "styles/pages/SubAccounts/Balances.module.scss";
import walletsStyles from "styles/pages/Wallets.module.scss";
import subAccountMessages from "messages/sub_accounts";
import transfersMessages from "messages/transfers";
import { useMst } from "models/Root";
import { IIsolatedSubAccountBalance, ISubAccount, SubAccountTypeEnum } from "types/subAccounts";
import SubAccountService from "services/SubAccountsService";
import InternalLink from "components/InternalLink";
import Button from "components/UI/Button";
import styleProps from "utils/styleProps";
import MarginLevel from "components/MarginLevel";
import useParamQuery from "hooks/useSearchQuery";
import useMarginLevel, { reduceBalance } from "hooks/useMarginLevel";
import { AccountTypeEnum } from "types/account";
import useRiskLevelRate from "hooks/useRiskLevelRate";
import { IBalance } from "models/Account";
import { FORMAT_NUMBER_OPTIONS_BTC, FORMAT_NUMBER_OPTIONS_USD } from "constants/format";
import { queryVars } from "constants/query";
import { routes, URL_VARS } from "constants/routing";
import useCopyClick from "hooks/useCopyClick";
import { ICrossBalanceExtended, IWalletExtended } from "./BalanceDetailsTable/BalanceDetailsTable";

interface IProps {
	spotBalances: IWalletExtended[];
	crossBalances: ICrossBalanceExtended[];
	isolatedBalances: IIsolatedSubAccountBalance[];
	uid: string;
}

const Header: React.FC<IProps> = ({
	// isBalancesLoading,
	crossBalances,
	spotBalances,
	isolatedBalances,
	uid,
}) => {
	const { formatMessage, formatNumber } = useIntl();
	const copyClick = useCopyClick();
	const {
		subAccounts: { balances },
		finance: { crossMarginOption },
	} = useMst();

	const query = useParamQuery();
	const queryType: SubAccountTypeEnum =
		(query.get(queryVars.type) as SubAccountTypeEnum) || SubAccountTypeEnum.Spot;

	const isMargin = [SubAccountTypeEnum.Cross, SubAccountTypeEnum.Isolated].includes(queryType);
	const isMarginCross = queryType === SubAccountTypeEnum.Cross;

	const [subAccount, setSubAccount] = useState<ISubAccount>();

	const subAccountBalance = useMemo(
		() => balances.find((acc) => acc.uid === uid),
		[balances.length, uid],
	);

	const handleCopySubAccount = () => {
		copyClick(subAccount?.uid || "");
	};

	const currentOption = queryType === SubAccountTypeEnum.Cross ? crossMarginOption : null;

	const { marginLevel, totalBTC, totalUSDT, totalDebtBTC, totalDebtUSDT } = useMarginLevel(
		currentOption?.equity_currency?.code ?? "",
		crossBalances as unknown as IBalance[],
		isolatedBalances as unknown as IBalance[],
		queryType as unknown as AccountTypeEnum,
	);

	const totalSpotBalanceBTC = reduceBalance(spotBalances as unknown as IBalance[], "BTC");
	const totalSpotBalanceUSDT = reduceBalance(spotBalances as unknown as IBalance[], "USDT");

	const totalBalanceBTC = isMargin ? totalBTC : totalSpotBalanceBTC;
	const totalBalanceUSDT = isMargin ? totalUSDT : totalSpotBalanceUSDT;

	const riskLevel = crossMarginOption
		? useRiskLevelRate(marginLevel, [
				crossMarginOption.transfer_level,
				crossMarginOption.borrow_level,
				crossMarginOption.call_level,
		  ])
		: 0;

	const TotalDebt = (
		<div className={walletsStyles.total_debt}>
			<span>Total Debt</span>
			<span>
				{formatNumber(totalDebtBTC, FORMAT_NUMBER_OPTIONS_BTC)}
				&nbsp;BTC
				<span>
					≈
					<i className="ai ai-usd" />
					{formatNumber(totalDebtUSDT, FORMAT_NUMBER_OPTIONS_USD)}
				</span>
			</span>
		</div>
	);

	useEffect(() => {
		if (uid) {
			SubAccountService.getSubAccount(uid).then((acc) => {
				setSubAccount(acc);
			});
		}
	}, [uid]);

	return (
		<div className={cn(subAccStyles.header, subAccStyles.balance, styles.details_header)}>
			<div className={subAccStyles.header_title_container}>
				<div className={styles.header_title_container}>
					<h1 style={styleProps({ margin: "0 25px 0 0" })}>{subAccount?.login}</h1>
					<div className={styles.page_header_title_info}>
						<span>User ID: {subAccount?.uid}</span>
						<i
							className={cn(subAccStyles.copy_btn, "ai ai-copy_new")}
							onClick={handleCopySubAccount}
						/>
					</div>
					<div className={styles.page_header_title_info}>
						<span>{subAccount?.email}</span>
					</div>
				</div>
				<div className={styles.approximate_item}>
					<span>{formatMessage(subAccountMessages.sub_acc_balance_of_account)}</span>
					<div className={styles.approximate_item_value}>
						<i className="ai ai-btc" />
						<b>
							{subAccountBalance
								? formatNumber(totalBalanceBTC, {
										useGrouping: false,
										maximumFractionDigits: 8,
										minimumFractionDigits: 8,
								  })
								: "--"}
							&nbsp;≈
						</b>
						&nbsp;
						<span>
							<i className="ai ai-usd" />
							{subAccountBalance
								? formatNumber(totalBalanceUSDT, {
										useGrouping: false,
										maximumFractionDigits: 8,
										minimumFractionDigits: 8,
								  })
								: "--"}
						</span>
					</div>
				</div>
			</div>
			{isMargin && (
				<div className={cn(walletsStyles.advanced_info_container, styles.header_margin_info)}>
					{isMarginCross && (
						<MarginLevel percentage={riskLevel * 100} marginLevel={marginLevel} inline />
					)}
					{TotalDebt}
				</div>
			)}
			<div className={styles.details_header_controls}>
				<span>
					{formatMessage(subAccountMessages.sub_acc_subacc_created_at)}{" "}
					{dayjs(subAccount?.created_at).utc().format("DD/MM/YY HH:mm:ss")}
				</span>
				<InternalLink to={routes.subAccounts.getApiDetails(subAccount?.uid || "")}>
					{formatMessage(subAccountMessages.sub_acc_api_setup)}
				</InternalLink>
				<InternalLink to={routes.subAccounts.getTransferQuery({ [URL_VARS.OUT]: subAccount?.uid })}>
					<Button
						variant="filled"
						label={formatMessage(transfersMessages.create_transfer)}
						color="primary"
						fontVariant="bold"
						fullWidth
						mini
					/>
				</InternalLink>
			</div>
		</div>
	);
};

export default observer(Header);

import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import Tabs from "components/UI/Tabs";
import { useMst } from "models/Root";
import messages from "messages/finance";
import commonMessages from "messages/common";
import { AccountTypeEnum } from "types/account";
import styles from "styles/pages/Wallets.module.scss";
import InternalLink from "components/InternalLink";
import visaMasterCardImg from "assets/images/common/visa_mastercard.svg";
import Tab from "components/UI/Tab";
import useParamQuery from "hooks/useSearchQuery";
import { queryVars } from "constants/query";
import { routes } from "constants/routing";

const WalletsTabs: React.FC = () => {
	const {
		global: { isAuthenticated },
		finance: { walletsFilter, setWalletsFilter },
		account: { profileStatus },
		render,
	} = useMst();
	const { formatMessage } = useIntl();
	const navigate = useNavigate();
	const query = useParamQuery();

	useEffect(() => {
		const type = query.get(queryVars.type) as AccountTypeEnum;
		if (
			type &&
			[AccountTypeEnum.SPOT, AccountTypeEnum.CROSS, AccountTypeEnum.ISOLATED].includes(type)
		) {
			walletsFilter.setAccountType(type);
		}
	}, []);

	const handleTabChange = (name: string) => {
		if (name && name !== walletsFilter.accountType) {
			setWalletsFilter({
				...walletsFilter,
				accountType: name,
				sort:
					name === AccountTypeEnum.CROSS
						? "code.asc"
						: name === AccountTypeEnum.ISOLATED
						? "pair.asc"
						: "",
			});
			navigate({ [queryVars.search]: `?${queryVars.type}=${name}` });
		}
	};

	return (
		<Tabs className={styles.tabs}>
			<Tab
				name={AccountTypeEnum.SPOT}
				isActive={walletsFilter.accountType === AccountTypeEnum.SPOT}
				className={styles.tab}
				onClick={handleTabChange}
				label={formatMessage(messages.main_spot)}
			/>
			{render.margin && (
				<>
					<Tab
						name={AccountTypeEnum.CROSS}
						isActive={walletsFilter.accountType === AccountTypeEnum.CROSS}
						className={styles.tab}
						onClick={handleTabChange}
						label={formatMessage(messages.cross_margin)}
					/>
					<Tab
						name={AccountTypeEnum.ISOLATED}
						isActive={walletsFilter.accountType === AccountTypeEnum.ISOLATED}
						className={styles.tab}
						onClick={handleTabChange}
						label={formatMessage(messages.isolated_margin)}
					/>
				</>
			)}
			{!render.buyCrypto || (isAuthenticated && profileStatus?.is_sub_account) ? null : (
				<InternalLink className={styles.buy_crypto} to={routes.buyCrypto.getPair("USD_BTC")} blank>
					<span>{formatMessage(commonMessages.buy_crypto)}</span>
					<img src={visaMasterCardImg} width="70" height="14" alt="Visa / MasterCard" />
					<i className="ai ai-chevron_right" />
				</InternalLink>
			)}
		</Tabs>
	);
};

export default observer(WalletsTabs);

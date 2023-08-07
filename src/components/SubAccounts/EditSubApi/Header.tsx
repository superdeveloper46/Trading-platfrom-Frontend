import React from "react";
import { useIntl } from "react-intl";
import dayjs from "dayjs";
import cn from "classnames";

import subAccStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import accountMessages from "messages/account";
import subAccountMessages from "messages/sub_accounts";
import { ISubApi } from "types/subAccounts";
import Button from "components/UI/Button";
import styles from "styles/pages/SubAccounts/ApiManagement.module.scss";
import apiStyles from "styles/components/Profile/Dashboard/DashboardApi.module.scss";
import Tooltip from "components/UI/Tooltip";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { ellipsisInsideWord } from "utils/format";
import { routes } from "constants/routing";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import useCopyClick from "hooks/useCopyClick";

interface IProps {
	subApiKeyDetails?: ISubApi;
	isLoading?: boolean;
}

const Header: React.FC<IProps> = ({ subApiKeyDetails, isLoading }) => {
	const { formatMessage } = useIntl();
	const localeNavigate = useLocaleNavigate();
	const copyClick = useCopyClick();

	const handleCopyKey = () => {
		copyClick(subApiKeyDetails?.key || "");
	};

	const handleSeeAllBtnClick = () => {
		localeNavigate(routes.subAccounts.apiManagement);
	};

	return (
		<div className={cn(subAccStyles.header, subAccStyles.api_details)}>
			{isLoading ? (
				<LoadingSpinner noMargin />
			) : (
				<>
					<div className={styles.header_main_info}>
						<div className={styles.account_info}>
							<span className={styles.account_title}>{subApiKeyDetails?.sub_account.login}</span>
							<span className={styles.account_secondary_title}>
								{subApiKeyDetails?.sub_account.email}
							</span>
						</div>
						<div className={styles.header_api_info}>
							<div className={styles.api_key_info}>
								<span className={styles.api_key_info_title}>
									{formatMessage(subAccountMessages.sub_acc_api_key_label)}:
								</span>
								<span className={styles.api_key_info_value}>{subApiKeyDetails?.label}</span>
							</div>
							<div className={styles.api_key_info}>
								<span className={styles.api_key_info_title}>
									{formatMessage(accountMessages.subaccount_api_public_key_label)}:
								</span>
								<span
									className={cn(styles.api_key_info_value, apiStyles.api_key_value)}
									onClick={handleCopyKey}
									title={subApiKeyDetails?.key}
								>
									{ellipsisInsideWord(subApiKeyDetails?.key || "")}
								</span>
							</div>
							<div className={styles.api_key_info}>
								<span className={styles.api_key_info_title}>
									{formatMessage(accountMessages.subaccount_api_secret_key_label)}
									<Tooltip
										id="hint_api"
										hint
										text={formatMessage(subAccountMessages.sub_acc_cant_see_api_more_than_1)}
									/>
								</span>
								<span className={styles.api_key_info_value}>** *** *** ***</span>
							</div>
						</div>
					</div>
					<div className={styles.account_meta}>
						<div className={styles.last_action}>
							{subApiKeyDetails?.used_at ? (
								<>
									{formatMessage(accountMessages.subaccount_last_activity)}{" "}
									{dayjs(subApiKeyDetails?.used_at).utc().format("DD/MM/YY HH:mm:ss")}
								</>
							) : (
								<>
									{formatMessage(accountMessages.subaccount_subapi_created_at)}{" "}
									{dayjs(subApiKeyDetails?.created_at).utc().format("DD/MM/YY HH:mm:ss")}
								</>
							)}
						</div>
						<Button
							className={styles.see_more_apis_btn}
							variant="filled"
							color="primary"
							fullWidth
							onClick={handleSeeAllBtnClick}
							label={formatMessage(subAccountMessages.sub_acc_see_all_apis)}
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default Header;

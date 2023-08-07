import React from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import financeMessages from "messages/finance";
import styles from "styles/components/DepositWithdrawal.module.scss";
import useWindowSize from "hooks/useWindowSize";
import { useMst } from "models/Root";
import InternalLink from "components/InternalLink";
import CircleProgress from "components/UI/CircleProgress";
import { routes } from "constants/routing";

const INTL_DEFAULT_NUMBER_PARAMS = {
	useGrouping: false,
	maximumFractionDigits: 8,
};

const LimitInfo: React.FC = () => {
	const {
		account: { profileStatus },
		withdrawal: { withdraw_limit },
	} = useMst();
	const { mobile } = useWindowSize();
	const desktop = !mobile;

	const { formatMessage, formatNumber } = useIntl();
	if (!withdraw_limit) return null;
	const quota = parseFloat(withdraw_limit.quota?.replace(",", ".")) ?? 0;
	const usedFromQuota = parseFloat(withdraw_limit.used?.replace(",", ".")) ?? 0;
	const usedFromQuotaInPercentage = usedFromQuota && quota ? (usedFromQuota / quota) * 100 : 0;
	const progressPercentage = formatNumber(usedFromQuotaInPercentage, {
		maximumFractionDigits: 2,
		useGrouping: false,
	});

	const WithDeviceContainer: React.FC<{ children: React.ReactNode }> = ({
		children,
	}): JSX.Element => <div className={desktop ? "" : styles.mobile_limit_container}>{children}</div>;

	const LimitReached = () => (
		<WithDeviceContainer>
			<div className={styles.limit_reached_icon}>
				<i className="ai ai-cancel_mini" />
			</div>
			<span className={styles.limit_info_label}>
				{formatMessage(financeMessages.withdraw_unavailable)}
			</span>
			<span className={styles.limit_info_value}>
				{formatMessage(financeMessages.used_of_quota, {
					used: formatNumber(usedFromQuota, INTL_DEFAULT_NUMBER_PARAMS),
					quota: formatNumber(quota, INTL_DEFAULT_NUMBER_PARAMS),
				})}
				&nbsp;{withdraw_limit.currency ?? ""}
			</span>
			{!profileStatus?.is_sub_account &&
				withdraw_limit.verification_level < withdraw_limit.extend_verification_level && (
					<>
						<InternalLink to={routes.verification.root} className={styles.pass_kyc_button_link}>
							{formatMessage(financeMessages.pass_kyc)}
						</InternalLink>
						<div className={styles.limit_increase}>
							{formatMessage(financeMessages.withdraw_verification_level, {
								verification_link: profileStatus?.is_sub_account ? (
									formatMessage(financeMessages.verification)
								) : (
									<InternalLink to={routes.verification.root}>
										{formatMessage(financeMessages.verification)}
									</InternalLink>
								),
								level: withdraw_limit.extend_verification_level ?? "...",
							})}
						</div>
					</>
				)}
		</WithDeviceContainer>
	);

	const LimitAvailable = () => (
		<WithDeviceContainer>
			{desktop ? (
				<div className={styles.limit_progress}>
					<CircleProgress
						sqSize={56}
						percentage={parseFloat(progressPercentage.replace(",", "."))}
						strokeWidth={4.5}
						color="blue"
						fontStyle={{
							fontSize: "12px",
							fontWeight: "normal",
						}}
					/>
				</div>
			) : (
				<div className={styles.mobile_progress_container}>
					<div className={styles.mobile_progress_info}>
						<span className={styles.mobile_progress_percentage}>{progressPercentage}%</span>
						<span className={styles.limit_info_value}>
							{formatMessage(financeMessages.used_of_quota, {
								used: formatNumber(usedFromQuota, INTL_DEFAULT_NUMBER_PARAMS),
								quota: formatNumber(quota, INTL_DEFAULT_NUMBER_PARAMS),
							})}
							&nbsp;{withdraw_limit.currency}
						</span>
					</div>
					<div className={styles.mobile_progress_indicator}>
						<div
							className={styles.mobile_progress_indicator_scale}
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
				</div>
			)}
			<div className={styles.limit_info_label}>
				{formatMessage(financeMessages.withdraw_used_limit)}
			</div>
			{desktop && (
				<div className={styles.limit_info_value}>
					{formatMessage(financeMessages.used_of_quota, {
						used: formatNumber(usedFromQuota, INTL_DEFAULT_NUMBER_PARAMS),
						quota: formatNumber(quota, INTL_DEFAULT_NUMBER_PARAMS),
					})}
					&nbsp;{withdraw_limit.currency}
				</div>
			)}
			{withdraw_limit.verification_level < withdraw_limit.extend_verification_level && (
				<div className={cn(styles.limit_increase, styles.with_margin)}>
					{formatMessage(financeMessages.withdraw_verification_level, {
						verification_link: profileStatus?.is_sub_account ? (
							formatMessage(financeMessages.verification)
						) : (
							<InternalLink to={routes.verification.root}>
								{formatMessage(financeMessages.verification)}
							</InternalLink>
						),
						level: withdraw_limit.extend_verification_level ?? "...",
					})}
				</div>
			)}
		</WithDeviceContainer>
	);

	return parseFloat(progressPercentage.replace(",", ".")) >= 100 ? (
		<LimitReached />
	) : (
		<LimitAvailable />
	);
};

export default observer(LimitInfo);

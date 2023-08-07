import classnames from "classnames";
import React from "react";
import { useIntl } from "react-intl";
import dayjs from "dayjs";

import { IProfileStatus } from "models/Account";
import styles from "styles/components/Profile/Dashboard/DashboardProfile.module.scss";
import { IS_WINDOW_AVAILABLE } from "utils/constants";
import styleProps from "utils/styleProps";
import commonMessages from "messages/common";
import accountMessages from "messages/account";
import ButtonMicro from "components/UI/ButtonMicro";
import { useTradingFees } from "services/TradingFeesService";
import { useSessions } from "services/SecurityService";
import useCopyClick from "hooks/useCopyClick";

interface IProps {
	profileStatus?: IProfileStatus;
	avatarColor: string;
}

const DashboardProfile: React.FC<IProps> = ({ profileStatus, avatarColor }) => {
	const { formatMessage } = useIntl();
	const copyClick = useCopyClick();
	const { data: tradingFees } = useTradingFees();
	const { data: { results } = { results: [] } } = useSessions({ page: 1, "page-size": 4 }); // DashboardActiveSessions query
	const latestSession = results.length ? results[0] : null;

	const onCopyUID = (): void => {
		if (!IS_WINDOW_AVAILABLE || !profileStatus) return;
		copyClick(
			profileStatus.uid,
			formatMessage(commonMessages.copied_to_clipboard, {
				label: "User ID",
			}),
		);
	};

	return (
		<div className={styles.card}>
			<div className={styles.card_container}>
				{profileStatus && (
					<div className={styles.card_content}>
						<div
							className={classnames(styles.profile_avatar, {
								[styles.avatarColor]: avatarColor.trim(),
							})}
							style={styleProps({
								"--ui-profile-avatar-background": avatarColor ?? "var(--table-table-filter)",
							})}
						>
							<i className="ai ai-avatar" />
						</div>
						<div className={styles.row_group}>
							<div className={styles.row}>
								<span className={styles.profile_email}>{profileStatus.email}</span>
								<span className={styles.profile_uid}>
									User ID: {profileStatus?.uid ?? "--"}&nbsp;
									<ButtonMicro primary onClick={onCopyUID}>
										<i className="ai ai-copy_new" />
									</ButtonMicro>
								</span>
								{tradingFees && (
									<span className={styles.vip_status}>
										<i className="ai ai-vip" />
										{tradingFees.personal?.fee_tier?.name ?? "VIP ?"}
									</span>
								)}
							</div>
							{latestSession && (
								<div className={styles.row}>
									<span className={styles.span_secondary}>
										{formatMessage(accountMessages.last_login_to_your_account)}:
									</span>
									<span className={styles.span_secondary}>
										{dayjs(latestSession.date).format("DD/MM/YYYY HH:mm")}
									</span>
									<span className={styles.span_secondary}>IP {latestSession.ip_address}</span>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default DashboardProfile;

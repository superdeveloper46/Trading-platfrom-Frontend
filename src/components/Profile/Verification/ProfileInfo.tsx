import React from "react";
import { useIntl } from "react-intl";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";

import InternalLink from "components/InternalLink";
import commonMessages from "messages/common";
import accountMessages from "messages/account";
import styles from "styles/pages/ProfileVerification.module.scss";
import { useMst } from "models/Root";
import ButtonMicro from "components/UI/Button/ButtonMicro";
import { IS_WINDOW_AVAILABLE } from "utils/constants";
import { IGetTradingFeesRes } from "types/tradingFees";
import styleProps from "utils/styleProps";
import { useSessions } from "services/SecurityService";
import { routes } from "constants/routing";
import useCopyClick from "hooks/useCopyClick";

interface IProps {
	tradingFees?: IGetTradingFeesRes;
}

const ProfileInfo: React.FC<IProps> = ({ tradingFees }) => {
	const { formatMessage } = useIntl();
	const copyClick = useCopyClick();
	const {
		account: { profileStatus, avatarColor },
	} = useMst();
	const { data: { results } = { results: [] } } = useSessions();
	const latestSession = results.length ? results[0] : null;
	const personal = tradingFees?.personal;

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
		<div className={styles.verification_info_container}>
			<div className={styles.verification_content_section}>
				<div
					className={styles.verification_avatar}
					style={styleProps({ "--ui-profile-avatar-background": avatarColor ?? "#9e9e9e" })}
				>
					<i className="ai ai-avatar" />
				</div>
				<div className={styles.verification_row_group}>
					<div className={styles.verification_row}>
						<h1 className={styles.verification_header_title}>
							{formatMessage(commonMessages.verification)}
						</h1>
						<span className={styles.verification_vip_status}>
							<i className="ai ai-vip" />
							{personal?.fee_tier?.name ?? "VIP ?"}
						</span>
						<InternalLink to={routes.dashboard.root}>
							{formatMessage(commonMessages.more)}
						</InternalLink>
					</div>
					{profileStatus && (
						<div className={styles.verification_row}>
							<span className={styles.verification_email}>{profileStatus.email}</span>
							<span className={styles.verification_uid}>
								User Id {profileStatus.uid ?? "-"}&nbsp;
								<ButtonMicro onClick={onCopyUID}>
									<i className="ai ai-copy_new" />
								</ButtonMicro>
							</span>
						</div>
					)}
				</div>
			</div>
			{latestSession ? (
				<div className={styles.verification_content_section}>
					<div className={styles.verification_row_group}>
						<div className={styles.verification_row}>
							<span className={styles.verification_span_secondary}>
								{formatMessage(accountMessages.last_login_to_your_account)}:
							</span>
						</div>
						<div className={styles.verification_row}>
							<span className={styles.verification_span_secondary}>
								{dayjs(latestSession.date).format("YYYY.MM.DD HH:mm")}
							</span>
							<span className={styles.verification_span_secondary}>
								IP {latestSession.ip_address}
							</span>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default observer(ProfileInfo);

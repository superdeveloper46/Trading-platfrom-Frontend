import React, { useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import commonMessages from "messages/common";
import referralsMessages from "messages/referrals";
import { useMst } from "models/Root";
import { SHARING_LINK_PREFIX } from "utils/constants";
import ButtonMicro from "components/UI/ButtonMicro";
import pageStyles from "styles/pages/Page.module.scss";
import styles from "styles/components/Profile/Referrals/Header.module.scss";
import commonStyles from "styles/components/Profile/Referrals/Referrals.module.scss";
import useCopyClick from "hooks/useCopyClick";
import EditReferralInviteModal from "./modals/EditReferralInviteModal";

const FORMAT_NUMBER_OPTIONS = {
	useGrouping: false,
	maximumFractionDigits: 8,
};

const PageHeader: React.FC = () => {
	const {
		referrals: { editReferralInvite, info, defaultInvite },
	} = useMst();
	const { formatMessage, formatNumber } = useIntl();
	const copyClick = useCopyClick();
	const [modalOpened, setModalOpened] = useState<boolean>(false);
	const sharingUrl = `${SHARING_LINK_PREFIX}${defaultInvite?.code}`;

	const handleCopyRefLinkToClipboard = () => {
		copyClick(
			sharingUrl,
			formatMessage(commonMessages.copied_to_clipboard, {
				label: `${formatMessage(referralsMessages.u_ref_link)}`,
			}),
		);
	};

	const handleCopyRefCodeToClipboard = () => {
		copyClick(
			defaultInvite?.code ?? "",
			formatMessage(commonMessages.copied_to_clipboard, {
				label: `${formatMessage(referralsMessages.referral_code)}`,
			}),
		);
	};

	const handleCloseModal = () => {
		setModalOpened(false);
	};

	const handleEditReferralInvite = () => {
		if (defaultInvite?.id) {
			setModalOpened(true);
		}
	};

	return (
		<div className={styles.container}>
			{defaultInvite?.id && (
				<EditReferralInviteModal
					isOpen={modalOpened}
					onClose={handleCloseModal}
					inviteId={defaultInvite.id}
					editReferralInvite={editReferralInvite}
				/>
			)}
			<div
				className={pageStyles.header_container}
				style={{ padding: 0, backgroundColor: "var(--card-background-color)" }}
			>
				<div className={commonStyles.content}>
					<section className={styles.section}>
						<h1 className={styles.title}>{formatMessage(referralsMessages.page_title)}</h1>
						<div className={styles.current_referral_bonus}>
							<span>
								{formatNumber(Number(info?.tier?.rate ?? "0") * 100, FORMAT_NUMBER_OPTIONS)}%
							</span>
							<span>{formatMessage(referralsMessages.current_bonus)}</span>
						</div>
					</section>
					<section className={styles.section}>
						<span className={styles.code_default_title}>
							{formatMessage(referralsMessages.default_referral_link)}
						</span>
						<div className={styles.code_default_row}>
							<div className={styles.code_default_value}>
								<span>{defaultInvite?.code ?? "???"}</span>
								<ButtonMicro onClick={handleCopyRefCodeToClipboard} primary colored>
									<i className="ai ai-copy_new" />
								</ButtonMicro>
								<ButtonMicro onClick={handleCopyRefLinkToClipboard} primary colored>
									<i className="ai ai-link_4" />
								</ButtonMicro>
							</div>
						</div>
						<div className={styles.code_default_stats}>
							<div className={styles.code_default_stat}>
								<span>{formatMessage(referralsMessages.you_receive)}</span>
								<span>
									{formatNumber(
										100 - Number(defaultInvite?.kickback_rate ?? 0) * 100,
										FORMAT_NUMBER_OPTIONS,
									)}
									%
								</span>
							</div>
							<div className={styles.code_default_stat}>
								<span>{formatMessage(referralsMessages.friends_received)}</span>
								<span>
									{formatNumber(
										Number(defaultInvite?.kickback_rate ?? 0) * 100,
										FORMAT_NUMBER_OPTIONS,
									)}
									%
								</span>
							</div>
						</div>
						<div className={styles.note_social}>
							<div className={styles.code_default_note}>
								<ButtonMicro primary onClick={handleEditReferralInvite}>
									<i className="ai ai-highlight" />
								</ButtonMicro>
								<span>{defaultInvite?.label || "???"}</span>
							</div>
							<div className={commonStyles.social_list}>
								<a
									href="https://www.instagram.com/direct/inbox/"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Instagram"
								>
									<i className="ai ai-instagram" />
								</a>
								<a
									href={`https://twitter.com/intent/tweet?url=${sharingUrl}`}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Twitter"
								>
									<i className="ai ai-twitter" />
								</a>
								<a
									href={`https://t.me/share/url?url=${sharingUrl}`}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Telegram"
								>
									<i className="ai ai-telegram" />
								</a>
								<a
									href={`https://www.facebook.com/sharer/sharer.php?u=${sharingUrl}`}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Facebook"
								>
									<i className="ai ai-facebook" />
								</a>
							</div>
						</div>
					</section>
				</div>
			</div>
			<div className={styles.divider} />
		</div>
	);
};

export default observer(PageHeader);

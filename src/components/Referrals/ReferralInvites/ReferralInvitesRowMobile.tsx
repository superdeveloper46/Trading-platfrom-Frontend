import React, { useState, useEffect, useRef } from "react";
import cn from "classnames";
import { useIntl } from "react-intl";

import referralsMessages from "messages/referrals";
import commonMessages from "messages/common";
import { IReferralInvite } from "types/referrals";
import { SHARING_LINK_PREFIX } from "utils/constants";
import ButtonMicro from "components/UI/ButtonMicro";
import LoadingSpinner from "components/UI/LoadingSpinner";
import styles from "styles/components/Profile/Referrals/Referrals.module.scss";
import Tooltip from "components/UI/Tooltip";
import mobileStyles from "styles/components/Profile/Referrals/Mobile.module.scss";
import useCopyClick from "hooks/useCopyClick";
import DeleteReferralInviteModal from "../modals/DeleteReferralInviteModal";
import FloatingShareMenu from "./ShareMenu";

const FORMAT_NUMBER_OPTIONS = {
	useGrouping: false,
	maximumFractionDigits: 8,
};

interface Props {
	invite: IReferralInvite;
	setReferralInviteByDefault: (id: number) => Promise<void>;
	deleteReferralInvite: (id: number) => Promise<void>;
}

const ReferralInvitesRowMobile: React.FC<Props> = ({
	invite,
	setReferralInviteByDefault,
	deleteReferralInvite,
}) => {
	const { formatMessage, formatNumber } = useIntl();
	const copyClick = useCopyClick();
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const [isMakeDefaultLoading, setIsMakeDefaultLoading] = useState<boolean>(false);
	const [isShareDropdownOpen, setIsShareDropdownOpen] = useState<boolean>(false);
	const [modalOpened, setModalOpened] = useState<boolean>(false);
	const shareDropdownRef = useRef<HTMLDivElement>(null);
	const sharingUrl = `${SHARING_LINK_PREFIX}${invite.code}`;

	const handleCloseShareDropdown = (e: MouseEvent) => {
		if (!shareDropdownRef?.current?.contains(e.target as Node)) {
			setIsShareDropdownOpen(false);
		}
	};

	const handleCloseModal = () => {
		setModalOpened(false);
	};

	const handleDeleteReferralInvite = () => {
		setModalOpened(true);
	};

	const handleMakeDefault = () => {
		if (!isMakeDefaultLoading && invite?.id) {
			setReferralInviteByDefault(invite.id).finally(() => {
				setIsMakeDefaultLoading(false);
			});
		}
	};

	const handleCopyRefLinkToClipboard = () => {
		copyClick(
			`${SHARING_LINK_PREFIX}${invite.code}`,
			formatMessage(commonMessages.copied_to_clipboard, {
				label: `${formatMessage(referralsMessages.u_ref_link)}`,
			}),
		);
	};

	const handleCopyRefCodeToClipboard = () => {
		if (invite?.code) {
			copyClick(
				invite.code,
				formatMessage(commonMessages.copied_to_clipboard, {
					label: `${formatMessage(referralsMessages.referral_code)}`,
				}),
			);
		}
	};

	useEffect(() => {
		if (isShareDropdownOpen) {
			document.addEventListener("click", handleCloseShareDropdown);
		} else {
			document.removeEventListener("click", handleCloseShareDropdown);
		}
		return () => document.removeEventListener("click", handleCloseShareDropdown);
	}, [isShareDropdownOpen]);

	const handleToggleExpand = () => {
		setIsExpanded((prevState) => !prevState);
	};

	return (
		<>
			<DeleteReferralInviteModal
				isOpen={modalOpened}
				onClose={handleCloseModal}
				inviteId={invite.id!}
				deleteReferralInvite={deleteReferralInvite}
			/>
			<div className={mobileStyles.card_mobile}>
				<div className={mobileStyles.card_mobile_header}>
					<div className={mobileStyles.card_mobile_uid}>
						<span>{invite.code}</span>
						<ButtonMicro onClick={handleCopyRefCodeToClipboard} primary small colored>
							<i className="ai ai-copy_new" />
						</ButtonMicro>
						<ButtonMicro onClick={handleCopyRefLinkToClipboard} primary small colored>
							<i className="ai ai-link_4" />
						</ButtonMicro>
					</div>
					<div className={cn(mobileStyles.card_mobile_action, isExpanded && mobileStyles.active)}>
						<ButtonMicro onClick={handleToggleExpand} className={styles.expand_button}>
							<i className="ai ai-arrow_down" />
						</ButtonMicro>
					</div>
				</div>
				<div className={mobileStyles.card_mobile_content}>
					<div className={mobileStyles.card_mobile_content_group}>
						<span>{formatMessage(referralsMessages.total_earned)}&nbsp;(USDT)</span>
						<span>{formatNumber(Number(invite?.bonus_all_time || 0), FORMAT_NUMBER_OPTIONS)}</span>
					</div>
					{isExpanded && (
						<div className={mobileStyles.card_mobile_content_hidden}>
							<div className={mobileStyles.card_mobile_content_group}>
								<span>{formatMessage(referralsMessages.my_percentage_friends_percentage)}</span>
								<span>
									{formatNumber(100 - Number(invite.kickback_rate) * 100, FORMAT_NUMBER_OPTIONS)}
									%&nbsp;/&nbsp;
									{formatNumber(Number(invite.kickback_rate) * 100, FORMAT_NUMBER_OPTIONS)}%
								</span>
							</div>
							<div className={mobileStyles.card_mobile_content_group}>
								<span>{formatMessage(referralsMessages.friends)}</span>
								<span>{invite.invited_count}</span>
							</div>
						</div>
					)}
				</div>
				<div className={mobileStyles.card_mobile_footer}>
					{invite.is_default ? (
						<span>{formatMessage(referralsMessages.default)}</span>
					) : (
						<button
							className={styles.make_default_button}
							type="button"
							onClick={handleMakeDefault}
						>
							{isMakeDefaultLoading ? (
								<LoadingSpinner size={4} />
							) : (
								formatMessage(referralsMessages.make_a_default)
							)}
						</button>
					)}
					<Tooltip
						id={`share-invite-code-${invite.id}`}
						place="bottom"
						arrowColor="transparent"
						backgroundColor="transparent"
						openOnClick
						padding="0"
						clickable
						isCapture
						opener={
							<ButtonMicro primary>
								<i className="ai ai-share_outline" />
							</ButtonMicro>
						}
					>
						<FloatingShareMenu sharingUrl={sharingUrl} />
					</Tooltip>
					{!invite.is_default && invite?.id && (
						<ButtonMicro primary onClick={handleDeleteReferralInvite}>
							<i className="ai ai-trash" />
						</ButtonMicro>
					)}
				</div>
			</div>
		</>
	);
};

export default ReferralInvitesRowMobile;

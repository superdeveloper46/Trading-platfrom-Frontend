import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import referralsMessages from "messages/referrals";
import commonMessages from "messages/common";
import { ICreateReferralInvite, IReferralInvite } from "types/referrals";
import styles from "styles/components/Profile/Referrals/Referrals.module.scss";
import ButtonMicro from "components/UI/ButtonMicro";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { SHARING_LINK_PREFIX } from "utils/constants";
import useCopyClick from "hooks/useCopyClick";
import Tooltip from "components/UI/Tooltip";
import { TableData, TableRow } from "components/UI/Table";
import EditReferralInviteModal from "../modals/EditReferralInviteModal";
import DeleteReferralInviteModal from "../modals/DeleteReferralInviteModal";
import FloatingShareMenu from "./ShareMenu";

const FORMAT_NUMBER_OPTIONS = {
	useGrouping: false,
	maximumFractionDigits: 8,
};

interface Props {
	invite: IReferralInvite;
	editReferralInvite: (id: number, params: ICreateReferralInvite) => Promise<void>;
	setReferralInviteByDefault: (id: number) => Promise<void>;
	deleteReferralInvite: (id: number) => Promise<void>;
}

const ReferralInvitesRow: React.FC<Props> = ({
	invite,
	editReferralInvite,
	setReferralInviteByDefault,
	deleteReferralInvite,
}) => {
	const [isShareDropdownOpen, setIsShareDropdownOpen] = useState<boolean>(false);
	const [isMakeDefaultLoading, setIsMakeDefaultLoading] = useState<boolean>(false);
	const [editModalOpened, setEditModalOpened] = useState<boolean>(false);
	const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);
	const { formatNumber, formatMessage } = useIntl();
	const copyClick = useCopyClick();
	const sharingUrl = `${SHARING_LINK_PREFIX}${invite.code}`;

	const handleCloseModal = () => {
		setEditModalOpened(false);
		setDeleteModalOpened(false);
	};

	const handleEditReferralInvite = () => {
		setEditModalOpened(true);
	};

	const handleDeleteReferralInvite = () => {
		setDeleteModalOpened(true);
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

	const handleCloseShareDropdown = () => {
		setIsShareDropdownOpen(false);
	};

	useEffect(() => {
		if (isShareDropdownOpen) {
			document.addEventListener("click", handleCloseShareDropdown);
		} else {
			document.removeEventListener("click", handleCloseShareDropdown);
		}
		return () => document.removeEventListener("click", handleCloseShareDropdown);
	}, [isShareDropdownOpen]);

	return (
		<>
			<EditReferralInviteModal
				isOpen={editModalOpened}
				onClose={handleCloseModal}
				inviteId={invite.id!}
				editReferralInvite={editReferralInvite}
			/>
			<DeleteReferralInviteModal
				isOpen={deleteModalOpened}
				onClose={handleCloseModal}
				inviteId={invite.id!}
				deleteReferralInvite={deleteReferralInvite}
			/>
			<TableRow key={invite.id}>
				<TableData>
					{invite.code}&nbsp;
					<ButtonMicro onClick={handleCopyRefCodeToClipboard} primary small colored>
						<i className="ai ai-copy_new" />
					</ButtonMicro>
					<ButtonMicro onClick={handleCopyRefLinkToClipboard} primary small colored>
						<i className="ai ai-link_4" />
					</ButtonMicro>
				</TableData>
				<TableData maxWidth="135px">
					{invite?.id && (
						<ButtonMicro primary onClick={handleEditReferralInvite} small>
							<i className="ai ai-highlight" />
						</ButtonMicro>
					)}
					&nbsp;
					<span title={invite.label}>
						{invite.label.length > 10 ? `${invite.label.slice(0, 10)}...` : invite.label || "-"}
					</span>
				</TableData>
				<TableData align="right">
					{formatNumber(Number(invite?.bonus_all_time || 0), FORMAT_NUMBER_OPTIONS)}
				</TableData>
				<TableData maxWidth="40px" />
				<TableData width="220px">
					{formatNumber(100 - Number(invite.kickback_rate) * 100, FORMAT_NUMBER_OPTIONS)}
					%&nbsp;/&nbsp;
					{formatNumber(Number(invite.kickback_rate) * 100, FORMAT_NUMBER_OPTIONS)}%
				</TableData>
				<TableData maxWidth="40px" />
				<TableData maxWidth="80px">{invite.invited_count}</TableData>
				<TableData>
					{invite.is_default ? (
						<span style={{ color: "var(--color-secondary)" }}>
							{formatMessage(referralsMessages.default)}
						</span>
					) : (
						<div className={styles.make_default_button} onClick={handleMakeDefault}>
							{isMakeDefaultLoading ? (
								<LoadingSpinner size={4} />
							) : (
								formatMessage(referralsMessages.make_a_default)
							)}
						</div>
					)}
				</TableData>
				<TableData
					align="center"
					maxWidth="75px"
					styleInline={{ overflow: "visible", position: "relative" }}
				>
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
				</TableData>
				<TableData maxWidth="75px">
					{!invite.is_default && invite?.id && (
						<ButtonMicro primary onClick={handleDeleteReferralInvite}>
							<i className="ai ai-trash" />
						</ButtonMicro>
					)}
				</TableData>
			</TableRow>
		</>
	);
};

export default ReferralInvitesRow;

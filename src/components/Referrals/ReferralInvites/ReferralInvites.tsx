import React, { useState } from "react";
import { useIntl } from "react-intl";
import referralsMessages from "messages/referrals";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { IReferralInvite } from "types/referrals";
import NoRowsMessage from "components/Table/NoRowsMessage";
import useWindowSize from "hooks/useWindowSize";
import { useMst } from "models/Root";
import Button from "components/UI/Button";
import styles from "styles/components/Profile/Referrals/Referrals.module.scss";
import { observer } from "mobx-react-lite";
import ReferralInvitesRow from "./ReferralInvitesRow";
import ReferralInvitesRowMobile from "./ReferralInvitesRowMobile";
import CreateReferralInviteModal from "../modals/CreateReferralInviteModal";
import { Table } from "../../UI/Table";

const ReferralInvites: React.FC = () => {
	const {
		referrals: {
			invites,
			isInvitesLoading,
			info,
			editReferralInvite,
			setReferralInviteByDefault,
			createReferralInvite,
			deleteReferralInvite,
		},
	} = useMst();
	const { medium } = useWindowSize();
	const desktop = !medium;
	const { formatMessage } = useIntl();
	const [modalOpened, setModalOpened] = useState(false);

	const handleCloseModal = () => {
		setModalOpened(false);
	};

	const handleCreateReferralInvite = () => {
		setModalOpened(true);
	};

	return (
		<>
			<CreateReferralInviteModal
				isOpen={modalOpened}
				onClose={handleCloseModal}
				info={info}
				createReferralInvite={createReferralInvite}
			/>
			<div className={styles.content}>
				<div className={styles.card_container}>
					<div className={styles.table_container}>
						<div className={styles.card_header}>
							<div className={styles.card_title_container}>
								<div className={styles.card_title}>
									{formatMessage(referralsMessages.my_referral_codes)}
								</div>
								<span className={styles.card_subtitle}>
									{formatMessage(referralsMessages.maximal_amount_of_codes)}&nbsp;
									<span>{info?.tier?.max_invites_per_user ?? 20}</span>
								</span>
							</div>
							{medium ? (
								<Button
									variant="filled"
									color="primary"
									mini
									iconCode="plus_mini"
									iconAlign="left"
									label={formatMessage(referralsMessages.create_referral_code)}
									onClick={handleCreateReferralInvite}
								/>
							) : (
								<button
									className={styles.create_referral_invite_button}
									type="button"
									onClick={handleCreateReferralInvite}
								>
									<i className="ai ai-plus_mini" />
									{formatMessage(referralsMessages.create_referral_code)}
								</button>
							)}
						</div>
						{desktop ? (
							<Table
								className={styles.referrals_invites_table}
								rowsClassNames={styles.rows}
								stripped
								header={{
									className: styles.header,
									columns: [
										{
											label: formatMessage(referralsMessages.referral_code),
										},
										{
											label: formatMessage(referralsMessages.note),
											maxWidth: "135px",
										},
										{
											label: `${formatMessage(referralsMessages.total_earned)} (USDT)`,
											align: "right",
										},
										{
											label: "",
											maxWidth: "75px",
										},
										{
											label: formatMessage(referralsMessages.my_percentage_friends_percentage),
											width: "220px",
										},
										{
											label: "",
											maxWidth: "40px",
										},
										{
											label: formatMessage(referralsMessages.friends),
											maxWidth: "80px",
										},
										{
											label: "",
										},
										{
											label: "",
											maxWidth: "75px",
										},
										{
											label: "",
											maxWidth: "75px",
										},
									],
								}}
							>
								{isInvitesLoading ? (
									<LoadingSpinner />
								) : invites.length > 0 ? (
									invites.map((invite: IReferralInvite) => (
										<ReferralInvitesRow
											invite={invite}
											key={invite.id}
											editReferralInvite={editReferralInvite}
											setReferralInviteByDefault={setReferralInviteByDefault}
											deleteReferralInvite={deleteReferralInvite}
										/>
									))
								) : (
									<NoRowsMessage />
								)}
							</Table>
						) : (
							<div className={styles.card_mobiles_list}>
								{isInvitesLoading ? (
									<LoadingSpinner />
								) : invites.length > 0 ? (
									invites.map((invite: IReferralInvite) => (
										<ReferralInvitesRowMobile
											invite={invite}
											key={invite.id}
											setReferralInviteByDefault={setReferralInviteByDefault}
											deleteReferralInvite={deleteReferralInvite}
										/>
									))
								) : (
									<NoRowsMessage />
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default observer(ReferralInvites);

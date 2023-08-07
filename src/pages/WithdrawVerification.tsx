import React from "react";
import { useIntl } from "react-intl";
import common_messages from "messages/common";
import messages from "messages/finance";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";
import ProfileLayout from "layouts/ProfileLayout";
import styles from "styles/pages/WithdrawVerification.module.scss";
import Button from "components/UI/Button";
import { SidebarMenuLevelsEnum } from "types/sidebarMenuLevels";

const WithdrawVerification: React.FC = () => {
	const {
		account: { profileStatus },
	} = useMst();
	const service = profileStatus?.email?.split("@");
	const { formatMessage } = useIntl();

	return (
		<ProfileLayout sidebarMenuLevel={SidebarMenuLevelsEnum.Wallets}>
			<div>
				{formatMessage(messages.withdraw_varification)}
				<div className={styles.profile_card_panel}>
					<p>{formatMessage(messages.withdraw_varification_desc)}</p>
					<div>
						<a href={`https://${service && service[1]}`} target="_blank" rel="noopener noreferrer">
							<Button color="primary" label={formatMessage(common_messages.verification_btn)} />
						</a>
					</div>
				</div>
			</div>
		</ProfileLayout>
	);
};

export default observer(WithdrawVerification);

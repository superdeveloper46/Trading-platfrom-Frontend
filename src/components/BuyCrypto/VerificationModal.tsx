import React from "react";
import { useIntl } from "react-intl";

import buyCryptoMessages from "messages/buy_crypto";
import VerificationIcon from "assets/icons/verification.svg";
import commonMessages from "messages/common";
import InternalLink from "components/InternalLink";
import Button from "components/UI/Button";
import Modal, { ActionGroup, Content, Description, Icon } from "components/UI/Modal";
import { routes } from "constants/routing";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	label?: string;
}

const VerificationModal: React.FC<Props> = React.memo(({ isOpen, onClose, label }) => {
	const { formatMessage } = useIntl();

	return (
		<Modal
			iconCode="shield_transfer"
			label={formatMessage(commonMessages.verification)}
			onClose={onClose}
			isOpen={isOpen}
		>
			<Content>
				<Icon>
					<img src={VerificationIcon} alt="verification" width="200" height="300" />
				</Icon>
				<Description>
					<span>
						{label ||
							formatMessage(buyCryptoMessages.modal_verification_level, {
								level: 1,
							})}
					</span>
				</Description>
				<ActionGroup>
					<InternalLink to={routes.verification.root}>
						<Button
							label={formatMessage(buyCryptoMessages.pass_now)}
							variant="filled"
							color="primary"
							fullWidth
							onClick={onClose}
						/>
					</InternalLink>
				</ActionGroup>
			</Content>
		</Modal>
	);
});

export default VerificationModal;

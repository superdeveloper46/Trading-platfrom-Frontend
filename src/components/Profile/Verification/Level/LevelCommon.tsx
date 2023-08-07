import React from "react";
import { useIntl } from "react-intl";
import styles from "styles/pages/ProfileVerification.module.scss";
import verificationMessages from "messages/verification";
import commonMessages from "messages/common";
import accountMessages from "messages/account";
import Button from "components/UI/Button";
import classnames from "classnames";

export interface ILevelProps {
	className?: string;
	minimum?: boolean;
}

export const LevelVerified: React.FC = () => {
	const { formatMessage } = useIntl();
	return (
		<div className={styles.level_verified}>
			<i className="ai ai-check_filled" />
			{formatMessage(verificationMessages.verified)}
		</div>
	);
};

export const LevelNotVerified: React.FC = () => {
	const { formatMessage } = useIntl();
	return (
		<div className={styles.level_not_verified}>
			{formatMessage(verificationMessages.non_verified)}
		</div>
	);
};

export const LevelModeration: React.FC = () => {
	const { formatMessage } = useIntl();
	return (
		<span className={styles.level_moderation}>
			<i className="ai ai-clock" />
			{formatMessage(verificationMessages.moderation)}
		</span>
	);
};

interface ILevelBonusProps {
	isApproved: boolean;
	children?: React.ReactNode;
}

export const LevelBonus: React.FC<ILevelBonusProps> = ({ isApproved, children }) => (
	<div className={classnames(styles.level_bonus, { [styles.active]: isApproved })}>
		<i className="ai ai-check_mini" />
		<span>{children}</span>
	</div>
);

export const IncreaseSecurityMessage = () => {
	const { formatMessage } = useIntl();
	return (
		<span>
			{formatMessage(
				verificationMessages.by_completing_this_level_you_will_increase_security_of_your_account,
			)}
			:
		</span>
	);
};

interface IRejectedCardBody {
	message?: string | null;
}

export const RejectedCardBody: React.FC<IRejectedCardBody> = ({ message }) => {
	const { formatMessage } = useIntl();
	return (
		<div className={styles.level_card_body_rejected}>
			<span>
				<i className="ai ai-message_square" />
				{message}
			</span>
			<span className={styles.level_rejected}>
				<i className="ai ai-error_circle" />
				{formatMessage(verificationMessages.rejected)}
			</span>
		</div>
	);
};

interface ILevelButtonProps {
	onClick(): void;
}
interface ILevelUpdateButtonProps extends ILevelButtonProps {
	onCancel?(): void;
}

export const LevelUpdateButton: React.FC<ILevelUpdateButtonProps> = ({
	onClick: onUpdate,
	onCancel,
}) => {
	const { formatMessage } = useIntl();
	return (
		<div onClick={onUpdate} className={styles.level_update_button}>
			{formatMessage(commonMessages.update)}
		</div>
	);
};

export const LevelPassButton: React.FC<ILevelButtonProps> = ({ onClick }) => {
	const { formatMessage } = useIntl();
	return (
		<Button
			variant="filled"
			color="primary"
			mini
			fullWidth
			onClick={onClick}
			label={formatMessage(accountMessages.pass)}
		/>
	);
};
export const LevelContinueButton: React.FC<ILevelButtonProps> = ({ onClick }) => {
	const { formatMessage } = useIntl();
	return (
		<Button
			variant="filled"
			color="primary"
			mini
			fullWidth
			onClick={onClick}
			label={formatMessage(commonMessages.continue)}
		/>
	);
};

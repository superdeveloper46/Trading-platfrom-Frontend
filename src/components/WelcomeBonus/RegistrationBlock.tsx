import React from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import messages from "messages/welcome_bonus";
import styles from "styles/pages/WelcomeBonus.module.scss";
import useWindowSize from "hooks/useWindowSize";
import Button from "components/UI/Button";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";

const RegistrationBlock: React.FC = () => {
	const { mobile } = useWindowSize();
	const { formatMessage } = useIntl();
	const localeNavigate = useLocaleNavigate();

	const redirectToRegistration = () => {
		localeNavigate(routes.register.root);
	};

	return (
		<div className={styles.registration_container}>
			{!mobile && (
				<>
					<i className="ai ai-error_circle" />
					<span className={styles.registration_text}>{formatMessage(messages.registerCTA)}</span>
				</>
			)}
			<div className={styles.registration_button}>
				<Button
					onClick={redirectToRegistration}
					fullWidth
					variant="filled"
					color="secondary"
					label={formatMessage(messages.registration)}
				/>
			</div>
		</div>
	);
};

export default observer(RegistrationBlock);

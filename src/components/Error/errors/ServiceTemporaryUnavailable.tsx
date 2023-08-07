import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";
import messages from "messages/common";
import { useNavigate } from "react-router-dom";
import styles from "styles/components/Error.module.scss";
import buttonStyles from "styles/components/UI/Button.module.scss";
import cn from "classnames";
import Button from "components/UI/Button";

interface Props {
	status: string;
}

const ServiceTemporaryUnavailable: React.FC<Props> = ({ status }) => {
	const { formatMessage } = useIntl();
	const navigate = useNavigate();

	const handleBackClick = useCallback((e) => {
		e.preventDefault();
		navigate(-1);
	}, []);

	// eslint-disable-next-line no-restricted-globals
	const handleRetryClick = useCallback(() => location.reload(), []);

	return (
		<div className={cn(styles.light, styles.error_container)}>
			<Helmet
				title={formatMessage({
					id: "app.common.containers.status_service_temporary_unavailable",
				})}
				meta={[{ name: "description", content: status }]}
			/>
			<div>
				<div className={cn(styles.center, styles.error_message)}>
					{formatMessage(messages.status_service_temporary_unavailable)}
				</div>
				<div className={cn(styles.center, styles.secure_content)}>
					<Button
						className={styles.errors_page_btn}
						color="primary"
						onClick={handleRetryClick}
						label={formatMessage(messages.retry_btn)}
					/>
				</div>
				<div className={cn(styles.center, styles.secure_content)}>
					<Button
						className={cn(styles.errors_page_btn, buttonStyles.button_flat)}
						onClick={handleBackClick}
						label={formatMessage(messages.back_btn)}
					/>
				</div>
			</div>
		</div>
	);
};

export default ServiceTemporaryUnavailable;

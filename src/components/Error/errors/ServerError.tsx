import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";
import { useNavigate } from "react-router-dom";

import commonMessages from "messages/common";
import InternalLink from "components/InternalLink";
import styles from "styles/components/Error.module.scss";
import Button, { ButtonsGroup } from "components/UI/Button";
import { URL_VARS } from "constants/routing";

const ServerError: React.FC = () => {
	const { formatMessage } = useIntl();
	const navigate = useNavigate();

	const handleBackBtnClick = useCallback(() => {
		navigate(-1);
	}, []);

	return (
		<>
			<Helmet
				title={formatMessage(commonMessages.status_server_error)}
				meta={[{ name: "description", content: "500" }]}
			/>
			<div className={styles.container}>
				<div className={styles.content}>
					<div className={styles.title}>{formatMessage(commonMessages.status_server_error)}</div>
					<ButtonsGroup>
						<InternalLink to={URL_VARS.ROOT}>
							<Button
								fullWidth
								variant="filled"
								color="primary"
								label={formatMessage(commonMessages.main_page_link)}
							/>
						</InternalLink>
						<Button
							fullWidth
							variant="text"
							color="primary"
							label={formatMessage(commonMessages.back_btn)}
							onClick={handleBackBtnClick}
						/>
					</ButtonsGroup>
				</div>
			</div>
		</>
	);
};

export default ServerError;

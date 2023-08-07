import React from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";

import commonMessages from "messages/common";
import styles from "styles/components/Error.module.scss";
import InternalLink from "components/InternalLink";
import Button from "components/UI/Button";
import { URL_VARS } from "constants/routing";

const NetworkError: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<>
			<Helmet title={formatMessage(commonMessages.status_network_error)} />
			<div className={styles.container}>
				<div className={styles.content}>
					<div className={styles.title}>{formatMessage(commonMessages.status_network_error)}</div>
					<InternalLink to={URL_VARS.ROOT}>
						<Button
							fullWidth
							variant="filled"
							color="primary"
							label={formatMessage(commonMessages.main_page_link)}
						/>
					</InternalLink>
				</div>
			</div>
		</>
	);
};

export default NetworkError;

import React from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";

import forbiddenImg from "assets/images/403.svg";
import commonMessages from "messages/common";
import InternalLink from "components/InternalLink";
import styles from "styles/components/Error.module.scss";
import Button from "components/UI/Button";
import { URL_VARS } from "constants/routing";

const ForbiddenError: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<>
			<Helmet
				title={formatMessage(commonMessages.status_forbidden)}
				meta={[{ name: "description", content: "403" }]}
			/>
			<div className={styles.container}>
				<div className={styles.content}>
					<div className={styles.title}>{formatMessage(commonMessages.status_forbidden)}</div>
					<img
						className={styles.image}
						src={forbiddenImg}
						alt="Forbidden"
						width="580"
						height="200"
					/>
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

export default ForbiddenError;

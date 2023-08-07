import React from "react";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";

import commonMessages from "messages/common";
import notFoundImg from "assets/images/404.svg";
import MainLayout from "layouts/MainLayout";
import styles from "styles/pages/PageNotFound.module.scss";
import InternalLink from "components/InternalLink";
import Button from "components/UI/Button";
import { URL_VARS } from "constants/routing";

const PageNotFound: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<MainLayout>
			<Helmet
				title={formatMessage(commonMessages.status_not_found)}
				meta={[{ name: "description", content: "404" }]}
			/>
			<div className={styles.container}>
				<div className={styles.content}>
					<h1>{formatMessage(commonMessages.status_not_found)}</h1>
					<img src={notFoundImg} alt="Not found" width="200" height="200" />
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
		</MainLayout>
	);
};

export default PageNotFound;

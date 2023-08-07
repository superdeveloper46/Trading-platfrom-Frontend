import React from "react";
import { Helmet } from "react-helmet";
import styles from "styles/pages/Auth.module.scss";
import { ResetPasswordForm } from "components/Auth";
import { useIntl } from "react-intl";
import messages from "messages/common";
import AuthLayout from "layouts/AuthLayout";
import { getPageTitle } from "helpers/global";

const ResetPassword: React.FC = () => {
	const { formatMessage } = useIntl();
	const title = getPageTitle(formatMessage(messages.reset_password));

	return (
		<AuthLayout>
			<Helmet
				title={title}
				meta={[
					{ name: "description", content: title },
					{ property: "og:title", content: title },
					{ property: "twitter:title", content: title },
					{ property: "og:description", content: title },
					{ name: "twitter:description", content: title },
				]}
			/>
			<div className={styles.container}>
				<ResetPasswordForm />
			</div>
		</AuthLayout>
	);
};

export default ResetPassword;

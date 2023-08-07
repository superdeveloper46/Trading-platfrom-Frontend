import React, { useEffect } from "react";
import AuthLayout from "layouts/AuthLayout";
import { Helmet } from "react-helmet";
import styles from "styles/pages/Auth.module.scss";
import { RegisterForm } from "components/Auth";
import { useIntl } from "react-intl";
import messages from "messages/common";
import { getPageTitle } from "helpers/global";
import { useMst } from "models/Root";
import { observer } from "mobx-react-lite";
import { RecaptchaEnum } from "types/auth";

const Register: React.FC = () => {
	const { auth } = useMst();
	const { formatMessage } = useIntl();
	const title = getPageTitle(formatMessage(messages.register));

	useEffect(() => {
		auth.loadRecaptcha(RecaptchaEnum.REGISTER);
	}, []);

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
				<RegisterForm />
			</div>
		</AuthLayout>
	);
};

export default observer(Register);

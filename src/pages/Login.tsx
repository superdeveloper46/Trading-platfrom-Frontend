import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { matchPath, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { observer } from "mobx-react-lite";
import AuthLayout from "layouts/AuthLayout";
import styles from "styles/pages/Auth.module.scss";
import { LoginForm } from "components/Auth";
import { useMst } from "models/Root";
import messages from "messages/common";
import { getPageTitle } from "helpers/global";
import { RecaptchaEnum } from "types/auth";
import useParamQuery from "hooks/useSearchQuery";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { routes, URL_VARS } from "constants/routing";

const getRedirectPathname = (redirectQuery: string): string => {
	for (const route of Object.values(routes)) {
		if (typeof route === "object") {
			for (const pattern of Object.values(route)) {
				if (typeof pattern === "string") {
					const path =
						matchPath(pattern, redirectQuery) ?? matchPath(`/:locale${pattern}`, redirectQuery);
					if (path) {
						return path.pathname;
					}
				}
			}
		} else if (typeof route === "string") {
			const path = matchPath(route, redirectQuery) ?? matchPath(`/:locale${route}`, redirectQuery);
			if (path) {
				return path.pathname;
			}
		}
	}
	return "";
};

const Login: React.FC = () => {
	const { global, auth } = useMst();
	const { formatMessage } = useIntl();
	const query = useParamQuery();
	const navigate = useNavigate();
	const title = getPageTitle(formatMessage(messages.login));

	useEffect(() => {
		auth.loadRecaptcha(RecaptchaEnum.LOGIN);
	}, []);

	useEffect(() => {
		if (global.isAuthenticated) {
			const redirectQuery = query.get(URL_VARS.REDIRECT);
			const pathname = redirectQuery ? getRedirectPathname(redirectQuery) : "";
			navigate(pathname || `/${global.locale}${routes.profile.wallets}`);
		}
	}, [global.isAuthenticated]);

	return global.isAuthenticated ? (
		<LoadingSpinner />
	) : (
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
				<LoginForm />
			</div>
		</AuthLayout>
	);
};

export default observer(Login);

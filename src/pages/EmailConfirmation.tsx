import React from "react";
import { Helmet } from "react-helmet";
import { getPageTitle } from "helpers/global";
import AuthLayout from "layouts/AuthLayout";
import EmailConfirmationForm from "components/EmailConfirmationForm";

const EmailConfirmation = () => {
	// TODO: add translations
	const title = getPageTitle("Email Confirmation");

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
			<EmailConfirmationForm />
		</AuthLayout>
	);
};

export default EmailConfirmation;

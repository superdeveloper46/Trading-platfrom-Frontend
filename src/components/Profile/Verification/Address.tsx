import Breadcrumbs from "components/Breadcrumbs";
import React from "react";
import { useIntl } from "react-intl";

import styles from "styles/pages/ProfileVerification.module.scss";
import verificationMessages from "messages/verification";
import { routes } from "constants/routing";
import AddressForm from "./Form/AddressForm/AddressForm";

const Address: React.FC = () => {
	const { formatMessage } = useIntl();
	return (
		<div className={styles.verification_page_container_outer}>
			<Breadcrumbs
				links={[
					{
						link: routes.verification.root,
						label: formatMessage(verificationMessages.verification),
					},
				]}
				current={formatMessage(verificationMessages.address)}
			/>
			<div className={styles.header_title}>{formatMessage(verificationMessages.address)}</div>
			<AddressForm />
		</div>
	);
};

export default Address;

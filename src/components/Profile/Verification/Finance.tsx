import React from "react";
import { useIntl } from "react-intl";

import Breadcrumbs from "components/Breadcrumbs";
import styles from "styles/pages/ProfileVerification.module.scss";
import verificationMessages from "messages/verification";
import { routes } from "constants/routing";
import FinanceForm from "./Form/FinanceForm/FinanceForm";

const Finance: React.FC = () => {
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
				current={formatMessage(verificationMessages.finance)}
			/>
			<div className={styles.header_title}>{formatMessage(verificationMessages.finance)}</div>
			<FinanceForm />
		</div>
	);
};

export default Finance;

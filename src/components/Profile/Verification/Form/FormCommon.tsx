import React from "react";
import { useIntl } from "react-intl";

import styles from "styles/pages/ProfileVerification.module.scss";
import commonMessages from "messages/common";
import verificationMessages from "messages/verification";
import Button from "components/UI/Button";
import InternalLink from "components/InternalLink";
import { routes } from "constants/routing";

interface IFormSuccessfullySent {
	onClick?(): void;
}

export const FormSuccessfullySent: React.FC<IFormSuccessfullySent> = ({ onClick }) => {
	const { formatMessage } = useIntl();
	return (
		<div className={styles.form_sent_successfully}>
			<i className="ai ai-mail_open" />
			<span>
				{formatMessage(verificationMessages.the_data_has_been_successfully_sent_for_verification)}
			</span>
			{onClick && (
				<div className={styles.form_button_group}>
					<Button
						label={`${formatMessage(verificationMessages.verification)} [${formatMessage(
							verificationMessages.address,
						)}]`}
						variant="filled"
						color="primary"
						onClick={onClick}
						fullWidth
					/>
					<InternalLink to={routes.verification.root}>
						<Button
							label={formatMessage(commonMessages.back_btn)}
							variant="text"
							color="primary"
							fullWidth
						/>
					</InternalLink>
				</div>
			)}
		</div>
	);
};

export interface IFormError {
	firstName: string | null;
	lastName: string | null;
	middleName: string | null;
	b_day: string | null;
	b_year: string | null;
	d_day: string | null;
	d_year: string | null;
}

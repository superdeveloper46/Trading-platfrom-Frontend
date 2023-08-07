import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import useWindowSize from "hooks/useWindowSize";
import { IProfileStatus } from "models/Account";
import styles from "styles/components/Profile/Dashboard/DashboardVerification.module.scss";
import accountMessages from "messages/account";
import { useMst } from "models/Root";
import { routes } from "constants/routing";
import { DashboardCard, DashboardCardHeader } from "./DashboardCard";
import AddressLevel from "../Verification/Level/AddressLevel";
import IdentityLevel from "../Verification/Level/IdentityLevel";

interface IProps {
	profileStatus?: IProfileStatus;
}

const DashboardVerification: React.FC<IProps> = ({ profileStatus }) => {
	const { formatMessage } = useIntl();
	const { mobile } = useWindowSize();

	const {
		verification: { loadStates },
	} = useMst();

	useEffect(() => {
		loadStates();
	}, []);

	const currentVerificationLevel: number = profileStatus?.verification_level ?? 0;

	return (
		<DashboardCard className={styles.card}>
			<DashboardCardHeader link={routes.verification.root}>
				<div className={styles.card_title}>
					<i className="ai ai-user_check" />
					{formatMessage(accountMessages.verification_level)}&nbsp;(
					{currentVerificationLevel}){mobile && <i className="ai ai-chevron_right" />}
				</div>
				{!mobile && <i className="ai ai-chevron_right" />}
			</DashboardCardHeader>
			<div className={styles.current_level}>
				<IdentityLevel minimum className={styles.verification_levels} />
				<AddressLevel minimum className={styles.verification_levels} />
				{/* {financeRequired && <FinanceLevel minimum className={styles.verification_levels} />} */}
			</div>
		</DashboardCard>
	);
};

export default DashboardVerification;

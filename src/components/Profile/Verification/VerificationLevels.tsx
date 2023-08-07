import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";
import { useTradingFees } from "services/TradingFeesService";
import styles from "styles/pages/ProfileVerification.module.scss";
import AddressLevel from "./Level/AddressLevel";
import IdentityLevel from "./Level/IdentityLevel";
import ProfileInfo from "./ProfileInfo";

const VerificationLevels: React.FC = () => {
	const { data } = useTradingFees();
	const {
		verification: { loadStates },
	} = useMst();

	useEffect(() => {
		loadStates();
	}, []);

	return (
		<div className={styles.verification_page_container_outer}>
			<ProfileInfo tradingFees={data} />
			<IdentityLevel />
			<AddressLevel />
			{/* {financeRequired && <FinanceLevel />} */}
		</div>
	);
};

export default observer(VerificationLevels);

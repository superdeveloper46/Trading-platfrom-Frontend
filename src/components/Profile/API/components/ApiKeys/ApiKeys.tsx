import React, { useEffect } from "react";
import styles from "styles/components/Profile/Api/ApiKeys.module.scss";
import ApiKeyTable from "components/Profile/Components/ApiKeys/ApiKeyTable";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";

const ApiKeys: React.FC = () => {
	const {
		apiKeys: { getApiKeys },
	} = useMst();

	useEffect(() => {
		getApiKeys();
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.card_title}>My API Keys</div>
			</div>
			<ApiKeyTable />
		</div>
	);
};

export default observer(ApiKeys);

import { useMst } from "models/Root";
import styles from "styles/pages/Terminal.module.scss";
import React from "react";
import { observer } from "mobx-react-lite";
import LoadingSpinner from "components/UI/LoadingSpinner";

interface IProps {
	loadCondition?: boolean;
}

const LoadingOverlay: React.FC<IProps> = ({ loadCondition }) => {
	const {
		terminal: { isLoaded, isLoading },
	} = useMst();

	return !isLoaded ? (
		<div className={styles.widget_loader}>
			<LoadingSpinner />
		</div>
	) : isLoading || loadCondition ? (
		<div className={styles.widget_loading_overlay}>
			<LoadingSpinner />
		</div>
	) : null;
};

export default observer(LoadingOverlay);

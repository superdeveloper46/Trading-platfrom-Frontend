import classnames from "classnames";
import React from "react";
import styles from "styles/components/UI/SuccessScreen.module.scss";
import CheckMark from "./CheckMark";

const SuccessScreen: React.FC = ({ children }) => (
	<div className={classnames(styles.success_container, "aa-fade-in")}>
		<CheckMark />
		{children && <span>{children}</span>}
	</div>
);

export default SuccessScreen;

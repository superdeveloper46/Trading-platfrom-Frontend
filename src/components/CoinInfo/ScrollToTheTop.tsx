import classnames from "classnames";
import { useSticky } from "hooks/useSticky";
import React from "react";
import styles from "styles/components/CoinInfo/ScrollToTheTop.module.scss";

const ScrollToTheTop = () => {
	const { isSticky } = useSticky(500);
	const onClick = () => window.scrollTo({ top: 0, behavior: "smooth" });
	return isSticky ? (
		<div className={classnames(styles.Container, "aa-fade-in")} onClick={onClick}>
			<i className="ai ai-mini_up" />
		</div>
	) : null;
};

export default ScrollToTheTop;

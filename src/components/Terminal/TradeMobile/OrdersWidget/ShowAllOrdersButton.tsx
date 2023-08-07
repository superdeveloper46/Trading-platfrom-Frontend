import React, { useState } from "react";
import securityMessages from "messages/security";
import { useIntl } from "react-intl";
import cn from "classnames";
import styles from "styles/pages/TerminalMobile.module.scss";
import AllOrdersWindow from "./AllOrdersWindow";

const ShowAllOrdersButton: React.FC = () => {
	const [showAll, setShowAll] = useState<boolean>(false);
	const { formatMessage } = useIntl();

	const showAllOrdersModal = (): void => {
		setShowAll(true);
	};

	const hideAllOrdersModal = (): void => {
		setShowAll(false);
	};

	return (
		<>
			<div className={styles.show_all_button_row}>
				<button className={styles.show_all_button} type="button" onClick={showAllOrdersModal}>
					<div className={styles.show_all_button_inner_wrapper}>
						<span className={styles.show_all_button_text}>
							{formatMessage(securityMessages.show_all_sessions)}
						</span>
						<i className={cn(styles.orders_show_all_icon, "ai ai-chevron_right")} />
					</div>
				</button>
			</div>

			{showAll ? <AllOrdersWindow show={showAll} hide={hideAllOrdersModal} /> : null}
		</>
	);
};

export default ShowAllOrdersButton;

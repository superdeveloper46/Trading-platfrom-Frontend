import React, { useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import styles from "styles/pages/Terminal.module.scss";
import historyMessages from "messages/history";
import { useMst } from "models/Root";
import useAccountType from "hooks/useAccountType";
import { ACCOUNT_TYPE } from "constants/exchange";
import CheckBox from "components/UI/CheckBox";
import Tooltip from "components/UI/Tooltip";
import { queryVars } from "constants/query";
import CancelAllOrdersModal from "../modals/CancelAllOrdersModal";

const Options: React.FC = () => {
	const {
		terminal: { pair, showAllOpenedOrders, setShowAllOpenedOrders },
		history: { openedOrdersPairLabels, openedOrders, loadOpenedOrders, setFilteringSymbol },
	} = useMst();
	const [isCancelAllModalOpen, setIsCancelAllModalOpen] = useState<boolean>(false);
	const { formatMessage } = useIntl();
	const type = useAccountType();
	const pairSymbol = pair?.symbol ?? "";

	const toggleIsShowAllActiveOrders = () => {
		const nextShowAll = !showAllOpenedOrders;

		const params = {
			pair: nextShowAll ? undefined : pairSymbol,
			[queryVars.page_size]: 100,
			[queryVars.wallet_type]: ACCOUNT_TYPE[type],
		};
		loadOpenedOrders(params);
		setShowAllOpenedOrders(nextShowAll);
		setFilteringSymbol(nextShowAll ? "" : pairSymbol);
	};

	const handleCancelAllModalClose = () => {
		setIsCancelAllModalOpen(false);
	};

	const handleOpenCancelAllModal = () => {
		if (openedOrders.length) {
			setIsCancelAllModalOpen(true);
		}
	};

	return (
		<div className={cn(styles.orders_history_options, !openedOrders.length && styles.disabled)}>
			<div className={styles.orders_history_options_checkbox_container}>
				<CheckBox
					name="show_all"
					centered
					checked={showAllOpenedOrders}
					onChange={toggleIsShowAllActiveOrders}
				>
					{formatMessage(historyMessages.show_all)}
				</CheckBox>
			</div>
			<button onClick={handleOpenCancelAllModal} type="button" data-for="cancel-all" data-tip>
				<i className="ai ai-error_outlined" />
			</button>
			<Tooltip id="cancel-all" place="left" text={formatMessage(historyMessages.cancel_all)} />
			{isCancelAllModalOpen && (
				<CancelAllOrdersModal
					isOpen
					onClose={handleCancelAllModalClose}
					symbol={showAllOpenedOrders ? "" : pair?.symbol}
					pairs={openedOrdersPairLabels}
				/>
			)}
		</div>
	);
};

export default observer(Options);

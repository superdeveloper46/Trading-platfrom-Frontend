import React, { useEffect, useState } from "react";
import cn from "classnames";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";
import Tab from "components/UI/Tab";
import messages from "messages/exchange";
import styles from "styles/pages/Terminal.module.scss";
import useAccountType from "hooks/useAccountType";
import { ACCOUNT_TYPE } from "constants/exchange";
import { AccountTypeEnum } from "types/account";
import PositionsTable from "./PositionsTable";

const Positions: React.FC = () => {
	const {
		history: { positions, loadPositions },
		global: { isAuthenticated },
		terminal: { pair },
	} = useMst();
	const { formatMessage } = useIntl();
	const pairSymbol = pair?.symbol ?? "";
	const type = useAccountType();
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const params = {
		pair: type === AccountTypeEnum.CROSS ? undefined : pairSymbol,
		wallet_type: ACCOUNT_TYPE[type],
	};

	const toggleExpand = () => {
		setIsExpanded((prevState) => !prevState);
	};

	useEffect(() => {
		let interval: NodeJS.Timer;
		if (isAuthenticated && pairSymbol) {
			loadPositions(params);
			interval = setInterval(() => {
				loadPositions(params);
			}, 5000);
		}
		return () => {
			clearInterval(interval);
		};
	}, [isAuthenticated, pairSymbol, type]);

	useEffect(() => {
		if (positions.length) {
			setIsExpanded(true);
		}
	}, [positions.length]);

	return (
		<div className={cn(styles.widget, styles.positions_widget)}>
			<div className={cn(styles.positions_header, isExpanded && styles.expanded)}>
				<Tab className={styles.positions_tab} label={formatMessage(messages.positions)}>
					&nbsp;<span>({positions.length})</span>
				</Tab>
				<button type="button" className={styles.positions_expand_button} onClick={toggleExpand}>
					<i className={`ai ai-chevron_${isExpanded ? "up" : "down"}`} />
				</button>
			</div>
			{isExpanded && <PositionsTable />}
		</div>
	);
};

export default observer(Positions);

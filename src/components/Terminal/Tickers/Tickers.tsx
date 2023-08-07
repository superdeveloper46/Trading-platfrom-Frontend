import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import useTerminalLayout from "hooks/useTerminalLayout";
import cn from "classnames";
import { useMst } from "models/Root";
import useWindowSize from "hooks/useWindowSize";
import { TerminalLayoutEnum } from "types/exchange";
import styles from "styles/pages/Terminal.module.scss";
import useTimeout from "hooks/useTimeout";
import TradeTypeTabs from "./TradeTypeTabs";
import QuotedCurrenciesTabs from "./QuotedCurrenciesTabs";
import TickersTable from "./TickersTable";
import TickersFilter from "./TickersFilter";

interface IProps {
	absolute?: boolean;
}

const Tickers: React.FC<IProps> = ({ absolute }) => {
	const {
		render,
		terminal: { isTickersExpanded, isTickersAbsolute, setIsTickersAbsolute, setIsTickersExpanded },
	} = useMst();
	const layout = useTerminalLayout();
	const isAdvaned = layout === TerminalLayoutEnum.ADVANCED;
	const isStandard = layout === TerminalLayoutEnum.STANDARD;
	const { medium } = useWindowSize();
	const ref = useRef<HTMLDivElement>(null);
	const timeout = useTimeout();

	const toggleExpand = () => {
		setIsTickersExpanded(!isTickersExpanded);
	};

	const handleOutsideClick = (e: any) => {
		if (!ref.current?.contains(e.target)) {
			setIsTickersAbsolute(false);
		}
	};

	useEffect(() => {
		if (isTickersAbsolute) {
			timeout(() => document.addEventListener("click", handleOutsideClick));
		}

		return () => {
			setIsTickersAbsolute(false);
			document.removeEventListener("click", handleOutsideClick);
		};
	}, [isTickersAbsolute]);

	return (
		<div
			className={cn(styles.tickers_widget, styles.widget, {
				[styles.collapsed]: !isTickersExpanded,
				[styles.advanced]: isAdvaned,
				[styles.absolute]: absolute,
				[styles.standard]: isStandard,
				[styles.mobile]: medium,
			})}
			ref={ref}
		>
			{render.margin && isAdvaned && <TradeTypeTabs />}
			<QuotedCurrenciesTabs />
			{isTickersExpanded && (
				<>
					<TickersFilter />
					<TickersTable mobile={medium} />
				</>
			)}
			{!isTickersAbsolute && !medium && (
				<button
					type="button"
					onClick={toggleExpand}
					className={cn(styles.tickers_expand_btn, styles[layout.toLowerCase()], {
						[styles.right]: isAdvaned,
						[styles.expanded]: isTickersExpanded,
					})}
				>
					<i className={`ai ai-chevron_${isTickersExpanded ? "left" : "right"}`} />
				</button>
			)}
		</div>
	);
};

export default observer(Tickers);

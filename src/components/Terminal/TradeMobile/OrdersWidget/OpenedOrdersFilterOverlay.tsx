import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import styles from "styles/pages/TerminalMobile.module.scss";
import cn from "classnames";
import commonMessages from "messages/common";
import { MobileFilterOrderSideEnum } from "types/exchange";

interface Props {
	show: boolean;
	changeFilterState: (filterOption: MobileFilterOrderSideEnum) => void;
	back: () => void;
	currentState: string;
}

const ActiveOrdersFilterOverlay: React.FC<Props> = ({
	show,
	changeFilterState,
	back,
	currentState,
}) => {
	const { formatMessage } = useIntl();
	const [filterState, setFilterState] = useState<MobileFilterOrderSideEnum>(
		MobileFilterOrderSideEnum.ALL,
	);
	const [allIsActive, setAllIsActive] = useState<boolean>(true);
	const [sellIsActive, setSellIsActive] = useState<boolean>(false);
	const [buyIsActive, setBuyIsActive] = useState<boolean>(false);

	useEffect(() => {
		setFilterState(currentState as MobileFilterOrderSideEnum);
	}, []);

	useEffect(() => {
		recountCheckValues();
	}, [filterState]);

	const handleBack = (): void => {
		back();
	};

	const recountCheckValues = (): void => {
		switch (filterState) {
			case MobileFilterOrderSideEnum.ALL:
				setAllIsActive(true);
				setSellIsActive(false);
				setBuyIsActive(false);
				break;
			case MobileFilterOrderSideEnum.SELL:
				setAllIsActive(false);
				setSellIsActive(true);
				setBuyIsActive(false);
				break;
			case MobileFilterOrderSideEnum.BUY:
				setAllIsActive(false);
				setSellIsActive(false);
				setBuyIsActive(true);
				break;
			default:
				setAllIsActive(true);
				setSellIsActive(false);
				setBuyIsActive(false);
		}

		changeFilterState(filterState);
	};

	const changeFilter = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const { name } = e.currentTarget.dataset;
		if (name) {
			setFilterState(name as MobileFilterOrderSideEnum);
		}
	};

	return (
		<div
			className={cn(styles.active_filters_overlay_fader, show && styles.show)}
			onClick={handleBack}
		>
			<div className={styles.active_filters_overlay_values_wrapper}>
				<div className={styles.filter_overlay_title}>
					{formatMessage(commonMessages.active_orders_apply_filter)}
				</div>
				<div
					className={styles.active_filter_value}
					data-name={MobileFilterOrderSideEnum.ALL}
					onClick={changeFilter}
				>
					<div className={styles.active_filters_check_and_text}>
						{allIsActive ? (
							<i className={cn(styles.active_orders_check_icon, "ai ai-check_mini")} />
						) : null}
						<div className={styles.active_filter_value_text}>
							<span>{formatMessage(commonMessages.active_orders_all)}</span>
						</div>
					</div>
				</div>
				<div
					className={styles.active_filter_value}
					data-name={MobileFilterOrderSideEnum.SELL}
					onClick={changeFilter}
				>
					<div className={styles.active_filters_check_and_text}>
						{sellIsActive ? (
							<i className={cn(styles.active_orders_check_icon, "ai ai-check_mini")} />
						) : null}
						<div className={styles.active_filter_value_text}>
							<span>{formatMessage(commonMessages.active_orders_sell)}</span>
						</div>
					</div>
				</div>
				<div
					className={cn(styles.active_filter_value, styles.last)}
					data-name={MobileFilterOrderSideEnum.BUY}
					onClick={changeFilter}
				>
					<div className={styles.active_filter_value_text}>
						<div className={styles.active_filters_check_and_text}>
							{buyIsActive ? (
								<i className={cn(styles.active_orders_check_icon, "ai ai-check_mini")} />
							) : null}
							<div className={styles.active_filter_value_text}>
								<span>{formatMessage(commonMessages.active_orders_buy)}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<button
				className={styles.active_filters_overlay_back_button}
				type="button"
				onClick={handleBack}
			>
				<span className={styles.active_filters_abort_button_text}>
					{formatMessage(commonMessages.back_btn)}
				</span>
			</button>
		</div>
	);
};

export default ActiveOrdersFilterOverlay;

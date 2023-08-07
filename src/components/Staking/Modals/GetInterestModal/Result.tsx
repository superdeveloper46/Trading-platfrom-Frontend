import React from "react";
import { useIntl } from "react-intl";
import stakingMessages from "messages/staking";
import stylesModal from "styles/components/UI/Modal.module.scss";
import cn from "classnames";

type Props = {
	amount: number;
	currencyCode: string;
};

const Result: React.FC<Props> = ({ amount, currencyCode }) => {
	const { formatMessage, formatNumber } = useIntl();
	return (
		<div className={cn(stylesModal.result_container, "aa-fade-in")}>
			<div className={stylesModal.result_icon}>
				<i className="ai ai-check_outline" />
			</div>
			<div className={stylesModal.result_info}>
				{formatMessage(stakingMessages.income_successfully_transferred, {
					value: `${formatNumber(amount, {
						maximumFractionDigits: 8,
						useGrouping: false,
					})} ${currencyCode}`,
				})}
			</div>
		</div>
	);
};

export default Result;

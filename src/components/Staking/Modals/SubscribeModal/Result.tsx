import React from "react";
import { useIntl } from "react-intl";
import stakingMessages from "messages/staking";
import cn from "classnames";
import stylesModal from "styles/components/UI/Modal.module.scss";
import styles from "styles/pages/Staking.module.scss";
import Button from "components/UI/Button";

type Props = {
	additionalFunding: boolean;
	onReset: () => void;
	currencyCode: string;
	amount: number;
};

const Result: React.FC<Props> = ({ additionalFunding, onReset, currencyCode, amount }) => {
	const { formatMessage, formatNumber } = useIntl();
	return (
		<div className={cn(stylesModal.result_container, "aa-fade-in")}>
			<div className={stylesModal.result_icon}>
				<i className="ai ai-check_outline" />
			</div>
			<div className={stylesModal.result_info}>
				{additionalFunding
					? formatMessage(stakingMessages.staking_successfully_replenished, {
							currency: currencyCode,
					  })
					: formatMessage(stakingMessages.position_opened)}
				<b>
					{formatNumber(amount, {
						maximumFractionDigits: 8,
						useGrouping: false,
					})}
					&nbsp;
					{currencyCode}
				</b>
			</div>
			{additionalFunding && (
				<Button
					className={styles.add_more_funds_button}
					label={formatMessage(stakingMessages.add_funds)}
					variant="text"
					onClick={onReset}
				/>
			)}
		</div>
	);
};

export default Result;

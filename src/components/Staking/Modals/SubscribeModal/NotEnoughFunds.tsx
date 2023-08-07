import React from "react";
import { useIntl } from "react-intl";

import financeMessages from "messages/finance";
import stakingMessages from "messages/staking";
import styles from "styles/pages/Staking.module.scss";
import Button from "components/UI/Button";
import InternalLink from "components/InternalLink";
import { routes } from "constants/routing";

interface Props {
	minAmount: number;
	currencyCode: string;
}

const NotEnoughFunds: React.FC<Props> = ({ currencyCode, minAmount }) => {
	const { formatMessage, formatNumber } = useIntl();
	return (
		<div className={styles.not_enough_funds_container}>
			<i className="ai ai-warning" />
			<span>
				{formatMessage(stakingMessages.not_enough_funds, {
					deposit: (
						<InternalLink to={routes.profile.getDepositCurrency(currencyCode)} blank>
							{formatMessage(financeMessages.deposit)}
						</InternalLink>
					),
				})}
			</span>
			<div className={styles.not_enough_funds_button_group}>
				<InternalLink to={routes.profile.getDepositCurrency(currencyCode)} blank>
					<Button
						variant="filled"
						color="primary"
						iconCode="mini_down_right"
						iconAlign="left"
						label={`${formatMessage(financeMessages.deposit)} ${currencyCode}`}
						fullWidth
					/>
				</InternalLink>
				<span>
					{formatMessage(stakingMessages.min_rate)}:&nbsp;
					{formatNumber(minAmount, {
						maximumFractionDigits: 8,
						useGrouping: false,
					})}
					&nbsp;
					{currencyCode}
				</span>
			</div>
		</div>
	);
};

export default NotEnoughFunds;

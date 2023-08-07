import React from "react";
import { useIntl } from "react-intl";

import financeMessages from "messages/finance";
import styles from "styles/components/DepositWithdrawal.module.scss";
import InternalLink from "components/InternalLink";
import Tooltip from "components/UI/Tooltip";
import { routes } from "constants/routing";

interface IFeeInfo {
	fee: number;
	currencyCode: string;
}

const WithdrawalFee: React.FC<IFeeInfo> = React.memo(({ fee, currencyCode }) => {
	const { formatMessage, formatNumber } = useIntl();
	return (
		<div className={styles.action_fee}>
			{formatMessage(financeMessages.fee)}
			<span>
				{formatNumber(fee, {
					maximumFractionDigits: 8,
					useGrouping: false,
				})}
				&nbsp;{currencyCode}
			</span>
			<Tooltip
				id="fees"
				place="top"
				opener={
					<InternalLink to={routes.fees} blank>
						<i className="ai ai-hint" />
					</InternalLink>
				}
			>
				{formatMessage(financeMessages.view_fees)}
			</Tooltip>
		</div>
	);
});

export default WithdrawalFee;

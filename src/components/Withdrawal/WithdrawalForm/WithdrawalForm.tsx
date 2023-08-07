import React from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import commonMessages from "messages/common";
import financeMessages from "messages/finance";
import styles from "styles/components/DepositWithdrawal.module.scss";
import { useMst } from "models/Root";
import Breadcrumbs from "components/Breadcrumbs";
import { routes } from "constants/routing";
import InternalLink from "components/InternalLink";
import CoinStep from "./CoinStep";
import RequisitesStep from "./RequisitesStep";

const WithdrawalForm: React.FC = () => {
	const {
		account: { profileStatus },
	} = useMst();

	const { formatMessage } = useIntl();

	return (
		<div className={styles.card_wrapper}>
			<Breadcrumbs
				className={styles.breadcrumbs}
				links={[{ link: routes.profile.wallets, label: formatMessage(financeMessages.my_wallet) }]}
				current={formatMessage(commonMessages.withdraw)}
			/>
			<div className={styles.link_group}>
				{!profileStatus?.is_sub_account && (
					<InternalLink to={routes.transfers.root}>
						<i className="ai ai-switch-horizontal-01" />
						Transfer
						<span>
							{formatMessage(financeMessages.perform_an_internal_transfer)}
							<i className="ai ai-chevron_right" />
						</span>
					</InternalLink>
				)}
			</div>
			<div className={styles.steps_container}>
				<CoinStep />
				<RequisitesStep />
			</div>
		</div>
	);
};

export default observer(WithdrawalForm);

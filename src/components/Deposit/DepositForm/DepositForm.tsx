import React from "react";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";

import messages from "messages/finance";
import InternalLink from "components/InternalLink";
import styles from "styles/components/DepositWithdrawal.module.scss";
import mastercardLogo from "assets/images/buy_crypto/mastercard.svg";
import visaLogo from "assets/images/buy_crypto/visa.svg";
import { useMst } from "models/Root";
import Breadcrumbs from "components/Breadcrumbs";
import buyCryptoMessages from "messages/buy_crypto";
import { routes } from "constants/routing";
import CoinStep from "./CoinStep";
import RequisitesStep from "./RequisitesStep";

const DepositForm: React.FC = () => {
	const { render } = useMst();
	const { formatMessage } = useIntl();

	return (
		<div className={styles.card_wrapper}>
			<Breadcrumbs
				className={styles.breadcrumbs}
				links={[{ link: routes.profile.wallets, label: formatMessage(messages.my_wallet) }]}
				current={formatMessage(messages.deposit)}
			/>
			{render.buyCrypto && (
				<InternalLink to={routes.buyCrypto.root}>
					<div className={styles.buy_crypto}>
						<span className={styles.buy_crypto_text}>
							{formatMessage(buyCryptoMessages.from_your_bank_card)}
						</span>
						<img src={visaLogo} alt="VISA" />
						<img src={mastercardLogo} alt="MASTERCARD" />
						<i className="ai ai-chevron_right" />
					</div>
				</InternalLink>
			)}
			{/* <div className={styles.link_group}> */}
			{/*	{!profileStatus?.is_sub_account && <InternalLink to={routes.transfers.root} />} */}
			{/* </div> */}
			<div className={styles.steps_container}>
				<CoinStep />
				<RequisitesStep />
			</div>
		</div>
	);
};

export default observer(DepositForm);

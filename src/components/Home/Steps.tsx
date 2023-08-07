import React from "react";
import { useIntl } from "react-intl";
import homepageMessages from "messages/home";
import stakingMessages from "messages/staking";
import Step1Img from "assets/images/home/step-1.svg";
import Step2Img from "assets/images/home/step-2.svg";
import Step3Img from "assets/images/home/step-3.svg";
import Step4Img from "assets/images/home/step-4.svg";
import PartnerVpnIcon from "assets/images/home/partner-vpn-icon.svg";
import styles from "styles/pages/Home.module.scss";
import InternalLink from "components/InternalLink";
import Button from "components/UI/Button";
import { routes } from "constants/routing";

const Steps: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<section className={styles.section}>
			<div className={styles.steps_container}>
				<h3 className={styles.steps_title}>
					{formatMessage(homepageMessages.simple_steps_to_buying_cryptocurrency)}
				</h3>
				<div className={styles.steps_list}>
					<div>
						<img src={Step1Img} alt="signup" width="48" height="48" loading="lazy" />
						<h3>{formatMessage(stakingMessages.step)}&nbsp;1</h3>
						<span>{formatMessage(homepageMessages.register_on_our_platform)}</span>
						<InternalLink to={routes.register.root}>
							<Button
								variant="filled"
								color="primary"
								fullWidth
								label={formatMessage(homepageMessages.register)}
								mini
							/>
						</InternalLink>
					</div>
					<div>
						<img src={Step2Img} alt="verification" width="68" height="48" loading="lazy" />
						<h3>{formatMessage(stakingMessages.step)}&nbsp;2</h3>
						<span>{formatMessage(homepageMessages.complete_verification)}</span>
						<InternalLink to={routes.verification.root}>
							<Button
								variant="filled"
								color="primary"
								fullWidth
								label={formatMessage(homepageMessages.verification)}
								mini
							/>
						</InternalLink>
					</div>
					<div>
						<img src={Step3Img} alt="buy-crypto" width="83" height="48" loading="lazy" />
						<h3>{formatMessage(stakingMessages.step)}&nbsp;3</h3>
						<span>{formatMessage(homepageMessages.buy_cryptocurrency_or_make_a_deposit)}</span>
						<InternalLink to={routes.buyCrypto.getPair("USD_BTC")}>
							<Button
								variant="filled"
								color="primary"
								fullWidth
								label={formatMessage(homepageMessages.buy_crypto)}
								mini
							/>
						</InternalLink>
					</div>
					<div>
						<img src={Step4Img} alt="trade" width="61" height="48" loading="lazy" />
						<h3>{formatMessage(stakingMessages.step)}&nbsp;4</h3>
						<span>{formatMessage(homepageMessages.start_trading)}</span>
						<InternalLink to={routes.trade.getPair("BTC_USDT")}>
							<Button
								variant="filled"
								color="primary"
								fullWidth
								label={formatMessage(homepageMessages.trade)}
								mini
							/>
						</InternalLink>
					</div>
				</div>
				<div className={styles.steps_partner_vpn}>
					<a
						href="https://vpnproxymaster.com/w/best-vpn-for-crypto?utm_source=BTAlpha&utm_medium=website&utm_campaign=partnership&utm_term=vpn&utm_content=crypto"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img src={PartnerVpnIcon} width="30" height="30" alt="VPN Proxy Master" />
						{formatMessage(
							homepageMessages.secure_your_cryptocurrency_transactions_with_vpn_proxy_master,
						)}
						<i className="ai ai-chevron_right" />
					</a>
				</div>
			</div>
		</section>
	);
};

export default Steps;

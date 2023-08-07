import React from "react";
import { useIntl } from "react-intl";
import depositWithdraw from "assets/images/home/advantage-deposit-withdraw.svg";
import dynamicFees from "assets/images/home/advantage-dynamic-fees.svg";
import referral from "assets/images/home/advantage-referral.svg";
import security from "assets/images/home/advantage-security.svg";
import support from "assets/images/home/advantage-support.svg";
import tickers from "assets/images/home/advantage-tickers.svg";
import background from "assets/images/home/advantages-bg.svg";
import homeMessages from "messages/home";
import styles from "styles/pages/Home.module.scss";

const Advantages: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<section className={styles.section}>
			<h2 className={styles.section_title}>
				{formatMessage(homeMessages.the_most_trusted_cryptocurrency_platform)}
			</h2>
			<span className={styles.section_subtitle}>
				{formatMessage(homeMessages.here_are_some_reasons_why_we_are_the_best)}
			</span>
			<img
				className={styles.advantages_background}
				src={background}
				width="1548"
				height="746"
				alt="advantages-background"
				loading="lazy"
			/>
			<div className={styles.advantages_list}>
				<div>
					<img src={dynamicFees} width="136" height="106" alt="dynamic-fees" loading="lazy" />
					<h3>
						{formatMessage(homeMessages.alpha_feature_1, {
							breakingLine: <br />,
						})}
					</h3>
				</div>
				<div>
					<img src={security} width="136" height="111" alt="security" loading="lazy" />
					<h3>
						{formatMessage(homeMessages.alpha_feature_2, {
							breakingLine: <br />,
						})}
					</h3>
				</div>
				<div>
					<img
						src={depositWithdraw}
						width="136"
						height="101"
						alt="fast-deposit-withdraw"
						loading="lazy"
					/>
					<h3>
						{formatMessage(homeMessages.alpha_feature_3, {
							breakingLine: <br />,
						})}
					</h3>
				</div>
				<div>
					<img src={referral} width="136" height="85" alt="referral-program" loading="lazy" />
					<h3>
						{formatMessage(homeMessages.alpha_feature_4, {
							breakingLine: <br />,
						})}
					</h3>
				</div>
				<div>
					<img src={tickers} width="136" height="106" alt="real-time-tickers" loading="lazy" />
					<h3>
						{formatMessage(homeMessages.alpha_feature_5, {
							breakingLine: <br />,
						})}
					</h3>
				</div>
				<div>
					<img src={support} width="136" height="101" alt="support" loading="lazy" />
					<h3>
						{formatMessage(homeMessages.alpha_feature_6, {
							breakingLine: <br />,
						})}
					</h3>
				</div>
			</div>
		</section>
	);
};

export default Advantages;

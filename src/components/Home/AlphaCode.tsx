import React from "react";
import { useIntl } from "react-intl";
import qrBg from "assets/images/home/alpha-code-qr-bg.svg";
import wallet1 from "assets/images/home/alpha-code-wallet-1.svg";
import wallet2 from "assets/images/home/alpha-code-wallet-2.svg";
import ellipse from "assets/images/home/alpha-code-ellipse.svg";
import coins from "assets/images/home/alpha-code-coins.svg";
import walletsBg from "assets/images/home/alpha-code-wallets-bg.svg";
import homeMessages from "messages/home";
import commonMesssages from "messages/common";
import styles from "styles/pages/Home.module.scss";
import InternalLink from "components/InternalLink";
import { routes } from "constants/routing";

const AlphaCode: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<section className={styles.section}>
			<h2 className={styles.section_title}>{formatMessage(homeMessages.alpha_code)}</h2>
			<span className={styles.section_subtitle}>
				{formatMessage(homeMessages.alpha_code_desc, {
					breakingLine: <br />,
				})}
			</span>
			<InternalLink className={styles.alpha_code_more_link} to={routes.alphaCodes.root}>
				{formatMessage(commonMesssages.more)}
				<i className="ai ai-chevron_right" />
			</InternalLink>
			<div className={styles.alpha_code_container}>
				<img
					className="alpha-code-qr"
					src={qrBg}
					width="620"
					height="420"
					alt="alpha-code-qr"
					loading="lazy"
				/>
				<img
					className="alpha-code-wallet-1"
					src={wallet1}
					width="220"
					height="194"
					alt="alpha-code-wallet-1"
					loading="lazy"
				/>
				<img
					className="alpha-code-ellipse"
					src={ellipse}
					width="482"
					height="482"
					alt="alpha-code-ellipse"
					loading="lazy"
				/>
				<img
					className="alpha-code-coins"
					src={coins}
					width="397"
					height="130"
					alt="alpha-code-coins"
					loading="lazy"
				/>
				<img
					className="alpha-code-wallet-2"
					src={wallet2}
					width="266"
					height="200"
					alt="alpha-code-wallet-2"
					loading="lazy"
				/>
				<img
					className="alpha-code-wallets-bg"
					src={walletsBg}
					width="2560"
					height="1051"
					alt="alpha-code-wallet-bg"
					loading="lazy"
				/>
			</div>
		</section>
	);
};

export default AlphaCode;

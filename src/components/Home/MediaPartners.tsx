import React from "react";
import { useIntl } from "react-intl";
import lines from "assets/images/home/media-partners-lines.svg";
import crypto from "assets/images/home/media-partner-crypto.svg";
import walletInvestor from "assets/images/home/media-partner-wallet-investor.svg";
import digitalNotice from "assets/images/home/media-partner-digital.svg";
import coinpedia from "assets/images/home/media-partner-coinpedia.svg";
import hub from "assets/images/home/media-partner-hub.svg";
import forklog from "assets/images/home/media-partner-forklog.svg";
import alptr from "assets/images/home/media-partner-alptr.svg";
import homeMessages from "messages/home";
import styles from "styles/pages/Home.module.scss";
import ExternalLink from "components/ExternalLink";
import config from "helpers/config";

const MediaPartners: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<section className={styles.section}>
			<div className={styles.media_partners_container}>
				<img src={lines} width="1607" height="1500" alt="media-partners-lines" loading="lazy" />
				<h2>{formatMessage(homeMessages.mediapartners, { breakingLine: <br /> })}</h2>
				<div className={styles.media_partners_list}>
					{config.department !== "ALP Turk" && (
						<a href="https://alptr.com" target="_blank" rel="noopener noreferrer">
							<img src={alptr} width="222" height="28" alt="ALP Turkish" loading="lazy" />
						</a>
					)}
					<ExternalLink to="https://www.cryptonewspoint.com">
						<img src={crypto} width="105" height="38" alt="crypto-news" loading="lazy" />
					</ExternalLink>
					<ExternalLink to="https://walletinvestor.com">
						<img src={walletInvestor} width="88" height="42" alt="wallet-investor" loading="lazy" />
					</ExternalLink>
					<ExternalLink to="https://www.digitalnotice.in">
						<img src={digitalNotice} width="92" height="61" alt="digital-notice" loading="lazy" />
					</ExternalLink>
					<ExternalLink to="https://coinpedia.org">
						<img src={coinpedia} width="118" height="20" alt="coinpedia" loading="lazy" />
					</ExternalLink>
					<ExternalLink to="https://hub.forklog.com/companies/btc-alpha">
						<img src={hub} width="92" height="30" alt="hub" loading="lazy" />
					</ExternalLink>
					<ExternalLink to="https://forklog.com">
						<img src={forklog} width="124" height="30" alt="forklog" loading="lazy" />
					</ExternalLink>
				</div>
			</div>
		</section>
	);
};

export default MediaPartners;

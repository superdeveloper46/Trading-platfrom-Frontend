import React from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import advCash from "assets/images/home/advcash.svg";
import payeer from "assets/images/home/payeer.svg";
import mercuryo from "assets/images/home/mercuryo.svg";
import nixMoney from "assets/images/home/nix-money.svg";
import perfectMoney from "assets/images/home/perfect-money.svg";
import ellipse from "assets/images/home/payment-ellipse-1.svg";
import ellipse2 from "assets/images/home/payment-ellipse-2.svg";
import homeMessages from "messages/home";
import styles from "styles/pages/Home.module.scss";

const Payment: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<section className={cn(styles.section, styles.payment)}>
			<h2 className={styles.section_title}>
				{formatMessage(homeMessages.deposit_and_withdraw, {
					breakingLine: <br />,
				})}
			</h2>
			<span className={styles.section_subtitle}>
				{formatMessage(homeMessages.deposit_and_withdraw_desc)}
			</span>
			<img
				className={styles.payment_ellipse}
				src={ellipse}
				alt="ellipse"
				width="412"
				height="412"
				loading="lazy"
			/>
			<img
				className={styles.payment_ellipse_2}
				src={ellipse2}
				alt="allipse-2"
				width="1450"
				height="1355"
				loading="lazy"
			/>
			<div className={styles.payment_list}>
				<img src={advCash} alt="adv-cash" width="56" height="46" loading="lazy" />
				<img src={payeer} alt="payeer" width="185" height="39" loading="lazy" />
				<img src={perfectMoney} alt="perfect-money" width="50" height="50" loading="lazy" />
				<img src={mercuryo} alt="mercuryo" width="263" height="40" loading="lazy" />
				<img src={nixMoney} alt="nix-money" width="72" height="40" loading="lazy" />
			</div>
		</section>
	);
};

export default Payment;

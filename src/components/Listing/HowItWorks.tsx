import React from "react";
import cn from "classnames";
import { useIntl } from "react-intl";

import listingMessages from "messages/listing";
import howItWorksIcon from "assets/images/listing/how-it-works-icon.png";
import styles from "styles/pages/Listing.module.scss";

const HowItWorks: React.FC = () => {
	const { formatMessage } = useIntl();

	const steps = [
		formatMessage(listingMessages.what_will_you_get_item_1),
		formatMessage(listingMessages.what_will_you_get_item_2),
		formatMessage(listingMessages.what_will_you_get_item_3),
		formatMessage(listingMessages.what_will_you_get_item_4),
	];

	return (
		<div className={styles.how_it_works}>
			<div className={cn(styles.content, styles.column, styles.how_it_works)}>
				<div className={styles.why_we_title}>
					{formatMessage(listingMessages.what_will_you_get)}
					<img className={styles.how_it_works_icon} src={howItWorksIcon} alt="Coins" />
				</div>
				{/* <span className={styles.why_we_desc}> */}
				{/*	Мы ставим в приоритет комфортную торговлю, широкий выбор возможностей для пользователей и */}
				{/*	доступность цифровой экономики для каждого. */}
				{/* </span> */}
				<div className={styles.how_it_works_list}>
					{steps.map((text, idx) => (
						<div key={idx} className={styles.how_it_works_item}>
							<span className={styles.number}>{idx + 1}.</span>
							<span className={styles.info}>{text}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default HowItWorks;

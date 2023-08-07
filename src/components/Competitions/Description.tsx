import React from "react";
import { useIntl } from "react-intl";
import cn from "classnames";

import competitionsMessages from "messages/competitions";
import skillsImage from "assets/images/competitions/skills-image.png";
import cashImage from "assets/images/competitions/cash-image.png";
import prizesImage from "assets/images/competitions/prizes-image.png";
import styles from "styles/pages/Competitions.module.scss";
import pageStyles from "styles/pages/Page.module.scss";

const Description: React.FC = () => {
	const { formatMessage } = useIntl();

	const steps = [
		{
			image: skillsImage,
			title: formatMessage(competitionsMessages.upgrade_your_skill),
			description: formatMessage(competitionsMessages.improve_your_trading_skill),
		},
		{
			image: cashImage,
			title: formatMessage(competitionsMessages.no_cash_investment),
			description: formatMessage(competitionsMessages.participation_in_tournaments_is_free),
		},
		{
			image: prizesImage,
			title: formatMessage(competitionsMessages.win_real_prizes),
			description: formatMessage(
				competitionsMessages.favorable_fund_distribution_for_all_participants,
			),
		},
	];

	return (
		<div className={pageStyles.section_container}>
			<div className={styles.description_container}>
				<span className={cn(styles.title, styles.centered)}>
					{formatMessage(competitionsMessages.description)}
				</span>
				<div className={styles.page_steps}>
					{steps.map(({ description, image, title }) => (
						<div key={title} className={styles.page_step}>
							<img
								className={styles.page_step_image}
								src={image}
								width="90"
								height="50"
								alt="skills"
							/>
							<span className={styles.page_step_title}>{title}</span>
							<span className={styles.page_step_description}>{description}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Description;

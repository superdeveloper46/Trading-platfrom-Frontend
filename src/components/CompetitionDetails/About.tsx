import React from "react";
import competitionsMessages from "messages/competitions";
import commonMessages from "messages/common";
import { useIntl } from "react-intl";
import cn from "classnames";
import pageStyles from "styles/pages/Page.module.scss";
import styles from "styles/pages/CompetitionsDetails.module.scss";
import { ICompetition } from "../../types/competitions";

interface IProps {
	competition?: ICompetition;
}

const About: React.FC<IProps> = ({ competition }) => {
	const { formatMessage } = useIntl();

	const isDemo: boolean = competition?.is_demo ?? false;

	const steps = [
		commonMessages.register,
		competitionsMessages.take_part_in_a_contest,
		isDemo ? commonMessages.demo_exchange_name : commonMessages.exchange,
	];

	return (
		<div className={cn(styles.about_container, pageStyles.card, pageStyles.hasMobileBorder)}>
			<i className="ai ai-info_circle_outline" />
			<div className={styles.content}>
				а
				<h3 className={pageStyles.card_title}>
					{formatMessage(
						isDemo
							? competitionsMessages.how_and_why_to_participate_in_the_demo_trading_battle
							: competitionsMessages.why_should_you_participate_in_the_tournament,
					)}
				</h3>
				<span className={styles.description}>{competition?.description ?? "-"}</span>
			</div>
			<div className={pageStyles.steps}>
				{steps.map((message, i) => (
					<div key={i} className={cn(styles.step, pageStyles.step, pageStyles.center)}>
						<span className={cn(pageStyles.step_num, pageStyles.centered, pageStyles.circle)}>
							{i + 1}
						</span>
						<span className={pageStyles.title}>{formatMessage(message)}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default About;

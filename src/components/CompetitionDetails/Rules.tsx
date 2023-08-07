import React from "react";
import competitionsMessages from "messages/competitions";
import { useIntl } from "react-intl";
import pageStyles from "styles/pages/Page.module.scss";
import styles from "styles/pages/CompetitionsDetails.module.scss";
import cn from "classnames";
import { ICompetition } from "../../types/competitions";
import Markdown from "../UI/Markdown";

interface IProps {
	competition?: ICompetition;
}

const Rules: React.FC<IProps> = ({ competition }) => {
	const { formatMessage } = useIntl();

	return (
		<div className={cn(styles.rules_container, pageStyles.card, pageStyles.hasMobileBorder)}>
			<i className="ai ai-book_open" />
			<div className={cn(styles.title, pageStyles.card_title)}>
				{formatMessage(competitionsMessages.competition_rules_title)}
			</div>
			{competition?.rules ? <Markdown content={competition?.rules} /> : <span>--</span>}
		</div>
	);
};

export default Rules;

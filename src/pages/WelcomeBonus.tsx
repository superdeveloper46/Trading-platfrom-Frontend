import React from "react";
import Helmet from "react-helmet";
import { useIntl } from "react-intl";
import cn from "classnames";

import messages from "messages/welcome_bonus";
import useWindowSize from "hooks/useWindowSize";
import MainLayout from "layouts/MainLayout";
import { Main, PageHeader, Rules } from "components/WelcomeBonus";
import pageStyles from "styles/pages/Page.module.scss";
import styles from "styles/pages/WelcomeBonus.module.scss";

const WelcomeBonus: React.FC = () => {
	const { formatMessage } = useIntl();
	const { mobile } = useWindowSize();

	return (
		<MainLayout>
			<Helmet title={formatMessage(messages.helmet_title)} />
			<PageHeader />
			<div className={cn(pageStyles.content, styles.main_content)}>
				<Main />
			</div>
			{!mobile && (
				<div className={pageStyles.content}>
					<Rules />
				</div>
			)}
		</MainLayout>
	);
};

export default WelcomeBonus;

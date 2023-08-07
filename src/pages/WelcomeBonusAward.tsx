import React from "react";
import Helmet from "react-helmet";
import { useIntl } from "react-intl";
import cn from "classnames";
import pageStyles from "styles/pages/Page.module.scss";
import styles from "styles/pages/WelcomeBonus.module.scss";
import bonusMessages from "messages/welcome_bonus";
import Breadcrumbs from "components/Breadcrumbs";
import MainLayout from "layouts/MainLayout";
import WelcomeBonusAwardForm from "components/WelcomeBonusAward/WelcomeBonusAwardForm";
import { getPageTitle } from "helpers/global";
import { routes } from "constants/routing";

const WelcomeBonusAward: React.FC = () => {
	const { formatMessage } = useIntl();
	const title = getPageTitle("Welcome Bonus Award");

	return (
		<MainLayout>
			<Helmet title={title} />
			<div
				className={cn(
					pageStyles.page_container_outer,
					pageStyles.md,
					styles.welcome_award_container,
				)}
			>
				<Breadcrumbs
					links={[
						{
							link: routes.welcomeBonus.root,
							label: formatMessage(bonusMessages.welcome_title),
						},
					]}
					current={formatMessage(bonusMessages.getShareBonus)}
				/>
				<WelcomeBonusAwardForm />
			</div>
		</MainLayout>
	);
};

export default WelcomeBonusAward;

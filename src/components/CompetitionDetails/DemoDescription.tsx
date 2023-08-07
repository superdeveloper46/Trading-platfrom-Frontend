import React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import cn from "classnames";

import competitionsMessages from "messages/competitions";
import commonMessages from "messages/common";
import pageStyles from "styles/pages/Page.module.scss";
import styles from "styles/pages/CompetitionsDetails.module.scss";
import image1 from "assets/images/competitions/competition-details-about-image.svg";
import image2 from "assets/images/competitions/competition-details-about-image2.svg";
import image3 from "assets/images/competitions/competition-details-about-image3.svg";
import image4 from "assets/images/competitions/competition-details-about-image4.svg";
import { routes } from "constants/routing";
import InternalLink from "../InternalLink";

const DemoDescription: React.FC = () => {
	const { formatMessage } = useIntl();
	const { slug } = useParams<{ slug: string }>();

	const steps = [
		{
			image: image1,
			title: "100 USDTd",
			message: formatMessage(competitionsMessages.complete_verification, {
				verification: (
					<InternalLink to={routes.verification.root}>
						{formatMessage(competitionsMessages.verification)}
					</InternalLink>
				),
			}),
		},
		{
			image: image2,
			title: "200 USDTd",
			message: formatMessage(competitionsMessages.make_a_minimum_deposit, {
				deposit: (
					<InternalLink to={routes.profile.getDepositCurrency("USDT")}>
						{formatMessage(competitionsMessages.deposit)}
					</InternalLink>
				),
				deposit_value: "10 USD",
			}),
		},
		{
			image: image3,
			title: "50 USDTd",
			message: formatMessage(competitionsMessages.invite_a_referral_who_has_passed_verification, {
				friend: (
					<InternalLink to={routes.referrals.root}>
						{formatMessage(competitionsMessages.friend)}
					</InternalLink>
				),
				verification: formatMessage(competitionsMessages.verification),
			}),
		},
		{
			image: image4,
			title: "100 USDTd",
			message: (
				<>
					{formatMessage(competitionsMessages.make_a_post_about_the_contest_on_social_networks)}
					&nbsp;
					<InternalLink to={routes.competitions.getCompetitionBonus(slug || "")}>
						{formatMessage(commonMessages.more)}
					</InternalLink>
				</>
			),
		},
	];

	return (
		<div className={cn(styles.demo_description_container, pageStyles.card)}>
			<span className={cn(pageStyles.page_steps_title, pageStyles.centered)}>
				{formatMessage(competitionsMessages.increase_your_chances_of_winning)}
			</span>
			<div className={cn(styles.page_steps, pageStyles.page_steps)}>
				{steps.map(({ message, image, title }, index) => (
					<div key={index} className={cn(pageStyles.page_step, pageStyles.center)}>
						<img
							className={pageStyles.page_step_image}
							alt="step_icon"
							src={image}
							width="144"
							height="86"
						/>
						<span className={cn(styles.step_title, pageStyles.page_step_title)}>+ {title}</span>
						<span className={pageStyles.page_step_description}>{message}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default DemoDescription;

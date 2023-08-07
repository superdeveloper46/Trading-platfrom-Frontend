import React, { useMemo } from "react";
import cn from "classnames";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import stakingMessages from "messages/staking";
import financeMessages from "messages/finance";
import styles from "styles/pages/Staking.module.scss";
import { usePlans } from "services/StakingService";
import Accordion from "components/UI/Accordion";
import { useMst } from "models/Root";
import { IPlan } from "types/staking";
import InternalLink from "components/InternalLink";
import { routes } from "constants/routing";
import PlanSkeleton from "./PlanSkeleton";
import Plan from "./Plan";

const Plans: React.FC = () => {
	const { formatMessage } = useIntl();
	const {
		global: { isAuthenticated, locale },
		account: { balances },
	} = useMst();
	const { data: { results } = { results: [], count: 0 }, isFetching } = usePlans();

	const idSortFunction = (a: IPlan, b: IPlan): number => {
		if (a.id < b.id) {
			return -1;
		}
		if (a.id > b.id) {
			return 1;
		}
		return 0;
	};

	const plans = useMemo(
		() =>
			results.sort(idSortFunction).sort((p) => {
				const hasSubscriptionLimit =
					p.subscription_amount_limit && +p.subscription_amount_limit > 0;

				const subscriptionAmountLeft =
					p.subscription_amount_used && p.subscription_amount_limit
						? +p.subscription_amount_limit - +p.subscription_amount_used
						: 0;

				const isPlanDisabled =
					!p.project.is_enabled ||
					(hasSubscriptionLimit && subscriptionAmountLeft < +(p.project?.min_locked_amount ?? "0"));

				return isPlanDisabled ? 1 : -1;
			}),
		[results],
	);

	const steps = [
		{
			icon: <i className="ai ai-mini_down_right" />,
			title: formatMessage(financeMessages.deposit),
			description: formatMessage(stakingMessages.deposit_step, {
				deposit: (
					<InternalLink to={routes.profile.getDepositCurrency("PZM")} blank>
						{formatMessage(financeMessages.deposit)}
					</InternalLink>
				),
			}),
		},
		{
			icon: <i data-class="ai-clock" className={cn(styles.clock, "ai ai-clock")} />,
			title: formatMessage(stakingMessages.participation),
			description: formatMessage(stakingMessages.participation_step),
		},
		{
			icon: <i className={cn(styles.chevron, "ai ai-chevron_up_mini")} />,
			title: formatMessage(stakingMessages.income),
			description: formatMessage(stakingMessages.income_step),
		},
	];

	return (
		<div className={styles.plans_container}>
			<div className={styles.plan_list}>
				{isFetching
					? [...new Array(3)].map((_, i) => <PlanSkeleton key={i} />)
					: plans
					? plans.map((plan) => (
							<Plan
								key={plan.id}
								isAuthenticated={isAuthenticated}
								plan={plan}
								verificationLevel={2}
								currency={
									balances.find((curr) => curr.code === plan.project?.currency?.code) || null
								}
							/>
					  ))
					: null}
			</div>
			<div className={styles.how_it_works}>
				<div className={styles.title}>{formatMessage(stakingMessages.how_it_works_title)}</div>
				<div className={styles.description}>
					{formatMessage(stakingMessages.how_it_works_description)}
				</div>
			</div>
			<div className={styles.steps}>
				{steps.map(({ icon, title, description }, index) => (
					<div key={title} className={styles.step}>
						<span className={styles.step_num}>
							{formatMessage(stakingMessages.step)} {index + 1}
						</span>
						<div className={styles.step_icon}>{icon}</div>
						<span className={styles.title}>{title}</span>
						<span className={styles.description}>{description}</span>
					</div>
				))}
			</div>
			<div className={styles.profit}>
				<i className="ai ai-info_circle_outline" />
				<span className={styles.title}>{formatMessage(stakingMessages.profit_title)}</span>
				<div className={styles.icons} />
				<span className={styles.description}>
					{formatMessage(stakingMessages.profit_description)}&nbsp;
				</span>
			</div>
			<div className={styles.qa_section}>
				<Accordion
					plain
					sections={[
						{
							label: formatMessage(stakingMessages.faq_1_title_referral),
							value: formatMessage(stakingMessages.faq_1_description_referral),
						},
						{
							label: formatMessage(stakingMessages.faq_2_title_referral),
							value: formatMessage(stakingMessages.faq_2_description_referral),
						},
						{
							label: formatMessage(stakingMessages.faq_3_title_referral),
							value: formatMessage(stakingMessages.faq_3_description_referral),
						},
						{
							label: formatMessage(stakingMessages.faq_4_title_referral),
							value: formatMessage(stakingMessages.faq_4_description_referral),
						},
						{
							label: formatMessage(stakingMessages.faq_5_title_referral),
							value: formatMessage(stakingMessages.faq_5_description_referral),
						},
						{
							label: formatMessage(stakingMessages.faq_6_title_referral),
							value: formatMessage(stakingMessages.faq_6_description_referral),
						},
						{
							label: formatMessage(stakingMessages.faq_7_title_referral),
							value: formatMessage(stakingMessages.faq_7_description_referral),
						},
						{
							label: formatMessage(stakingMessages.faq_8_title_referral),
							value: formatMessage(stakingMessages.faq_8_description_referral),
						},
						{
							label: formatMessage(stakingMessages.faq_9_title_referral),
							value: formatMessage(stakingMessages.faq_9_description_referral),
						},
						{
							label: formatMessage(stakingMessages.faq_10_title_referral),
							value: formatMessage(stakingMessages.faq_10_description_referral),
						},
						{
							label: formatMessage(stakingMessages.faq_11_title_referral),
							value: formatMessage(stakingMessages.faq_11_description_referral),
						},
					]}
				/>
			</div>
		</div>
	);
};

export default observer(Plans);

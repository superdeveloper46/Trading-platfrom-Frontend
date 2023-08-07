import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import dayjs from "dayjs";
import cn from "classnames";

import stakingMessages from "messages/staking";
import commonMessages from "messages/common";
import feesMessages from "messages/fees_trading";
import styles from "styles/pages/Staking.module.scss";
import { IPlan } from "types/staking";
import { IBalance } from "models/Account";
import useWindowSize from "hooks/useWindowSize";
import Button from "components/UI/Button";
import StakingService from "services/StakingService";
import styleProps from "utils/styleProps";
import { routes } from "constants/routing";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import InternalLink from "components/InternalLink";
import SubscribeModal from "../Modals/SubscribeModal";

const RATE_TYPES: {
	[key: number]: string;
} = { 10: "fixed", 20: "progressive" };

const FORMAT_NUMBER_OPTIONS = {
	maximumFractionDigits: 8,
	useGrouping: true,
};

type Props = {
	plan: IPlan;
	currency: IBalance | null;
	isAuthenticated: boolean;
	verificationLevel: number;
};

const PLAN_DESCRIPTION_VIEW_LENGTH = 150;

const Plan: React.FC<Props> = ({ plan, currency, isAuthenticated, verificationLevel }) => {
	const { project, referral_program } = plan;
	const projectCurrency = project?.currency;
	const currencyCode = project?.currency?.code;

	const { tablet } = useWindowSize();
	const localeNavigate = useLocaleNavigate();
	const { formatNumber, formatMessage } = useIntl();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const [moreInfoIsOpen, setMoreInfoIsOpen] = useState<boolean>(false);
	const [limit, setLimit] = useState<string>("");
	const [sum, setSum] = useState<string>("");

	useEffect(() => {
		if (referral_program) {
			setLimit(plan.project.open_position_limit);
			setSum(plan.project.open_position_sum);
		} else {
			setLimit(plan.subscription_amount_limit || "");
			setSum(plan.subscription_amount_used || "");
		}
	}, []);

	const hasProgressiveRates = Boolean(
		Array.isArray(plan.progressive_rates) && plan.progressive_rates.length,
	);

	const hasMoreDescription = project?.description?.length > PLAN_DESCRIPTION_VIEW_LENGTH ?? false;

	const hasSubscriptionLimit = !!(limit && +limit > 0);

	const hasMoreButton = hasProgressiveRates || hasMoreDescription || hasSubscriptionLimit;

	const hasSubscriptionPeriodLimit = !!(
		plan.subscription_period_limit && plan.subscription_period_limit > 0
	);

	const subscriptionAmountLeft = +limit - +sum;

	const isPlanDisabled =
		!plan.project.is_enabled ||
		(hasSubscriptionLimit && subscriptionAmountLeft < +(project?.min_locked_amount ?? "0"));

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false);
	}, []);

	const toggleMoreInfoIsOpen = () => {
		setMoreInfoIsOpen((prevState) => !prevState);
	};

	const handleModalConfirm = (amount: number, promoCode: string): Promise<void> =>
		StakingService.subscribe({
			amount: amount || 0,
			plan_id: plan.id || 0,
			...(promoCode ? { promo_code: promoCode } : {}),
		});

	const handleStakeClick = () => {
		if (!isAuthenticated) {
			return localeNavigate(routes.login.redirect(routes.staking.root));
		}
		return setIsModalOpen(true);
	};

	const metaPercentage = useMemo(
		() =>
			hasProgressiveRates && plan.progressive_rates ? (
				<>
					{formatNumber(plan.progressive_rates[0].percent || 0, FORMAT_NUMBER_OPTIONS)}
					&nbsp;-&nbsp;
					{formatNumber(
						plan.progressive_rates[plan.progressive_rates.length - 1].percent || 0,
						FORMAT_NUMBER_OPTIONS,
					)}
					%
					<span>
						{dayjs(dayjs().subtract(plan.progressive_rates[0].days || 0, "days")).fromNow(true)}
						&nbsp;-&nbsp;
						{dayjs(
							dayjs().subtract(
								plan?.progressive_rates[plan.progressive_rates.length - 1]?.days || 0,
								"days",
							),
						).fromNow(true)}
					</span>
				</>
			) : (
				<>
					{formatNumber(parseFloat(plan.interest_rate) * 100, FORMAT_NUMBER_OPTIONS)}%
					<span>{formatMessage(stakingMessages.days, { count: 30 })}</span>
				</>
			),
		[plan],
	);

	// TODO REFACTOR
	return (
		<>
			{!tablet ? (
				<div className={styles.plan_container}>
					{projectCurrency ? (
						<div className={styles.icon}>
							{projectCurrency.image_svg || projectCurrency.image_png ? (
								<img
									src={projectCurrency.image_svg || projectCurrency.image_png || ""}
									alt={projectCurrency.code}
									width="96"
									height="96"
								/>
							) : (
								<i className={`ai ai-${currencyCode.toLowerCase()}`} />
							)}
							{plan.referral_program ? <span className={styles.badge_new}>new</span> : null}
						</div>
					) : null}
					<div className={styles.right_content}>
						<div className={styles.right_content_section}>
							<div className={styles.about}>
								<div className={styles.label}>
									{project?.label} ({currencyCode ? currencyCode.toUpperCase() : "???"})
									{hasMoreButton && (
										<button
											type="button"
											className={styles.more_button}
											onClick={toggleMoreInfoIsOpen}
										>
											{formatMessage(commonMessages.more)}
											<i className={`ai ai-chevron_${moreInfoIsOpen ? "up" : "down"}`} />
										</button>
									)}
								</div>
								{hasSubscriptionLimit ? (
									<div className={styles.subscription_limit}>
										<div className={styles.subscription_limit_info}>
											<span className={styles.sub_label}>
												{formatMessage(stakingMessages.total_left)}
											</span>
											<div className={styles.value}>
												<b>{formatNumber(subscriptionAmountLeft, FORMAT_NUMBER_OPTIONS)}</b>
												&nbsp;/&nbsp;
												{formatNumber(+limit, { useGrouping: true })}&nbsp;
												{currencyCode ?? "???"}
											</div>
										</div>
										<div
											className={cn(styles.subscription_limit_progress, {
												[styles.referral]: !!referral_program,
											})}
										>
											<div
												style={{ width: (+sum / +limit) * 100 }}
												className={styles.progress_line}
											/>
										</div>
									</div>
								) : (
									<span className={styles.description}>
										{hasMoreDescription && !moreInfoIsOpen
											? `${project?.description?.slice(0, PLAN_DESCRIPTION_VIEW_LENGTH)}...`
											: project?.description}
									</span>
								)}
								<div className={styles.meta}>
									{!referral_program ? (
										<div className={cn(styles.meta_row)}>
											<div className={cn(styles.meta_percentage)}>{metaPercentage}</div>
											<div
												className={cn(styles.meta_badge, {
													[styles.fixed]: RATE_TYPES[plan.interest_rate_type] === "fixed",
												})}
											>
												{formatMessage(
													RATE_TYPES[plan.interest_rate_type] === "fixed"
														? stakingMessages.fixed_percentage
														: stakingMessages.progressive_percentage,
												)}
											</div>
										</div>
									) : null}
									<div className={styles.meta_min_amount}>
										{formatMessage(stakingMessages.min_amount)}:&nbsp;
										<span>
											{formatNumber(
												parseFloat(project?.min_locked_amount ?? "0"),
												FORMAT_NUMBER_OPTIONS,
											)}
											&nbsp;{currencyCode ?? "???"}
										</span>
									</div>
									{referral_program &&
									verificationLevel < referral_program.min_verification_level ? (
										<div className={styles.vefirication_row}>
											<i className={cn(styles.vefirication_row, "ai ai-info_filled")} />
											<span className={styles.vefirication_text}>{`${formatMessage(
												stakingMessages.verification_needed,
											)}`}</span>
											<InternalLink to={routes.verification.root} blank>
												{`${formatMessage(feesMessages.table_level)} ${
													referral_program?.min_verification_level
												}`}
											</InternalLink>
										</div>
									) : null}
								</div>
							</div>
							<div className={styles.actions}>
								<div className={styles.actions_type}>
									<span>{formatMessage(stakingMessages.staking_type)}:</span>
									<div className={styles.actions_type_list}>
										<div className={styles.actions_type_list_item}>
											{formatMessage(stakingMessages.flexible)}
										</div>
										{referral_program ? (
											<div className={cn(styles.actions_type_list_item, styles.ref)}>
												{formatMessage(stakingMessages.referral)}
											</div>
										) : null}
									</div>
								</div>
								{hasSubscriptionPeriodLimit && (
									<div className={styles.available_time_limit}>
										{formatMessage(stakingMessages.available)}:&nbsp;
										{dayjs(dayjs().subtract(plan.subscription_period_limit || 0, "days")).fromNow(
											true,
										)}
									</div>
								)}
								<Button
									iconAlign="left"
									iconCode="clock"
									fullWidth
									onClick={handleStakeClick}
									color="secondary"
									disabled={isPlanDisabled}
									label={formatMessage(
										isPlanDisabled ? commonMessages.sold_out : stakingMessages.stake_action,
									)}
								/>
								{referral_program ? (
									<div className={cn(styles.meta_row, styles.marginTop)}>
										<div className={cn(styles.meta_percentage)}>{metaPercentage}</div>
										<div
											className={cn(styles.meta_badge, {
												[styles.fixed]: RATE_TYPES[plan.interest_rate_type] === "fixed",
											})}
										>
											{formatMessage(
												RATE_TYPES[plan.interest_rate_type] === "fixed"
													? stakingMessages.fixed_percentage
													: stakingMessages.progressive_percentage,
											)}
										</div>
									</div>
								) : null}
							</div>
						</div>
						{hasProgressiveRates && moreInfoIsOpen && (
							<div className={styles.right_content_section}>
								<div className={styles.more_info_container}>
									<div className={styles.more_info_table}>
										<div className={styles.row}>
											<div className={styles.cell}>{formatMessage(commonMessages.month)}</div>
											<div className={styles.cell}>%</div>
											<div className={cn(styles.cell, styles.big)} />
											<div className={styles.cell}>
												{formatMessage(commonMessages.total)}&nbsp;%
											</div>
										</div>
										<div className={styles.more_info_table_body}>
											{plan.progressive_rates?.map((rate, idx: number) => {
												const totalPercent = plan.progressive_rates
													?.map((r) => r.percent)
													.slice(0, idx + 1)
													.reduce((t = 0, p) => (t as number) + (p || 0));
												return (
													<div className={styles.row} key={rate.days}>
														<div className={styles.cell}>
															{rate.days ? Math.ceil(rate.days / 30) : null}
														</div>
														<div className={cn(styles.cell, styles.percent)}>
															{formatNumber(rate.percent || 0, {
																maximumFractionDigits: 2,
																useGrouping: false,
															})}
															%
														</div>
														<div className={styles.more_info_table_total_percent_progress}>
															<div
																style={{ width: totalPercent || 0 }}
																className={styles.progress_line}
															/>
														</div>
														<div className={styles.more_info_table_total_percent}>
															{formatNumber(totalPercent || 0, {
																maximumFractionDigits: 2,
																useGrouping: false,
															})}
															%
														</div>
													</div>
												);
											})}
										</div>
									</div>
									{currencyCode === "KRG" && (
										<div className={styles.more_info_about}>
											<i className="ai ai-info_circle_outline" />
											{formatMessage(stakingMessages.kargo_progressive_percentage)}
										</div>
									)}
								</div>
							</div>
						)}
						{hasSubscriptionLimit && moreInfoIsOpen && (
							<div className={cn(styles.more_info_container, styles.column)}>
								{project?.description?.length > 0 && (
									<div className={styles.description}>{project.description}</div>
								)}
								{currencyCode === "CTG" && (
									<div className={styles.more_info_about} style={styleProps({ width: "65%" })}>
										<i className="ai ai-info_circle_outline" />
										{formatMessage(stakingMessages.ctg_subscription_limit_info)}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			) : (
				<div className={styles.plan_container}>
					<div className={styles.mobile_info}>
						{projectCurrency ? (
							<div className={styles.icon}>
								{projectCurrency.image_svg || projectCurrency.image_png ? (
									<img
										src={projectCurrency.image_svg || projectCurrency.image_png || ""}
										alt={projectCurrency.code}
										width="65"
										height="65"
									/>
								) : (
									<i className={`ai ai-${currencyCode.toLowerCase()}`} />
								)}
							</div>
						) : null}
						<div className={styles.mobile_info_group}>
							<div className={styles.label}>
								{project?.label}&nbsp; ({currencyCode ? currencyCode.toUpperCase() : "???"})
							</div>
							<div className={styles.actions_type_list}>
								<div className={styles.actions_type_list_item}>
									{formatMessage(stakingMessages.flexible)}
								</div>
							</div>
						</div>
					</div>
					{hasSubscriptionPeriodLimit && (
						<div className={styles.available_time_limit}>
							{formatMessage(stakingMessages.available)}:&nbsp;
							{dayjs(dayjs().subtract(plan.subscription_period_limit || 0, "days")).fromNow(true)}
						</div>
					)}
					{hasSubscriptionLimit && (
						<div className={styles.subscription_limit}>
							<div className={styles.subscription_limit_info}>
								<span className={styles.sub_label}>
									{formatMessage(stakingMessages.total_left)}
								</span>
								<div className={styles.value}>
									<b>{formatNumber(subscriptionAmountLeft, FORMAT_NUMBER_OPTIONS)}</b>
									&nbsp;/&nbsp;
									{+limit}&nbsp;
									{currencyCode ?? "???"}
								</div>
							</div>
							<div
								className={cn(styles.subscription_limit_progress, {
									[styles.referral]: !!referral_program,
								})}
							>
								<div className={styles.progress_line} style={{ width: (+sum / +limit) * 100 }} />
							</div>
						</div>
					)}
					<div className={styles.mobile_meta}>
						<div className={styles.meta_percentage}>{metaPercentage}</div>
					</div>
					<Button
						iconAlign="left"
						iconCode="clock"
						fullWidth
						onClick={handleStakeClick}
						color="secondary"
						disabled={isPlanDisabled}
						label={formatMessage(
							isPlanDisabled ? commonMessages.sold_out : stakingMessages.stake_action,
						)}
					/>
					<div className={styles.meta_min_amount}>
						{formatMessage(stakingMessages.min_amount)}:&nbsp;
						<span>
							{formatNumber(parseFloat(project?.min_locked_amount ?? "0"), FORMAT_NUMBER_OPTIONS)}
							&nbsp;{currencyCode ?? "???"}
						</span>
					</div>
				</div>
			)}
			<SubscribeModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				onConfirm={handleModalConfirm}
				currency={currency || ({} as IBalance)}
				plan={plan}
			/>
		</>
	);
};

export default Plan;

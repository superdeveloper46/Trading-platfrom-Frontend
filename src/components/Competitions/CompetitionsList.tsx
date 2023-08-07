import React from "react";
import { useIntl } from "react-intl";
import dayjs from "dayjs";
import cn from "classnames";

import competitionsMessages from "messages/competitions";
import accountMessages from "messages/account";
import commonMessages from "messages/common";
import styles from "styles/pages/Competitions.module.scss";
import Button from "components/UI/Button";
import InternalLink from "components/InternalLink";
import { useCompetitions } from "services/CompetitionService";
import { ICompetition } from "types/competitions";
import SkeletonLoader from "components/UI/Skeleton";
import { routes } from "constants/routing";

interface CompetitionsListItemProps {
	competition: ICompetition;
}

const CompetitionsListItem: React.FC<CompetitionsListItemProps> = ({ competition }) => {
	const { formatMessage, formatNumber } = useIntl();

	const isActive = dayjs(dayjs.utc(competition.end_at)).isAfter(dayjs.utc(dayjs()));
	const isStarted = dayjs(dayjs.utc(competition.start_at)).isBefore(dayjs.utc(dayjs()));

	const isDemo = competition.is_demo;

	return (
		<div className={cn(styles.competition, { [styles.disabled]: !isActive })} key={competition.id}>
			<div
				className={cn(styles.image)}
				style={{ background: `url(${competition.preview_png}) center center / cover` }}
			>
				<div className={styles.status_badge_container}>
					<div className={cn(styles.status_badge)}>
						{formatMessage(isActive ? commonMessages.active : competitionsMessages.completed)}
					</div>
					{isDemo && (
						<div className={styles.status_badge}>{formatMessage(commonMessages.demo_terminal)}</div>
					)}
				</div>
				<InternalLink to={routes.competitions.getCompetition(competition.slug)} />
			</div>
			<div className={styles.competition_content}>
				<div className={styles.prize_fund}>
					<span className={styles.prize_fund_label}>
						{formatMessage(competitionsMessages.prize_fund)}
					</span>
					<span className={styles.prize_fund_value}>
						{formatNumber(competition.amount, {
							maximumFractionDigits: 4,
						})}
						&nbsp;{competition.currency_code}
					</span>
				</div>
				<div className={styles.about}>
					<span className={styles.about_label}>{competition.name}</span>
					<div className={styles.about_date}>
						{formatMessage(competitionsMessages.date_of_completion)}:
						<span>{dayjs(competition.end_at).format("DD/MM/YYYY")}</span>
					</div>
					<InternalLink to={routes.competitions.getCompetition(competition.slug)}>
						{isActive ? (
							<Button
								fullWidth
								mini
								variant="filled"
								color="quaternary"
								disabled={!isStarted}
								label={formatMessage(
									isStarted
										? competition.is_participant
											? competitionsMessages.you_participate_in_this_event
											: competitionsMessages.i_want_to_participate
										: accountMessages.very_soon,
								)}
							/>
						) : (
							<Button
								fullWidth
								mini
								variant="text"
								color="primary"
								label={formatMessage(competitionsMessages.contest_results)}
							/>
						)}
					</InternalLink>
				</div>
			</div>
		</div>
	);
};

const CompetitionsList: React.FC = () => {
	const { data: { results: competitions } = { results: [] }, isFetching } = useCompetitions();

	return (
		<div className={styles.competitions_grid}>
			{isFetching
				? [...new Array(6)].map((_, i: number) => (
						<div className={styles.competition} key={i}>
							<div className={styles.image}>
								<div className={styles.status_badge_container}>
									<SkeletonLoader width={90} height={22} />
								</div>
								<SkeletonLoader height={80} width={80} />
							</div>
							<div className={styles.competition_content}>
								<div className={styles.prize_fund}>
									<span className={styles.prize_fund_label}>
										<SkeletonLoader width={40} />
									</span>
									<span className={styles.prize_fund_value}>
										<SkeletonLoader width={120} />
									</span>
								</div>
								<span className={styles.about}>
									<div className={styles.about_label}>
										<SkeletonLoader width={200} />
									</div>
									<div className={styles.about_date}>
										<SkeletonLoader width={200} />
									</div>
									{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
									<InternalLink to="#">
										<SkeletonLoader height={36} />
									</InternalLink>
								</span>
							</div>
						</div>
				  ))
				: competitions.map((competition) => (
						<CompetitionsListItem key={competition.id} competition={competition} />
				  ))}
		</div>
	);
};

export default CompetitionsList;

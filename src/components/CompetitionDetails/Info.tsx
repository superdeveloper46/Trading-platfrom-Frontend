import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import cn from "classnames";
import dayjs from "dayjs";

import competitionsMessages from "messages/competitions";
import accountMessages from "messages/account";
import commonMessages from "messages/common";
import pageStyles from "styles/pages/Page.module.scss";
import styles from "styles/pages/CompetitionsDetails.module.scss";
import { useMst } from "models/Root";
import { ICompetition, ICompetitionBoard } from "types/competitions";
import Button from "components/UI/Button";
import LoadingSpinner from "components/UI/LoadingSpinner";
import CompetitionService from "services/CompetitionService";
import { routes } from "constants/routing";
import useLocaleNavigate from "hooks/useLocaleNavigate";

interface IProps {
	competition?: ICompetition;
	isCompetitionLoading?: boolean;
	board?: ICompetitionBoard;
	refetchBoard: () => void;
}

const Info: React.FC<IProps> = ({ competition, isCompetitionLoading, board, refetchBoard }) => {
	const {
		global: { isAuthenticated },
	} = useMst();

	const [totalSeconds, setTotalSeconds] = useState<number>(
		competition ? dayjs.utc(competition.end_at).diff(dayjs.utc(dayjs()), "seconds", true) : 0,
	);
	const { formatMessage } = useIntl();
	const [isParticipateCompetitionLoading] = useState<boolean>(false);
	const localeNavigate = useLocaleNavigate();

	const isCurrentlyParticipate =
		board?.reset_required === false || (board?.user?.rank && board.user.rank !== 0);

	const isStarted = competition
		? dayjs(dayjs.utc(competition.start_at)).isBefore(dayjs.utc(dayjs()))
		: false;

	const isActive = competition
		? dayjs(dayjs.utc(competition.end_at)).isAfter(dayjs.utc(dayjs()))
		: false;

	const isDemo = competition?.is_demo ?? false;

	useEffect(() => {
		if (competition?.end_at) {
			setTotalSeconds(dayjs.utc(competition.end_at).diff(dayjs.utc(dayjs()), "seconds", true));
		}
	}, [competition]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setTotalSeconds((prevState) => {
				if (prevState > 0) {
					prevState -= 1;
				}
				return prevState;
			});
		}, 1000);
		return () => clearTimeout(timer);
	}, [totalSeconds]);

	const participate = async () => {
		await CompetitionService.participate(competition?.id || 0);
		await refetchBoard();
	};

	const handleParticipate = (): void => {
		if (isActive) {
			if (!isAuthenticated) {
				localeNavigate(routes.register.root);
			} else if (!isDemo) {
				participate();
			}
		}
	};

	const days = Math.floor(totalSeconds / (3600 * 24));
	const hours = Math.floor((totalSeconds / 3600) % (days > 0 ? days * 24 : 24));
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = Math.floor(totalSeconds % 60);

	const timeValues = [
		{
			title: formatMessage(commonMessages.days),
			value: days,
		},
		{
			title: formatMessage(commonMessages.hours),
			value: hours,
		},
		{
			title: formatMessage(commonMessages.minutes),
			value: minutes,
		},
		{
			title: formatMessage(commonMessages.seconds),
			value: seconds,
		},
	];

	return (
		<div
			className={cn(styles.info_container, pageStyles.card, pageStyles.hasMobileBorder, {
				[styles.isActive]: isActive,
			})}
		>
			{isCompetitionLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<i className="ai ai-clock" />
					<div className={styles.time_left}>
						{isActive && (
							<span>
								{formatMessage(competitionsMessages.remaining_time_till_the_end_of_the_competition)}
								:
							</span>
						)}
						<div className={styles.time_left_counters}>
							{timeValues.map(({ value, title }) => (
								<div className={styles.time_left_counter}>
									<span>{isActive ? value : "--"}</span>
									<span>{title}</span>
								</div>
							))}
						</div>
					</div>
					{!isActive && (
						<div className={styles.competition_is_over}>
							{formatMessage(competitionsMessages.contest_is_over)}
						</div>
					)}
					{isActive ? (
						isCurrentlyParticipate ? (
							<div className={styles.currently_participate}>
								{formatMessage(
									board.user.rank === 0
										? competitionsMessages.you_will_be_ranked_soon
										: competitionsMessages.you_participate_in_this_event,
								)}
							</div>
						) : (
							<div className={styles.action_button}>
								<Button
									fullWidth
									variant="filled"
									color="quaternary"
									disabled={!isActive || !isStarted}
									isLoading={isParticipateCompetitionLoading}
									onClick={handleParticipate}
									label={formatMessage(
										isActive
											? isStarted
												? isAuthenticated
													? competitionsMessages.i_want_to_participate
													: competitionsMessages.register_for_participation
												: accountMessages.very_soon
											: competitionsMessages.contest_is_over,
									)}
								/>
							</div>
						)
					) : null}
				</>
			)}
		</div>
	);
};

export default observer(Info);

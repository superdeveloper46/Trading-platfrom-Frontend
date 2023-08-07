import React from "react";
import { useIntl } from "react-intl";
import competitionsMessages from "messages/competitions";
import dayjs from "dayjs";
import cn from "classnames";
import pageStyles from "styles/pages/Page.module.scss";
import styles from "styles/pages/CompetitionsDetails.module.scss";
import { observer } from "mobx-react-lite";
import { ICompetition, ICompetitionBoard } from "../../types/competitions";
import { useMst } from "../../models/Root";

interface IProps {
	competition?: ICompetition;
	board?: ICompetitionBoard;
}

const Results: React.FC<IProps> = ({ competition, board }) => {
	const {
		global: { isAuthenticated },
	} = useMst();

	const { formatMessage, formatNumber } = useIntl();
	const isActive = competition
		? dayjs(dayjs.utc(competition.end_at)).isAfter(dayjs.utc(dayjs()))
		: false;
	const isCurrentlyParticipate =
		board?.reset_required === false || (board?.user?.rank && board.user.rank !== 0);
	const isDemo = competition?.is_demo ?? false;

	return isAuthenticated && isActive ? (
		<div
			className={cn(styles.results_container, pageStyles.card, pageStyles.hasMobileBorder, {
				[styles.isDemo]: isDemo,
			})}
		>
			{isDemo ? (
				<>
					<div className={styles.column_group}>
						<div className={cn(styles.column_group, styles.hasPadding)}>
							{isCurrentlyParticipate ? (
								board?.user?.rank === 0 ? (
									<span>{formatMessage(competitionsMessages.you_will_be_ranked_soon)}</span>
								) : (
									<>
										<i className="ai ai-cup" />
										<span className={styles.position}>
											{board?.user
												? formatMessage(competitionsMessages.place_out_of_total_places, {
														place: <span>{board.user.rank}</span>,
														total_places: board.user.total_places,
												  })
												: "--"}
										</span>
										<span>
											{formatMessage(competitionsMessages.my_position_in_the_competition)}
										</span>
									</>
								)
							) : (
								<span>
									{competition
										? formatMessage(competitionsMessages.now_the_demo_battle_is_taking_place, {
												prize_fund: `${formatNumber(competition.amount, {
													useGrouping: false,
													maximumFractionDigits: 4,
												})} ${competition.currency_code}`,
										  })
										: "--"}
								</span>
							)}
						</div>
					</div>
					<div className={styles.column_group}>
						<div className={cn(styles.column, styles.hasPadding)}>
							<span className="primary">
								{isCurrentlyParticipate
									? formatNumber(board?.user?.total_bonus ?? 0, {
											useGrouping: false,
											maximumFractionDigits: 8,
									  })
									: "--"}
							</span>
							<span>
								{formatMessage(competitionsMessages.total_bonuses_accrued_in, {
									currency: "USDT",
								})}
							</span>
						</div>
					</div>
					<div className={styles.column_group}>
						<div className={cn(styles.column, styles.hasPadding)}>
							<span className="primary">
								{isCurrentlyParticipate ? board?.user?.trades_count ?? 0 : "--"}
							</span>
							<span>{formatMessage(competitionsMessages.all_my_deals)}</span>
						</div>
					</div>
				</>
			) : (
				<>
					<div className={styles.my_position_container}>
						<span>
							<i className="ai ai-cup" />
							{formatMessage(competitionsMessages.my_position_in_the_competition)}
						</span>
						<span className={styles.position}>
							{board?.user
								? formatMessage(competitionsMessages.place_out_of_total_places, {
										place: <span>{board.user.rank}</span>,
										total_places: board.user.total_places,
								  })
								: "--"}
						</span>
					</div>
					<div className={styles.total_my_deals_container}>
						<span>{formatMessage(competitionsMessages.all_my_deals)}</span>
						<span>{board?.user?.trades_count ?? 0}</span>
					</div>
				</>
			)}
		</div>
	) : null;
};

export default observer(Results);

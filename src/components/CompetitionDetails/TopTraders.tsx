import React from "react";
import competitionMessages from "messages/competitions";
import { useIntl } from "react-intl";
import pageStyles from "styles/pages/Page.module.scss";
import tableStyles from "styles/components/UI/Table.module.scss";
import styles from "styles/pages/CompetitionsDetails.module.scss";
import cn from "classnames";
import { useMst } from "models/Root";
import useWindowSize from "hooks/useWindowSize";
import LoadingSpinner from "components/UI/LoadingSpinner";
import NoRowsMessage from "../Table/NoRowsMessage";
import { IBoardTopTrader, ICompetition, ICompetitionBoard } from "../../types/competitions";

interface IProps {
	competition?: ICompetition;
	board?: ICompetitionBoard;
	isBoardLoading?: boolean;
}

const TopTraders: React.FC<IProps> = ({ competition, board, isBoardLoading }) => {
	const {
		global: { isAuthenticated },
	} = useMst();
	const { mobile } = useWindowSize();

	const { formatMessage, formatNumber } = useIntl();
	const isMyPositionOutOfList =
		isAuthenticated && (board?.user?.rank ?? 0) > (board?.top?.length ?? 0);
	const isDemo = competition?.is_demo ?? false;

	return (
		<div className={cn(styles.top_traders_container, pageStyles.card, pageStyles.hasMobileBorder)}>
			<div className={styles.header}>
				<div className={styles.title_container}>
					<i className="ai ai-star_filled" />
					<h3 className={cn(styles.title, pageStyles.card_title)}>
						{formatMessage(competitionMessages.top_traders)}
					</h3>
				</div>
				<span className={styles.subtitle}>
					{formatMessage(competitionMessages.the_best_in_battle_so_far)}:
				</span>
			</div>
			<div
				className={cn(
					styles.table_head,
					{ [styles.mobile]: mobile },
					pageStyles.table_head,
					pageStyles.fullWidth,
				)}
			>
				<div className={cn(styles.table_header, styles.empty)} />
				<div className={cn(styles.table_header, pageStyles.table_header)}>
					{formatMessage(competitionMessages.user)}
				</div>
				<div className={cn(styles.table_header, styles.deals, pageStyles.table_header)}>
					{formatMessage(competitionMessages.deals)}
				</div>
				<div className={cn(pageStyles.table_header, pageStyles.right)}>
					{formatMessage(
						isDemo ? competitionMessages.current_balance : competitionMessages.current_volume,
					)}
				</div>
			</div>
			{isBoardLoading ? (
				<LoadingSpinner />
			) : (
				<div className={cn(styles.top_traders_table, tableStyles.table, tableStyles.fullWidth)}>
					{board?.top?.length ? (
						<>
							{board.top
								.slice(0, isMyPositionOutOfList ? 9 : 10)
								.map((trader: IBoardTopTrader, idx: number) => {
									const isMyPosition = isAuthenticated && idx + 1 === (board.user?.rank ?? 0);
									return (
										<div
											className={cn(
												styles.top_traders_table_row,
												styles.table_row,
												pageStyles.table_row,
												{
													[styles.isLeader]: idx === 0,
													[styles.isMyPosition]: isMyPosition,
													[styles.mobile]: mobile,
												},
											)}
											key={trader.account_uid}
										>
											<div className={cn(styles.icon, styles.table_data, pageStyles.table_data)}>
												<div
													className={cn(styles.place_icon, {
														[styles.first]: idx === 0,
														[styles.second]: idx === 1,
													})}
												>
													{idx < 3 ? <i className="ai ai-cup" /> : idx + 1}
												</div>
											</div>
											<div className={cn(styles.table_data, pageStyles.table_data)}>
												{isMyPosition ? (
													<span className={styles.my_position_label}>
														{formatMessage(competitionMessages.my_position)}
													</span>
												) : (
													<span className={styles.table_data_uid}>
														User ID: {trader.account_uid}
													</span>
												)}
											</div>
											<div
												className={cn(
													styles.table_data,
													styles.trades_count,
													pageStyles.table_data,
												)}
											>
												{trader.trades_count ?? 0}
											</div>
											<div className={cn(pageStyles.table_data, pageStyles.right)}>
												<div className={styles.current_balance}>
													<span>
														{formatNumber(Number(trader.amount || "0"), {
															useGrouping: false,
															minimumFractionDigits: 2,
															maximumFractionDigits: 2,
														})}
													</span>
													<span>{trader.currency_code}</span>
												</div>
											</div>
										</div>
									);
								})}
							{isMyPositionOutOfList ? (
								<div
									className={cn(
										styles.top_traders_table_row,
										styles.table_row,
										styles.isMyPosition,
										pageStyles.table_row,
										{ [styles.mobile]: mobile },
									)}
								>
									<div className={cn(styles.table_data, styles.icon, pageStyles.table_data)}>
										<div className={styles.place_icon}>
											<i className="ai ai-avatar" />
										</div>
									</div>
									<div className={cn(styles.table_data, pageStyles.table_data)}>
										<span className={styles.my_position_label}>
											{board.user.rank}&nbsp;
											{formatMessage(competitionMessages.my_position)}
										</span>
									</div>
									<div
										className={cn(styles.table_data, styles.trades_count, pageStyles.table_data)}
									>
										{board.user?.trades_count}
									</div>
									<div className={cn(pageStyles.table_data, pageStyles.right)}>
										<div className={styles.current_balance}>
											<span>
												{formatNumber(Number(board.user.amount || "0"), {
													useGrouping: false,
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												})}
											</span>
											<span>{board.user?.currency_code}</span>
										</div>
									</div>
								</div>
							) : null}
						</>
					) : (
						<NoRowsMessage />
					)}
				</div>
			)}
		</div>
	);
};

export default TopTraders;

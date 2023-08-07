import React from "react";
import competitionMessages from "messages/competitions";
import { useIntl } from "react-intl";
import pageStyles from "styles/pages/Page.module.scss";
import styles from "styles/pages/CompetitionsDetails.module.scss";
import cn from "classnames";
import { ICompetition, ICompetitionPrize } from "../../types/competitions";
import LoadingSpinner from "../UI/LoadingSpinner";
import NoRowsMessage from "../Table/NoRowsMessage";

interface IProps {
	competition?: ICompetition;
	isLoading?: boolean;
}

const PrizesList: React.FC<IProps> = ({ competition, isLoading }) => {
	const { formatMessage, formatNumber } = useIntl();

	return (
		<div className={cn(styles.prize_list_container, pageStyles.card, pageStyles.hasMobileBorder)}>
			<div className={styles.header}>
				<div className={styles.title_container}>
					<i className="ai ai-star_filled" />
					<h3 className={styles.title}>{formatMessage(competitionMessages.prize_fund)}</h3>
				</div>
				<div className={styles.prize_fund}>
					{competition ? (
						<span>
							{formatNumber(competition.amount, {
								useGrouping: false,
								maximumFractionDigits: 4,
							})}
							&nbsp;{competition.currency_code}
						</span>
					) : (
						"--"
					)}
				</div>
			</div>
			<div className={cn(styles.table_head, pageStyles.table_head)}>
				<div className={cn(pageStyles.table_header, styles.small_cell)} />
				<div className={pageStyles.table_header}>{formatMessage(competitionMessages.place)}</div>
				<div className={cn(pageStyles.table_header, pageStyles.right)}>
					{formatMessage(competitionMessages.prize)}
				</div>
			</div>
			<div className={styles.prizes_list_table}>
				{isLoading ? (
					<LoadingSpinner verticalMargin="30px" />
				) : competition?.prizes?.length ? (
					competition.prizes
						.sort(
							(p1: ICompetitionPrize, p2: ICompetitionPrize) =>
								Number(p1.code[0]) - Number(p2.code[0]),
						)
						.map((prize: ICompetitionPrize, idx: number) => (
							<div className={cn(styles.table_row, pageStyles.table_row)} key={prize.code}>
								<div className={cn(styles.small_cell, pageStyles.table_data)}>
									<div
										className={cn(styles.place_icon, {
											[styles.first]: idx === 0,
											[styles.second]: idx === 1,
										})}
									>
										{idx === 0 || idx === 1 || idx === 2 ? (
											<i className="ai ai-cup" />
										) : (
											<i className="ai ai-avatar" />
										)}
									</div>
								</div>
								<div className={pageStyles.table_data}>{prize.places}</div>
								<div className={cn(pageStyles.table_data, pageStyles.right)}>{prize.reward}</div>
							</div>
						))
				) : (
					<NoRowsMessage small />
				)}
			</div>
		</div>
	);
};

export default PrizesList;

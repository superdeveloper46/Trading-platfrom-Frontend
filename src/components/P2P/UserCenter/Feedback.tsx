import React, { useState } from "react";
import cn from "classnames";
import { useIntl } from "react-intl";

import styles from "styles/pages/P2P/UserCenter.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import { Table } from "components/UI/NewTable";
import { AlignEnum, IHeader } from "components/UI/Table/Table";
import { useFeedbacks } from "services/P2PService";
import { queryVars } from "constants/query";
import NewPagination from "components/UI/NewPagination";
import LoadingSpinner from "components/UI/LoadingSpinner";
import RowSkeleton from "components/UI/Table/RowSkeleton";
import noResultsStyles from "styles/components/Table/NoResultMessage.module.scss";
import commonMessages from "messages/common";
import p2pMessages from "messages/p2p";
import { getPercentageOf } from "utils/p2p";
import { FEEDBACKS_PAGE_SIZE } from "constants/p2p";
import FeedbackTableRow from "./FeedbackTableRow";

interface IProps {
	id: number;
	negativeCount: number;
	positiveCount: number;
}

enum TabOptionsEnum {
	All,
	Positive,
	Negative,
}

interface IFilter {
	[queryVars.page]: number;
	[queryVars.page_size]: number;
	[queryVars.is_positive]?: boolean;
}

const Feedback: React.FC<IProps> = ({ id, positiveCount, negativeCount }) => {
	const { formatMessage } = useIntl();

	const totalFeedbacksAmount = positiveCount + negativeCount;

	const [activeNavItem, setActiveNavItem] = useState<TabOptionsEnum>(TabOptionsEnum.All);

	const [filter, setFilter] = useState<IFilter>({
		[queryVars.page]: 1,
		[queryVars.page_size]: FEEDBACKS_PAGE_SIZE,
	});

	const { data: feedbacks, isFetching } = useFeedbacks(id, filter);

	const handlePageChange = (page: number): void => {
		setFilter((prevState) => ({
			...prevState,
			[queryVars.page]: page,
		}));
	};

	const handleTabChange = (tab: TabOptionsEnum) => {
		setFilter((prevState) => ({
			...prevState,
			[queryVars.page]: 1,
			[queryVars.is_positive]: getPositiveFilter(tab),
		}));
		setActiveNavItem(tab);
	};

	const getPositiveFilter = (tab: TabOptionsEnum) => {
		switch (tab) {
			case TabOptionsEnum.Positive:
				return true;
			case TabOptionsEnum.Negative:
				return false;
			default:
				return undefined;
		}
	};

	const flowNavItems = [
		{
			id: TabOptionsEnum.All,
			label: `${formatMessage(commonMessages.all)} (${totalFeedbacksAmount})`,
		},
		{
			id: TabOptionsEnum.Positive,
			label: `${formatMessage(p2pMessages.positive)} (${positiveCount})`,
		},
		{
			id: TabOptionsEnum.Negative,
			label: `${formatMessage(p2pMessages.negative)} (${negativeCount})`,
		},
	];

	const headerOptions: IHeader = {
		columns: [
			{
				name: "feedback",
				label: formatMessage(p2pMessages.feedback),
				maxWidth: "140px",
				minWidth: "120px",
				align: AlignEnum.Center,
			},
			{
				name: "username",
				label: formatMessage(p2pMessages.username),
				maxWidth: "300px",
				minWidth: "130px",
			},
			{
				name: "date",
				label: formatMessage(commonMessages.date),
				maxWidth: "220px",
				minWidth: "200px",
			},
			// {
			// 	name: "payment-method",
			// 	label: "Payment Method",
			// 	maxWidth: "320px",
			// },
			{
				name: "comment",
				label: formatMessage(p2pMessages.comment),
				maxWidth: "400px",
			},
		],
	};

	return (
		<div className={p2pStyles.table_container}>
			<span className={styles.section_title}>{formatMessage(p2pMessages.feedback)}</span>
			{isFetching ? (
				<LoadingSpinner noMargin />
			) : (
				<>
					<span className={styles.section_desc}>
						{getPercentageOf(positiveCount, totalFeedbacksAmount)}% ({totalFeedbacksAmount}{" "}
						{formatMessage(p2pMessages.reviews)})
					</span>
					<div
						className={cn(
							p2pStyles.tabs_container,
							p2pStyles.table_tabs_container,
							p2pStyles.header,
						)}
					>
						<div className={cn(p2pStyles.nav_bar, p2pStyles.scrollable)}>
							{flowNavItems.map(({ id, label }) => (
								<div
									key={id}
									onClick={() => handleTabChange(id)}
									className={cn(p2pStyles.nav_item, p2pStyles.table_nav_item, {
										[p2pStyles.active]: id === activeNavItem,
									})}
								>
									<span>{label}</span>
								</div>
							))}
							<div />
						</div>
					</div>
				</>
			)}
			<Table header={headerOptions}>
				{isFetching ? (
					[...new Array(FEEDBACKS_PAGE_SIZE)].map((_, i: number) => (
						<RowSkeleton cells={headerOptions.columns} key={i} />
					))
				) : feedbacks && feedbacks.results.length ? (
					feedbacks.results.map((feedback, idx) => (
						<FeedbackTableRow feedback={feedback} key={idx} />
					))
				) : (
					<div className={noResultsStyles.no_rows_message_container}>
						<i className="ai ai-dok_empty" />
						{formatMessage(commonMessages.table_no_data)}
					</div>
				)}
			</Table>
			{feedbacks && feedbacks.results.length && feedbacks.count > FEEDBACKS_PAGE_SIZE ? (
				<div className={p2pStyles.pagination_container}>
					<NewPagination
						count={Math.ceil(feedbacks.count / FEEDBACKS_PAGE_SIZE)}
						page={filter.page}
						onChange={handlePageChange}
					/>
				</div>
			) : null}
		</div>
	);
};

export default Feedback;

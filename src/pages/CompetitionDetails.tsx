import React from "react";
import Helmet from "react-helmet";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import cn from "classnames";
import dayjs from "dayjs";

import competitionsMessages from "messages/competitions";
import styles from "styles/pages/CompetitionsDetails.module.scss";
import pageStyles from "styles/pages/Page.module.scss";
import MainLayout from "layouts/MainLayout";
import Breadcrumbs from "components/Breadcrumbs";
import { getPageTitle } from "helpers/global";
import {
	About,
	DemoDescription,
	Info,
	PageHeader,
	PrizesList,
	Results,
	Rules,
	ShareLink,
	TopTraders,
} from "components/CompetitionDetails";
import { useCompetitionBoard, useCompetitionDetails } from "services/CompetitionService";
import { FAQ } from "components/Competitions";
import { routes } from "constants/routing";

const CompetitionDetails: React.FC = () => {
	const { slug = "" } = useParams<{ slug: string }>();
	const { data: competition, isFetching: isCompetitionLoading } = useCompetitionDetails(slug);
	const {
		data: board,
		isFetching: isBoardLoading,
		refetch: refetchBoard,
	} = useCompetitionBoard(slug);
	const { formatMessage, formatNumber } = useIntl();
	const isDemo = competition?.is_demo ?? false;
	const isActive = competition
		? dayjs(dayjs.utc(competition.end_at)).isAfter(dayjs.utc(dayjs()))
		: false;

	return (
		<MainLayout>
			<Helmet title={getPageTitle(competition?.name ?? "-")} />
			<div className={styles.breadcrumbs_container}>
				<Breadcrumbs
					noMargin
					links={[
						{
							link: routes.competitions.root,
							label: formatMessage(competitionsMessages.trading_competition),
						},
					]}
					current={
						competition
							? `${formatNumber(competition.amount, {
									maximumFractionDigits: 4,
							  })} ${competition.currency_code}`
							: ""
					}
				/>
			</div>
			<PageHeader competition={competition} />
			<div className={styles.content_wrapper}>
				<div className={cn(styles.page_content_container, pageStyles.page_container_outer)}>
					<div className={styles.container}>
						<Results competition={competition} board={board} />
						{isActive && isDemo && <ShareLink />}
						<div className={styles.focus_content}>
							<PrizesList competition={competition} isLoading={isCompetitionLoading} />
							<Info
								competition={competition}
								board={board}
								refetchBoard={refetchBoard}
								isCompetitionLoading={isCompetitionLoading}
							/>
						</div>
						<TopTraders competition={competition} board={board} isBoardLoading={isBoardLoading} />
						<About competition={competition} />
						{isDemo && <DemoDescription />}
						<Rules competition={competition} />
						<FAQ />
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default CompetitionDetails;

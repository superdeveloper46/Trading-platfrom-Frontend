import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";
import cn from "classnames";

import commonMessages from "messages/common";
import stakingMessages from "messages/staking";
import tableStyles from "styles/pages/Table.module.scss";
import noResultsStyles from "styles/components/Table/NoResultMessage.module.scss";
import pageStyles from "styles/pages/Page.module.scss";
import styles from "styles/pages/Staking.module.scss";
import { useInterests } from "services/StakingService";
import Pagination from "components/UI/Pagination";
import { useMst } from "models/Root";
import InternalLink from "components/InternalLink";
import { RowSkeleton, Table } from "components/UI/Table";
import { AlignEnum, IHeader } from "components/UI/Table/Table";
import Tooltip from "components/UI/Tooltip";
import { queryVars } from "constants/query";
import { routes } from "constants/routing";
import InterestRow from "./InterestRow";

const PAGE_SIZE = 12;

const Interests: React.FC = () => {
	const { formatMessage } = useIntl();
	const {
		global: { isAuthenticated },
	} = useMst();
	const [page, setPage] = useState<number>(1);
	const { data: interests, isFetching: isInterestsLoading } = isAuthenticated
		? useInterests({
				page,
				[queryVars.page_size]: PAGE_SIZE,
		  })
		: {
				data: null,
				isFetching: false,
		  };

	const headerOptions: IHeader = {
		columns: [
			{
				label: formatMessage(commonMessages.coin),
				minWidth: "70px",
				width: "70px",
			},
			{
				align: AlignEnum.Right,
				label: formatMessage(stakingMessages.positions_table_paid),
				minWidth: "100px",
				width: "100px",
			},
			{
				align: AlignEnum.Center,
				label: formatMessage(commonMessages.date),
				minWidth: "80px",
				width: "80px",
			},
			{
				label: (
					<>
						IpM
						<div className={styles.profitability}>
							<Tooltip
								id="profit"
								hint
								text={formatMessage(stakingMessages.positions_table_income_per_month)}
							/>
						</div>
					</>
				),
				width: "50px",
				minWidth: "50px",
			},
			{
				width: "80px",
				minWidth: "80px",
				label: formatMessage(stakingMessages.positions_table_time_passed),
			},
			{
				align: AlignEnum.Center,
				label: formatMessage(stakingMessages.positions_table_start),
				width: "80px",
				minWidth: "80px",
			},
			{
				maxWidth: "120px",
				align: AlignEnum.Center,
				label: formatMessage(stakingMessages.positions_table_status),
			},
		],
	};

	return (
		<div className={cn(styles.positions, pageStyles.section_container)}>
			<div className={cn(styles.table_container, pageStyles.card)}>
				{!isAuthenticated ? (
					<div className={tableStyles.container}>
						<i className="ai ai-file_text" />
						<span>
							{formatMessage(stakingMessages.auth_msg, {
								ref1: (
									<InternalLink to={routes.login.root} className="text-center">
										{formatMessage(commonMessages.login_noun)}
									</InternalLink>
								),
								ref2: (
									<InternalLink to={routes.register.root} className="text-center">
										{formatMessage(commonMessages.registerAction)}
									</InternalLink>
								),
							})}
						</span>
					</div>
				) : (
					<>
						<h2 className={styles.table_title}>{formatMessage(stakingMessages.payment_history)}</h2>
						{isInterestsLoading ? (
							[...new Array(12)].map((_, i: number) => (
								<RowSkeleton cells={headerOptions.columns} key={`skeleton_${i}`} />
							))
						) : (
							<Table header={headerOptions}>
								{interests && interests.results.length ? (
									interests.results.map((interest) => (
										<InterestRow interest={interest} key={interest.id} />
									))
								) : (
									<div className={noResultsStyles.no_rows_message_container}>
										<i className="ai ai-file_text" />
										<span>{formatMessage(stakingMessages.no_positions)}</span>
									</div>
								)}
							</Table>
						)}
					</>
				)}
			</div>
			{isAuthenticated && interests && interests.count ? (
				<Pagination page={page} onChange={setPage} count={Math.ceil(interests.count / PAGE_SIZE)} />
			) : null}
		</div>
	);
};

export default observer(Interests);

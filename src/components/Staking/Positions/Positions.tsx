import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import tableStyles from "styles/pages/Table.module.scss";
import commonMessages from "messages/common";
import stakingMessages from "messages/staking";
import noResultsStyles from "styles/components/Table/NoResultMessage.module.scss";
import pageStyles from "styles/pages/Page.module.scss";
import styles from "styles/pages/Staking.module.scss";
import { Table } from "components/UI/Table";
import { useMst } from "models/Root";
import useWindowSize from "hooks/useWindowSize";
import Pagination from "components/UI/Pagination";
import InternalLink from "components/InternalLink";
import { AlignEnum, IHeader } from "components/UI/Table/Table";
import Tooltip from "components/UI/Tooltip";
import RowSkeleton from "components/UI/Table/RowSkeleton";
import { usePositions } from "services/StakingService";
import { queryVars } from "constants/query";
import { routes } from "constants/routing";
import PositionItem from "./PositionItem";

interface IProps {
	type: "active" | "history";
}

const Positions: React.FC<IProps> = ({ type }) => {
	const { formatMessage } = useIntl();
	const { tablet } = useWindowSize();
	const {
		global: { locale, isAuthenticated },
		account: { balances },
	} = useMst();
	const [page, setPage] = useState<number>(1);
	const {
		data: positions,
		isFetching: isPositionsLoading,
		refetch: refetchPositions,
	} = isAuthenticated
		? usePositions({
				page,
				[queryVars.is_redeemed]: !(type === "active"),
				[queryVars.ordering]:
					type === "active" ? `-${queryVars.subscribed_at}` : `-${queryVars.redeemed_at}`,
		  })
		: {
				data: null,
				isFetching: false,
				refetch: null,
		  };

	const positionsItems = useMemo(
		() =>
			positions && positions.results.length ? (
				positions.results.map((position) => (
					<PositionItem
						key={position.id}
						type={type}
						mobile={tablet}
						position={position}
						refetchPositions={refetchPositions}
						currency={
							balances?.find((curr) => curr.code === position.plan.project?.currency?.code) || null
						}
					/>
				))
			) : (
				<div className={noResultsStyles.no_rows_message_container}>
					<i className="ai ai-file_text" />
					<span>{formatMessage(stakingMessages.no_positions)}</span>
				</div>
			),
		[positions, locale, balances.length, type, tablet],
	);

	const headerOptions: IHeader = {
		primary: true,
		columns: [
			{
				label: formatMessage(commonMessages.coin),
			},
			{
				label: formatMessage(commonMessages.amount),
				align: AlignEnum.Right,
			},
			{ width: "50px", maxWidth: "50px" },
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
				maxWidth: "100px",
			},
			{
				maxWidth: "120px",
				label: formatMessage(stakingMessages.positions_table_time_passed),
			},
			{
				maxWidth: "100px",
				align: AlignEnum.Right,
				label: formatMessage(stakingMessages.positions_table_paid),
			},
			{
				align: AlignEnum.Center,
				label: formatMessage(stakingMessages.positions_table_start),
			},
			...(type === "active"
				? [
						{
							align: AlignEnum.Right,
							maxWidth: "120px",
							label: formatMessage(stakingMessages.positions_table_income),
						},
						{
							minWidth: "170px",
						},
				  ]
				: []),
			{
				align: AlignEnum.Center,
				label: formatMessage(
					type === "active" ? stakingMessages.close_staking : stakingMessages.positions_table_end,
				),
			},
			{
				align: AlignEnum.Center,
				maxWidth: "120px",
				label: formatMessage(stakingMessages.positions_table_status),
			},
			{
				width: "40px",
				maxWidth: "40px",
			},
		],
	};

	useEffect(() => {
		if (refetchPositions) {
			refetchPositions();
		}
	}, [type]);

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
				) : tablet ? (
					positionsItems
				) : (
					<>
						<h2 className={styles.table_title}>
							{formatMessage(type === "active" ? stakingMessages.stakings : commonMessages.history)}
						</h2>
						{isPositionsLoading ? (
							[...new Array(12)].map((_, i: number) => (
								<RowSkeleton cells={headerOptions.columns} key={`skeleton_${i}`} />
							))
						) : (
							<Table header={headerOptions}>{positionsItems}</Table>
						)}
					</>
				)}
			</div>
			{isAuthenticated && positions && positions.count ? (
				<Pagination page={page} onChange={setPage} count={Math.ceil(positions.count / 12)} />
			) : null}
		</div>
	);
};

export default observer(Positions);

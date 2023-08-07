import React, { useEffect, useState } from "react";
import styles from "styles/components/TransactionsMonitoring/PieDataList.module.scss";
import Skeleton from "react-loading-skeleton";
import get from "lodash.get";
import cloneDeep from "lodash.clonedeep";
import { IScoreDataSourceVisual } from "types/amlReport";
import { formatShare, roundShare } from "utils/reportUtils";
import GlPie from "./GlPie";

interface Props {
	data: IScoreDataSourceVisual[];
	loading: boolean;
	title: string;
	trackByLabel?: string;
	trackByLabelSupport?: string;
}

const PieDataList: React.FC<Props> = (props) => {
	const { data, loading, title, trackByLabel = "owner", trackByLabelSupport = "owner" } = props;

	const [pieData, setPieData] = useState<IScoreDataSourceVisual[]>([]);

	useEffect(() => {
		const pieData: IScoreDataSourceVisual[] = cloneDeep(data);
		const sortedPieData = pieData
			.sort((a, b) => (a.funds.score > b.funds.score ? 1 : -1))
			.sort((a, b) => (Number(a.funds.default) > Number(b.funds.default) ? 1 : -1));

		setPieData(sortedPieData);
	}, [data]);

	const formatLabel = (item: IScoreDataSourceVisual) =>
		get(item, trackByLabel) ? get(item, trackByLabel) : get(item, trackByLabelSupport) || "";

	return (
		<div className={styles.pie_data_list_container}>
			<div className={styles.title}>
				<h4>{title}</h4>
			</div>
			<div className={styles.pie_wrapper}>
				{loading ? (
					<Skeleton circle enableAnimation className={styles.pie_circle_loader} />
				) : (
					<GlPie dataSource={pieData} />
				)}
				<div className={styles.legend}>
					{loading ? (
						<div className={styles.list_container}>
							<Skeleton duration={1} count={10} height="auto" width="100%" />
						</div>
					) : (
						pieData?.map((item, index: number) => (
							<div key={index} className={styles.list_element}>
								<div style={{ display: "flex", alignItems: "center" }}>
									<div
										className={styles.graph_marker}
										style={{ backgroundColor: item.itemStyle.color }}
									/>
									<div style={{ marginRight: "24px", textTransform: "capitalize" }}>
										{formatLabel(item)}
									</div>
								</div>
								<div style={{ fontWeight: "500" }}>
									{pieData?.length === 1 ? formatShare(1) : formatShare(roundShare(item.share))}
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default PieDataList;

import React from "react";
import cn from "classnames";

import { TableData, TableRow } from "components/UI/Table";
import styles from "styles/components/TransactionsMonitoring/Tables.module.scss";
import { IScoreDataSourceExt, SourcesTypeEnum } from "types/amlReport";
import Tooltip from "components/UI/Tooltip";
import {
	capitalizeFirstLetter,
	findMinMaxFields,
	formatShare,
	roundShare,
	trancateString,
} from "utils/reportUtils";
import useCopyClick from "hooks/useCopyClick";
import GlTag from "../GlTag";

interface Props {
	data: IScoreDataSourceExt;
	type: SourcesTypeEnum;
}

const TxRow: React.FC<Props> = ({ data }) => {
	const copyClick = useCopyClick();

	const handleCopy = () => {
		if (data.tx_hash) {
			copyClick(data.tx_hash);
		}
	};

	return (
		<TableRow common className={styles.table_row}>
			<TableData maxWidth="250px" minWidth="250px">
				{data.emptyOwner || !data.owner ? (
					<div className={styles.link}>{trancateString(data.address || "")}</div>
				) : (
					<div>{capitalizeFirstLetter(data.owner)}</div>
				)}
			</TableData>
			<TableData maxWidth="300px" minWidth="300px">
				{data.funds?.name ? (
					<GlTag score={data.funds.score} tag={capitalizeFirstLetter(data.funds.name)} />
				) : data.funds?.type ? (
					<GlTag score={data.funds.score} tag={capitalizeFirstLetter(data.funds.type)} />
				) : data.typeData ? (
					<GlTag score={data.typeData.score} tag={capitalizeFirstLetter(data.typeData.name)} />
				) : (
					<div>--</div>
				)}
			</TableData>
			<TableData maxWidth="150px" minWidth="150px">
				{findMinMaxFields(data.depth)}
			</TableData>
			<TableData maxWidth="150px" minWidth="150px">
				<Tooltip
					id="share-data-tooltip"
					text={`${data.share * 100}%`}
					place="top"
					backgroundColor="var(--tooltip-background)"
					opener={<span>{formatShare(roundShare(data.share))}</span>}
				/>
			</TableData>
			<TableData maxWidth="500px" minWidth="350px">
				<div className={styles.link}>
					{data.tx_hash || "--"}
					<i className={cn("ai ai-copy_new", styles.copy_button)} onClick={handleCopy} />
				</div>
			</TableData>
		</TableRow>
	);
};

export default TxRow;

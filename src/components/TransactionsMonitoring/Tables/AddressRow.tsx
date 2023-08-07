import React from "react";
import { useIntl } from "react-intl";
import cn from "classnames";

import { TableData, TableRow } from "components/UI/Table";
import styles from "styles/components/TransactionsMonitoring/Tables.module.scss";
import Tooltip from "components/UI/Tooltip";
import { IScoreDataSourceExt, SourcesTypeEnum } from "types/amlReport";
import {
	capitalizeFirstLetter,
	checkMultiple,
	findMinMaxFields,
	formatBtcAmount,
	formatShare,
	getOwnerByType,
	roundShare,
	trancateString,
} from "utils/reportUtils";
import messages from "messages/report";
import useCopyClick from "hooks/useCopyClick";
import GlTag from "../GlTag";

interface Props {
	data: IScoreDataSourceExt;
	type: SourcesTypeEnum;
}

const AddressRow: React.FC<Props> = ({ data, type }) => {
	const { formatMessage } = useIntl();
	const copyClick = useCopyClick();

	return (
		<TableRow common className={styles.table_row}>
			<TableData minWidth="120px" maxWidth="120px">
				{formatBtcAmount(data.amount, false)}
			</TableData>
			<TableData maxWidth="350px" minWidth="350px">
				<div className={styles.link}>
					{data.directTx || "--"}
					<i
						className={cn("ai ai-copy_new", styles.copy_button)}
						onClick={() => copyClick(data.directTx)}
					/>
				</div>
			</TableData>
			<TableData minWidth="250px" maxWidth="250px">
				{type === SourcesTypeEnum.UNKNOWN ? (
					(checkMultiple(data.cluster) || checkMultiple(data.address)) &&
					data.typeData?.name !== "unidentified service / exchange" ? (
						<div>{formatMessage(messages.multiple)}</div>
					) : getOwnerByType(data).isLink ? (
						<div className={styles.link}>{getOwnerByType(data).owner}</div>
					) : (
						<div>{getOwnerByType(data).owner}</div>
					)
				) : data.emptyOwner || !data.owner ? (
					<div className={styles.link}>{trancateString(data.address || "")}</div>
				) : (
					<div>{capitalizeFirstLetter(data.owner)}</div>
				)}
			</TableData>
			<TableData maxWidth="250px" minWidth="250px">
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
			<TableData minWidth="100px" maxWidth="100px">
				{findMinMaxFields(data.depth)}
			</TableData>
			<TableData minWidth="100px" maxWidth="100px">
				<Tooltip
					id="share-data-tooltip"
					text={`${data.share * 100}%`}
					place="top"
					backgroundColor="var(--tooltip-background)"
					opener={<span>{formatShare(roundShare(data.share))}</span>}
				/>
			</TableData>
			<TableData maxWidth="500px" minWidth="350px">
				{checkMultiple(data.tx_hash) ? (
					<div>{formatMessage(messages.multiple)}</div>
				) : (
					<div className={styles.link}>
						{data.tx_hash}
						<i
							className={cn("ai ai-copy_new", styles.copy_button)}
							onClick={() => copyClick(data.tx_hash ?? "")}
						/>
					</div>
				)}
			</TableData>
		</TableRow>
	);
};
export default AddressRow;

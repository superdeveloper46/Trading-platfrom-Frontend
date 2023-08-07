import React from "react";
import { TableRow, TableData } from "components/UI/Table";
import { transformDate } from "utils/dayjs";
import { useIntl } from "react-intl";
import { Dayjs } from "dayjs";
import { IAlphaCode } from "models/AlphaCodes";
import cn from "classnames";
import styles from "styles/components/AlphaCodes.module.scss";

interface Props {
	code: IAlphaCode;
}

const ActivatedAlphaCodeRow: React.FC<Props> = ({ code }) => {
	const { formatNumber } = useIntl();
	const date: Dayjs = transformDate(code.date);

	return (
		<TableRow>
			<TableData>
				<div className={styles.date_column}>
					{date.format("DD/MM/YYYY")}
					<span className={styles.date}>{date.format("HH:mm:ss")}</span>
				</div>
			</TableData>
			<TableData>{code.code_search}</TableData>
			<TableData>
				{formatNumber(code.amount, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 8,
					useGrouping: false,
				})}
			</TableData>
			<TableData>
				<i className={cn(`ai ai-${code.currency_id.toLowerCase()}`, styles.currency_icon)} />
				{code.currency_id}
			</TableData>
		</TableRow>
	);
};

export default ActivatedAlphaCodeRow;

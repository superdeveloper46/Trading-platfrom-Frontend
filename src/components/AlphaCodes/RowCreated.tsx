import React from "react";
import { TableRow, TableData } from "components/UI/Table";
import { transformDate } from "utils/dayjs";
import messages from "messages/api";
import code_messages from "messages/alpha_codes";
import Badge from "components/UI/Badge";
import { useIntl } from "react-intl";
import { Dayjs } from "dayjs";
import { IAlphaCode } from "models/AlphaCodes";
import styles from "styles/components/AlphaCodes.module.scss";
import cn from "classnames";

interface Props {
	code: IAlphaCode;
}

const CreatedAlphaCodeRow: React.FC<Props> = ({ code }) => {
	const { formatMessage, formatNumber } = useIntl();

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
				{formatNumber(+code.amount, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 8,
					useGrouping: false,
				})}
			</TableData>
			<TableData>
				<i className={cn(`ai ai-${code.currency_id.toLowerCase()}`, styles.currency_icon)} />
				{code.currency_id}
			</TableData>
			<TableData>
				{code.recipient_email || formatMessage(messages.api_keys_table_limit_to_ip_any)}
			</TableData>
			<TableData>
				<Badge color={code.is_active ? "green" : "red"} alpha>
					{code.is_active
						? formatMessage(code_messages.code_active)
						: formatMessage(code_messages.code_redeemed)}
				</Badge>
			</TableData>
		</TableRow>
	);
};

export default CreatedAlphaCodeRow;

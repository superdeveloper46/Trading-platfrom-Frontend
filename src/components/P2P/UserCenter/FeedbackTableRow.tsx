import React from "react";
import dayjs from "dayjs";
import cn from "classnames";
import { useIntl } from "react-intl";

import p2pMessages from "messages/p2p";
import { TableData, TableRow } from "components/UI/NewTable";
import { IFeedback } from "types/p2p";
import styles from "styles/pages/P2P/UserCenter.module.scss";

interface IProps {
	feedback: IFeedback;
}

const FeedbackTableRow: React.FC<IProps> = ({ feedback }) => {
	const { formatMessage } = useIntl();

	return (
		<TableRow common>
			<TableData align="center" minWidth="120px" maxWidth="140px">
				{feedback.is_positive ? (
					<i className={cn(styles.positive, "ai ai-like_filled")} />
				) : (
					<i className={cn(styles.negative, "ai ai-dislike_filled")} />
				)}
			</TableData>
			<TableData title="pro100" minWidth="130px" maxWidth="300px" crop>
				{feedback.is_anonymous ? formatMessage(p2pMessages.anonymous) : feedback.author}
			</TableData>
			<TableData minWidth="200px" maxWidth="220px">
				{feedback.created_at
					? dayjs.utc(dayjs(feedback.created_at)).format("DD-MM-YYYY HH:mm:ss")
					: "--"}
			</TableData>
			{/* <TableData maxWidth="320px">Wise</TableData> */}
			<TableData maxWidth="400px" title={feedback.text} crop>
				{feedback.text}
			</TableData>
		</TableRow>
	);
};

export default FeedbackTableRow;

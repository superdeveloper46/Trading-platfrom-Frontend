import React, { useMemo } from "react";
import dayjs from "dayjs";
import { useIntl } from "react-intl";

import messages from "messages/common";
import styles from "styles/pages/SocialListingHistory.module.scss";
import listingStyles from "styles/pages/SocialListingProject.module.scss";
import { IDonation } from "types/listing";
import { TableData, TableRow } from "components/UI/Table";
import useWindowSize from "hooks/useWindowSize";

interface IProps {
	donate: IDonation;
}

const ListingHistoryDonateRow: React.FC<IProps> = ({ donate }) => {
	const { mobile } = useWindowSize();
	const { formatMessage } = useIntl();

	const donateTransaction = useMemo(
		() =>
			donate.tx && (
				<a
					className={listingStyles.link_body}
					href={`https://www.blockchain.com/btc/tx/${donate.tx}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					TXID:&nbsp;
					<div className={listingStyles.tx_link_body}>
						<div className={listingStyles.tx_link}>{donate.tx}</div>
					</div>
					<i className="ai ai-web_link" />
				</a>
			),
		[donate],
	);

	return mobile ? (
		<div className={styles.donate_card}>
			<div className={styles.header}>
				<div className={styles.direction}>{formatMessage(messages.amount)}</div>
				<span className={styles.amount}>{donate.value} ALC</span>
			</div>
			<div className={styles.content}>
				<div className={styles.data_row}>
					<div className={styles.title}>
						USER {donate.account && !donate.tx && "User ID"} {donate.tx && "TX"}:
					</div>
					&nbsp;
					{donate.account && !donate.tx && donate.account}
					{donateTransaction}
				</div>
				<div className={styles.data_row}>
					<div className={styles.title}>{formatMessage(messages.date)}</div>
					&nbsp;
					{dayjs(donate.date).format("YYYY-MM-DD HH:mm")}
				</div>
			</div>
		</div>
	) : (
		<TableRow className={styles.donate_row}>
			<TableData>{dayjs(donate.date).format("DD-MM-YYYY HH:mm")}</TableData>
			<TableData align="right">{donate.value} ALC</TableData>
			<TableData align="right">
				{donate.account && !donate.tx && <>User ID: {donate.account}</>}
				{donateTransaction}
			</TableData>
		</TableRow>
	);
};

export default ListingHistoryDonateRow;

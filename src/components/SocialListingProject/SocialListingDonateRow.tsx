import React from "react";

import styles from "styles/pages/SocialListingProject.module.scss";
import { IDonation } from "../../types/listing";

interface IProps {
	donate: IDonation;
}

const LatestDonateRow: React.FC<IProps> = ({ donate }) => (
	<div className={styles.social_listing_donate_row}>
		<i className="ai ai-avatar" />
		<div className={styles.transaction_user}>
			{donate.account && !donate.tx && <>User ID: {donate.account}</>}
			{donate.tx && (
				<a
					className={styles.link_body}
					href={`https://www.blockchain.com/btc/tx/${donate.tx}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					TXID:&nbsp;
					<div className={styles.tx_link_body}>
						<div className={styles.tx_link_body}>{donate.tx}</div>
					</div>
					<i className="ai ai-web_link" />
				</a>
			)}
		</div>
		{/* {donate.user} */}
		<div className={styles.donate_amount}>
			<i className="ai ai-alc" />
			{donate.value}
		</div>
	</div>
);

export default LatestDonateRow;

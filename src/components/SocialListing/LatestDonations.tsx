import React from "react";
import messages from "messages/listing";
import commonMessages from "messages/common";
import Table from "components/UI/Table/Table";
import { useIntl } from "react-intl";
import TableRow from "components/UI/Table/TableRow";
import TableData from "components/UI/Table/TableData";
import { useLatestDonations } from "services/SocialListingService";
import SkeletonLoader from "components/UI/Skeleton";
import styles from "styles/pages/SocialListing.module.scss";
import { IDonation } from "types/listing";

const DonationSkeleton = () => (
	<TableRow>
		<TableData>
			<SkeletonLoader fullWidth />
		</TableData>
		<TableData>
			<SkeletonLoader fullWidth />
		</TableData>
		<TableData>
			<SkeletonLoader fullWidth />
		</TableData>
	</TableRow>
);

const DonationRow: React.FC<{ donation: IDonation }> = ({ donation }) => {
	const { formatNumber } = useIntl();

	return donation.project ? (
		<TableRow key={donation.account}>
			<TableData minWidth="30px">
				<img
					src={donation.project.thumb_image}
					alt={donation.project.name}
					width="24"
					height="24"
				/>
				&nbsp;&nbsp;
				<span>{donation.project.symbol}</span>
			</TableData>
			<TableData align="center" styleInline={{ whiteSpace: "nowrap" }}>
				User ID:&nbsp;{donation.account}
			</TableData>
			<TableData align="right" minWidth="30px">
				{formatNumber(donation.amount, {
					useGrouping: false,
					maximumFractionDigits: 8,
				})}
				&nbsp;{donation.currency}
			</TableData>
		</TableRow>
	) : null;
};

const LatestDonations: React.FC = () => {
	const { formatMessage } = useIntl();
	const { data: { results } = { results: [] }, isLoading } = useLatestDonations();

	return (
		<section>
			<div className={styles.donations_header}>
				<i className="ai ai-clock" />
				<div>
					<h2>{formatMessage(messages.latest_donates)}</h2>
					<span>{formatMessage(messages.latest_donates_desc)}</span>
				</div>
			</div>
			<Table
				header={{
					columns: [
						{
							label: formatMessage(commonMessages.coin),
							minWidth: "30px",
						},
						{
							label: formatMessage(commonMessages.user),
							align: "center",
						},
						{
							label: formatMessage(commonMessages.amount),
							align: "right",
							minWidth: "30px",
						},
					],
				}}
			>
				{isLoading
					? [...new Array(5)].map((_, idx) => <DonationSkeleton key={idx} />)
					: results.map((donation, idx) => <DonationRow donation={donation} key={idx} />)}
			</Table>
		</section>
	);
};

export default LatestDonations;

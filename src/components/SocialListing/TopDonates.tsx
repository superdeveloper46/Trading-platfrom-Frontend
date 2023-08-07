import React from "react";
import messages from "messages/listing";
import commonMessages from "messages/common";
import Table from "components/UI/Table/Table";
import { useIntl } from "react-intl";
import TableRow from "components/UI/Table/TableRow";
import TableData from "components/UI/Table/TableData";
import { useTopDonations } from "services/SocialListingService";
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
	</TableRow>
);

const DonationRow: React.FC<{ donation: IDonation }> = ({ donation }) => {
	const { formatNumber } = useIntl();

	return donation.project ? (
		<TableRow key={donation.account}>
			<TableData>
				<img
					src={donation.project.thumb_image}
					alt={donation.project.name}
					width="24"
					height="24"
				/>
				&nbsp;User ID:&nbsp;{donation.account}
			</TableData>
			<TableData align="right">
				{formatNumber(donation.amount, {
					useGrouping: false,
					maximumFractionDigits: 8,
				})}
				&nbsp;{donation.currency}
			</TableData>
		</TableRow>
	) : null;
};

const TopDonations: React.FC = () => {
	const { formatMessage } = useIntl();
	const { data: { results } = { results: [] }, isLoading } = useTopDonations();

	return (
		<section>
			<div className={styles.donations_header}>
				<i className="ai ai-star_filled" />
				<div>
					<h2>{formatMessage(messages.top_donates)}</h2>
					<span>{formatMessage(messages.top_donates_desc)}</span>
				</div>
			</div>
			<Table
				header={{
					columns: [
						{
							label: formatMessage(commonMessages.user),
						},
						{
							label: formatMessage(commonMessages.amount),
							align: "right",
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

export default TopDonations;

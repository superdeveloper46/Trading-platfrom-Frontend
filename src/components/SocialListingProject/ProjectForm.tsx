import React, { useState, useRef, useMemo } from "react";
import QrCode from "qrcode.react";
import { useIntl } from "react-intl";
import dayjs from "dayjs";
import cn from "classnames";

import listing_messages from "messages/listing";
import common_messages from "messages/common";
import styles from "styles/pages/SocialListingProject.module.scss";
import { IListingProject } from "types/listing";
import useWindowSize from "hooks/useWindowSize";
import InternalLink from "components/InternalLink";
import Button from "components/UI/Button";
import {
	useLatestProjectDonations,
	useProjectPaymentChannels,
} from "services/SocialListingService";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { queryVars } from "constants/query";
import { routes } from "constants/routing";
import useCopyClick from "hooks/useCopyClick";
import SocialListingDonateRow from "./SocialListingDonateRow";
import ListingDonateModal from "./ListingDonateModal";

interface IProps {
	project: IListingProject;
}

const ProjectForm: React.FC<IProps> = ({ project }) => {
	const { formatMessage } = useIntl();
	const { smallTablet } = useWindowSize();
	const copyClick = useCopyClick();

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const handleModalOpen = () => {
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
	};

	const { data: latestDonations, isFetching: isDonationsFetching } = useLatestProjectDonations(
		project.slug,
		{
			[queryVars.page_size]: 5,
		},
	);
	const { data: paymentChannels, isFetching: isPaymentsChannelsLoading } =
		useProjectPaymentChannels(project.slug);

	const rateCurrency = paymentChannels && paymentChannels.find((ch) => ch.currency === "BTC");

	const copyAttr = useRef(null);
	const handleClickCopy = () => {
		if (rateCurrency?.address) {
			copyClick(rateCurrency.address);
		}
	};
	const now = dayjs().unix();
	const activeTo = project && dayjs(project.active_till).unix();
	const isCancelled =
		project &&
		!project.completed_at &&
		now > activeTo &&
		project.current_amount < project.target_amount;
	const isListed = project.current_amount > project.target_amount;
	const [qrHidden, setQrHidden] = useState(isCancelled || smallTablet || isListed);
	const handleToggleQR = () => setQrHidden(!qrHidden);

	const qrCode = useMemo(() => {
		if (isPaymentsChannelsLoading) {
			return <LoadingSpinner />;
		}
		return (
			rateCurrency &&
			rateCurrency?.attributes?.address && (
				<QrCode size={192} value={rateCurrency?.attributes?.address} />
			)
		);
	}, [isPaymentsChannelsLoading, rateCurrency]);

	return (
		<div className={styles.project_form}>
			<div className={styles.qr_container}>
				<div
					onClick={handleToggleQR}
					className={cn(styles.qr_header, { [styles.hidden]: qrHidden })}
				>
					<div className={styles.qr_desc}>
						<i className="ai ai-qr-code-01" />
						{formatMessage(listing_messages.donate_on_btc)}
					</div>
					<div className={styles.qr_convert_value}>
						{qrHidden ? <i className="ai ai-chevron_down" /> : <i className="ai ai-chevron_up" />}
					</div>
				</div>
				<div className={cn(styles.qr_block, { [styles.hidden]: qrHidden })}>
					<div className={styles.qr_block_background}>
						{isCancelled ||
							(isListed && <div className={cn(styles.qr_block_background, styles.disabled)} />)}
						{qrCode}
					</div>
					<div
						className={styles.qr_copy_address}
						ref={copyAttr}
						data-address={rateCurrency?.attributes?.address}
					>
						{rateCurrency?.attributes?.address}
						<i className="ai ai-copy_outlined" onClick={handleClickCopy} />
					</div>
				</div>
			</div>
			<div className={styles.progress_container}>
				<div className={styles.progress_data}>
					<div className={styles.progress_info}>
						<i className="ai ai-alc" />
						<div className={styles.current_amount}>{project.current_amount.toFixed(0)}</div>
						<div className={styles.target_amount}>{project.target_amount} ALC</div>
					</div>
					<div className={styles.progress_indicator}>
						<div
							className={styles.fill}
							style={{
								width: `${
									Number((project.current_amount / project.target_amount).toFixed(2)) * 100
								}%`,
							}}
						/>
					</div>
				</div>
				<div className={styles.tech_text}>{rateCurrency && `1 BTC = ${rateCurrency.rate} ALC`}</div>{" "}
				<div className={styles.button_block}>
					<Button
						color="secondary"
						label={formatMessage(listing_messages.modal_header)}
						onClick={handleModalOpen}
						disabled={isCancelled || isListed}
					/>
				</div>
				<div className={styles.table_header}>
					<i className="ai ai-clock" />
					{formatMessage(listing_messages.latest_donates)}
					<div className={styles.counter_badge}>{project.donation_number}</div>
				</div>
				{latestDonations && latestDonations.results.length > 0 ? (
					latestDonations.results.map((donate, index) => (
						<SocialListingDonateRow donate={donate} key={index} />
					))
				) : (
					<span className={styles.empty_donation_message}>
						{isDonationsFetching ? (
							<LoadingSpinner />
						) : (
							formatMessage(common_messages.no_match_search)
						)}
					</span>
				)}
				<div className={styles.history_link}>
					<InternalLink to={routes.socialListing.getProjectDonatesHistoryUrl(project.slug)}>
						{formatMessage(listing_messages.all_project_donates)}
						<i className="ai ai-chevron_right" />
					</InternalLink>
				</div>
			</div>
			<ListingDonateModal
				paymentChannels={paymentChannels || []}
				project={project}
				isOpen={isModalOpen}
				onClose={handleModalClose}
			/>
		</div>
	);
};

export default ProjectForm;

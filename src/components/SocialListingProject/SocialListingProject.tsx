import React, { useState } from "react";
import { useIntl } from "react-intl";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import common_messages from "messages/common";
import messages from "messages/listing";
import paradiseMessages from "messages/paradise";
import styles from "styles/pages/SocialListingProject.module.scss";
import listingBadgeImg from "assets/images/listing/bage_plus.svg";
import Markdown from "components/UI/Markdown";
import { IListingProject } from "types/listing";
import useWindowSize from "hooks/useWindowSize";
import { useMst } from "models/Root";
import LoadingSpinner from "components/UI/LoadingSpinner";
import ShareContainer from "components/ShareContainer";
import Tab from "components/UI/Tab";
import { routes } from "constants/routing";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import ProjectForm from "./ProjectForm";

interface IProps {
	project?: IListingProject;
	isLoading?: boolean;
}

const SocialListingDetails: React.FC<IProps> = ({ project, isLoading }) => {
	const {
		global: { locale },
	} = useMst();
	const { mobile, smallTablet } = useWindowSize();
	const [activeTab, setActiveTab] = useState("campaign");
	const localeNavigate = useLocaleNavigate();

	const { formatMessage } = useIntl();

	const handleTabsChange = (name: string) => {
		setActiveTab(name);
	};

	const getCurrentTabContent = (tab: string) => {
		switch (tab) {
			case "campaign":
				return <Markdown content={project?.campaign || ""} />;
			case "roadmap":
				return <Markdown content={project?.roadmap || ""} />;
			case "team":
				return <Markdown content={project?.team || ""} />;
			case "comments":
				return <span>Comments soon</span>;
			default:
				return null;
		}
	};

	const now = dayjs().unix();
	const activeTo = project && dayjs(project.active_till).unix();
	const isCancelled =
		project &&
		!project.completed_at &&
		now > (activeTo || 0) &&
		project.current_amount < project.target_amount;

	const tabs = [
		{
			name: "campaign",
			label: formatMessage(paradiseMessages.campaing),
		},
		{
			name: "roadmap",
			label: "Roadmap",
		},
		{
			name: "team",
			label: formatMessage(paradiseMessages.team),
		},
		{
			name: "comments",
			label: formatMessage(paradiseMessages.comments),
		},
	];

	return (
		<div className={styles.container}>
			{isLoading && <LoadingSpinner />}
			{project && (
				<div className={styles.project}>
					<button
						type="button"
						className={styles.back_button}
						onClick={() => localeNavigate(routes.socialListing.root)}
					>
						<i className="ai ai-chevron_left" />
						{formatMessage(messages.back_to_rating_btn)}
					</button>
					<div className={styles.project_content}>
						<div className={styles.project_info}>
							<div className={styles.img_card}>
								<div className={styles.img_container}>
									{!isCancelled && !project.completed_at && generateIconWithStatus(project)}
									{isCancelled && (
										<div className={cn(styles.state_background, styles.img_container)}>
											<span className={styles.cancelled_state_badge}>Cancelled</span>
										</div>
									)}
									{project && project.completed_at && (
										<div className={cn(styles.state_background, styles.img_container)}>
											<span className={cn(styles.cancelled_state_badge, styles.listing)}>
												<img src={listingBadgeImg} alt="social listing success project" />
												{formatMessage(common_messages.listing)}
											</span>
										</div>
									)}
									<img
										className={styles.background_img}
										src={project.cover_image}
										alt={project.symbol}
									/>
									<div className={styles.image_info}>
										<div className={styles.image_info_header}>
											<img alt="thumb" className={styles.thumb_img} src={project.thumb_image} />
											{project.name} ({project.symbol})
										</div>
										<span className={styles.image_info_desc}>{project.description_full}</span>
									</div>
								</div>
								{!mobile && (
									<div className={styles.social_network_container}>
										<ShareContainer
											link={`https://alp.com/${locale}${routes.socialListing.getProjectUrl(
												project.slug,
											)}`}
										/>
									</div>
								)}
							</div>
							{smallTablet && (
								<div className={styles.mobile_project_form}>
									<ProjectForm project={project} />
								</div>
							)}
							<div className={styles.card}>
								<div className={styles.project_card_content}>
									<div className={styles.tabs}>
										{tabs.map(({ label, name }) => (
											<Tab
												key={label}
												isActive={activeTab === name}
												label={label}
												onClick={() => handleTabsChange(name)}
											/>
										))}
									</div>
									<div className={styles.tab_content}>{getCurrentTabContent(activeTab)}</div>
								</div>
							</div>
						</div>
						{!smallTablet && (
							<div className={styles.sticky_block}>
								<div className={styles.sticky_content}>
									<ProjectForm project={project} />
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export const generateIconWithStatus = (project: IListingProject) => {
	const now = dayjs().unix() * 1000;
	const latestDonateDate = dayjs(project.last_donation_at).unix() * 1000;
	const diff = dayjs(now).diff(dayjs(latestDonateDate), "days");

	if (diff < 1) return <i className={cn(styles.status_image, "ai ai-arrow_up")} />;
	if (diff < 3) return <i className={cn(styles.status_image, styles.high, "ai ai-arrow_up")} />;
	if (diff > 1) return <i className={cn(styles.status_image, styles.low, "ai ai-arrow_down")} />;
	return null;
};

export default observer(SocialListingDetails);

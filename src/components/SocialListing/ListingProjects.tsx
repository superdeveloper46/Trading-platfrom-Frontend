import React from "react";
import cn from "classnames";
import { useIntl } from "react-intl";
import dayjs from "utils/dayjs";

import commonMessages from "messages/common";
import messages from "messages/listing";
import { useProjects } from "services/SocialListingService";
import styles from "styles/pages/SocialListing.module.scss";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { IListingProject } from "types/listing";
import InternalLink from "components/InternalLink";
import ProgressBar from "components/UI/ProgressBar";
import Badge from "components/UI/Badge";
import SafeImg from "components/UI/SafeImg";
import { routes } from "constants/routing";
import { generateIconWithStatus } from "../SocialListingProject/SocialListingProject";

const sortProjectsStatus = (a: IListingProject) =>
	dayjs().isAfter(dayjs(a.active_till)) || a.completed_at ? 1 : -1;

const sortProjectsDonates = (a: IListingProject, b: IListingProject) =>
	a.donation_number - b.donation_number;

interface IProject {
	project: IListingProject;
}

const ListingProject: React.FC<IProject> = ({ project }) => {
	const { formatMessage, formatNumber } = useIntl();

	const isDone = dayjs().isAfter(dayjs(project.active_till)) || project.completed_at;

	return (
		<div className={styles.project}>
			<InternalLink
				to={routes.socialListing.getProjectUrl(project.slug)}
				className={styles.project_img}
			>
				<SafeImg
					className={cn({ [styles.disable_img]: isDone })}
					src={project.thumb_image}
					width="90"
					height="90"
					alt={project.name}
				/>
				{isDone ? (
					<div className={styles.project_status}>
						<Badge color={project.completed_at ? "green" : "grey"} alpha>
							<span>{project.completed_at ? "LISTING" : "CANCELLED"}</span>
						</Badge>
					</div>
				) : null}
				{!isDone && generateIconWithStatus(project)}
			</InternalLink>
			<div className={styles.project_content}>
				<div className={styles.project_body}>
					<InternalLink to={routes.socialListing.getProjectUrl(project.slug)}>
						<h3>
							{project.name}&nbsp;({project.symbol})
						</h3>
					</InternalLink>
					<span>{project.description_short}</span>
					<div className={styles.project_progress}>
						<div className={styles.project_progress_amount}>
							<span>
								<i className="ai ai-listing" />
								&nbsp;
								<b>
									{formatNumber(project.current_amount, {
										useGrouping: false,
										maximumFractionDigits: 8,
									})}
								</b>
							</span>
							<span>
								{formatNumber(project.target_amount, {
									useGrouping: false,
									maximumFractionDigits: 8,
								})}
								&nbsp;{project.currency}
							</span>
						</div>
						<ProgressBar
							color="coral"
							progress={Math.min((project.current_amount / project.target_amount) * 100, 100)}
						/>
					</div>
				</div>
				<div className={styles.project_meta}>
					<div className={styles.project_meta_donates}>
						<i className="ai ai-avatar_new" />
						{formatMessage(messages.donates)}:&nbsp;<span>{project.donation_number}</span>
					</div>
					<InternalLink to={routes.socialListing.getProjectUrl(project.slug)}>
						{formatMessage(commonMessages.more)}
						<i className="ai ai-forth" />
					</InternalLink>
				</div>
			</div>
		</div>
	);
};

interface IProps {
	historyMode?: boolean;
}

const ListingProjects: React.FC<IProps> = ({ historyMode }) => {
	const { data: { results } = { results: [] }, isLoading } = useProjects();
	const { formatMessage } = useIntl();

	return (
		<section className={cn(styles.projects, { [styles.history_mode]: historyMode })}>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				results
					.sort(sortProjectsDonates)
					.sort(sortProjectsStatus)
					.map((project) => <ListingProject project={project} key={project.name} />)
			)}
			{!historyMode ? (
				<InternalLink className={styles.see_history_link} to={routes.socialListing.history}>
					{formatMessage(messages.project_list_history_link)}
					<i className="ai ai-chevron_right" />
				</InternalLink>
			) : null}
		</section>
	);
};

export default ListingProjects;

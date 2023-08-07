import React, { useState } from "react";
import cn from "classnames";
import { toast } from "react-toastify";
import Slider, { Settings } from "react-slick";
import { useIntl } from "react-intl";

import Button from "components/UI/Button";
import styles from "styles/pages/P2P/UserCenter.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import { IUserDetails } from "types/p2p";
import { getPercentageOf } from "utils/p2p";
import P2PService from "services/P2PService";
import errorHandler from "utils/errorHandler";
import LoadingSpinner from "components/UI/LoadingSpinner";
import DropdownWithContent from "components/DropdownWithContent";
import { ReactComponent as Dots } from "assets/icons/dots-horizontal.svg";
import useWindowSize from "hooks/useWindowSize";
import { chunkArray } from "utils/getter";
import p2pMessages from "messages/p2p";
import ReportModal from "../modals/ReportModal";
import BlockUserModal from "../modals/BlockUserModal";

interface IStats {
	label: string;
	value: React.ReactNode;
}

interface IProps {
	profileInfo?: IUserDetails;
	isLoading: boolean;
	refetch: () => void;
}

const UserStats: React.FC<IProps> = ({ profileInfo, isLoading, refetch }) => {
	const { formatMessage } = useIntl();
	const { medium } = useWindowSize();

	const [isReportModalOpened, toggleReportModal] = useState(false);
	const [isBlockModalOpened, toggleBlockModal] = useState(false);

	const [isUnblocking, toggleIsUnblocking] = useState(false);

	const handleUnblock = () => {
		toggleIsUnblocking(true);
		return P2PService.unblockUser(profileInfo?.id || -1)
			.then(() => {
				refetch();
				toast.success(formatMessage(p2pMessages.user_unblocked));
			})
			.catch(errorHandler)
			.finally(() => toggleIsUnblocking(false));
	};

	const stats = profileInfo
		? [
				{
					label: formatMessage(p2pMessages.all_trades),
					value: `${profileInfo.all_trades} ${formatMessage(p2pMessages.times)}`,
				},
				{
					label: formatMessage(p2pMessages.avg_release_time),
					value: `${profileInfo.avg_release_time} min.`,
				},
				{
					label: formatMessage(p2pMessages.month_completion_rate),
					value: `${getPercentageOf(profileInfo.completed_trades_30d, profileInfo.trades_30d)} %`,
				},
				{ label: formatMessage(p2pMessages.month_trades), value: `${profileInfo.trades_30d} time` },
				{
					label: formatMessage(p2pMessages.avg_pay_time),
					value: `${profileInfo.avg_payment_time} min.`,
				},
				{
					label: formatMessage(p2pMessages.feedback),
					value: (
						<>
							{getPercentageOf(
								profileInfo.positive_feedback_count,
								profileInfo.positive_feedback_count + profileInfo.negative_feedback_count,
							)}
							% (<span className={styles.positive}>{profileInfo.positive_feedback_count}</span> /{" "}
							<span className={styles.negative}>{profileInfo.negative_feedback_count}</span>)
						</>
					),
				},
		  ]
		: [];

	const blockAction = profileInfo?.is_blocked ? (
		<Button
			label={formatMessage(p2pMessages.unblock)}
			variant="text"
			onClick={handleUnblock}
			isLoading={isUnblocking}
			mini={medium}
		/>
	) : (
		<Button
			onClick={() => toggleBlockModal(true)}
			variant="text"
			iconCode="shield_off"
			iconAlign="right"
			color="secondary"
			label={formatMessage(p2pMessages.block)}
			mini={medium}
		/>
	);

	const reportAction = (
		<Button
			onClick={() => toggleReportModal(true)}
			variant="text"
			iconCode="flag_filled-221"
			iconAlign="right"
			color="secondary"
			label={formatMessage(p2pMessages.report)}
			mini={medium}
		/>
	);

	return (
		<div className={styles.user_stats_container}>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<div className={styles.user_header}>
						<div className={styles.username}>
							<span className={styles.user_title}>{profileInfo?.nickname}</span>
						</div>
						<div className={p2pStyles.badges}>
							<div className={cn(p2pStyles.verified_badge, p2pStyles.user)}>
								<i className="ai ai-user_check" />
								{formatMessage(p2pMessages.verified_user)}
							</div>
							{profileInfo?.is_merchant && (
								<div className={cn(p2pStyles.verified_badge, p2pStyles.merchant)}>
									<i className="ai ai-check_filled" />
									{formatMessage(p2pMessages.verified_merchant)}
								</div>
							)}
							{profileInfo?.is_blocked && (
								<div className={cn(p2pStyles.verified_badge, p2pStyles.blocked)}>
									<i className="ai ai-error_circle" />
									{formatMessage(p2pMessages.blocked)}
								</div>
							)}
						</div>
						{!medium && (
							<div className={styles.action_buttons}>
								{blockAction}
								{reportAction}
							</div>
						)}
						{medium && (
							<DropdownWithContent
								className={p2pStyles.dropdown_container}
								label={() => (
									<div className={p2pStyles.filter}>
										<Dots />
									</div>
								)}
							>
								{() => (
									<div className={cn(p2pStyles.filter_content, p2pStyles.table_filter)}>
										{blockAction}
										{reportAction}
									</div>
								)}
							</DropdownWithContent>
						)}
					</div>
					<div className={cn(styles.user_stats_bar, styles.userPage)}>
						{!medium ? (
							stats.map(({ label, value }, i) => (
								<div key={i} className={styles.stats_card}>
									<div className={styles.header}>
										<span className={p2pStyles.smallcaps_label}>{label}</span>
									</div>
									<div className={styles.value}>{value}</div>
								</div>
							))
						) : (
							<Slider {...settings} className={styles.slider}>
								{chunkArray(stats, 4).map((arr, i) => (
									<div key={i} className={styles.mobile_slick_item}>
										{arr.map(({ label, value }: IStats, i) => (
											<div key={i} className={styles.stats_card}>
												<div className={styles.header}>
													<span className={p2pStyles.smallcaps_label}>{label}</span>
												</div>
												<div className={styles.value}>{value}</div>
											</div>
										))}
									</div>
								))}
							</Slider>
						)}
					</div>
				</>
			)}
			<ReportModal
				nickname={profileInfo?.nickname || ""}
				isOpen={isReportModalOpened}
				onClose={() => toggleReportModal(false)}
			/>
			{isBlockModalOpened && profileInfo ? (
				<BlockUserModal
					refetch={refetch}
					profile={profileInfo}
					isOpen={isBlockModalOpened}
					onClose={() => toggleBlockModal(false)}
				/>
			) : null}
		</div>
	);
};

const settings: Settings = {
	dots: true,
	infinite: false,
	speed: 250,
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: false,
	lazyLoad: "progressive",
	arrows: false,
};

export default UserStats;

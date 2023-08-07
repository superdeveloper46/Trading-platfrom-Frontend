import React, { useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import Slider, { Settings } from "react-slick";

import messages from "messages/common";
import styles from "styles/pages/P2P/UserCenter.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import { IUserDetails } from "types/p2p";
import { routes } from "constants/routing";
import { getPercentageOf } from "utils/p2p";
import ChangeUsernameModal from "components/Profile/Security/components/ChangeUsernameModal";
import { getDaysCountFrom } from "utils/formatDate";
import InternalLink from "components/InternalLink";
import LoadingSpinner from "components/UI/LoadingSpinner";
import useWindowSize from "hooks/useWindowSize";
import { ReactComponent as EditIcon } from "assets/icons/edit-icon.svg";
import { ReactComponent as Dots } from "assets/icons/dots-horizontal.svg";
import DropdownWithContent from "components/DropdownWithContent";
import { chunkArray } from "utils/getter";
import p2pMessages from "messages/p2p";

interface IStats {
	label: string;
	value: string;
}

interface IProps {
	profileInfo?: IUserDetails;
	nickname: string;
	isLoading: boolean;
	allTimeVolume: number;
	monthVolume: number;
}

const UserStats: React.FC<IProps> = ({
	profileInfo,
	nickname,
	isLoading,
	allTimeVolume,
	monthVolume,
}) => {
	const { formatMessage } = useIntl();
	const { medium } = useWindowSize();

	const [isModalOpened, toggleModal] = useState(false);

	const stats: IStats[] = profileInfo
		? [
				{
					label: formatMessage(p2pMessages.month_trades),
					value: `${profileInfo.trades_30d} ${formatMessage(p2pMessages.times)}`,
				},
				{
					label: formatMessage(p2pMessages.all_trades),
					value: `${profileInfo.all_trades} ${formatMessage(p2pMessages.times)}`,
				},
				{
					label: formatMessage(p2pMessages.avg_release_time),
					value: `${profileInfo.avg_release_time} min.`,
				},
				{
					label: formatMessage(p2pMessages.approx_30_day_volume),
					value: `${monthVolume.toFixed(2)} USDT`,
				},
				{
					label: formatMessage(p2pMessages.positive_feedback),
					value: `${profileInfo.positive_feedback_count} (${getPercentageOf(
						profileInfo.positive_feedback_count,
						profileInfo.positive_feedback_count + profileInfo.negative_feedback_count,
					)}%)`,
				},
				{
					label: formatMessage(p2pMessages.registered),
					value: `${getDaysCountFrom(profileInfo.registered_at)} ${formatMessage(
						getDaysCountFrom(profileInfo.registered_at) === 1 ? messages.day : messages.days,
					)}`,
				},
				{
					label: formatMessage(p2pMessages.first_trade),
					value: profileInfo.first_deal_at
						? `${getDaysCountFrom(profileInfo.first_deal_at)} ${formatMessage(
								getDaysCountFrom(profileInfo.first_deal_at) === 1 ? messages.day : messages.days,
						  )}`
						: formatMessage(p2pMessages.no_trades),
				},
				{
					label: formatMessage(p2pMessages.month_completion_rate),
					value: `${getPercentageOf(profileInfo.completed_trades_30d, profileInfo.trades_30d)} %`,
				},
				{
					label: formatMessage(p2pMessages.avg_pay_time),
					value: `${profileInfo.avg_payment_time} min.`,
				},
				{
					label: formatMessage(p2pMessages.approx_total_vol),
					value: `${allTimeVolume.toFixed(2)} USDT`,
				},
				{
					label: formatMessage(p2pMessages.positive_feedback),
					value: `${profileInfo.negative_feedback_count} (${getPercentageOf(
						profileInfo.negative_feedback_count,
						profileInfo.positive_feedback_count + profileInfo.negative_feedback_count,
					)}%)`,
				},
		  ]
		: [];

	const becomeMerchant = !profileInfo?.is_merchant ? (
		<InternalLink
			to={routes.p2p.merchant}
			className={cn(p2pStyles.button_link, styles.become_merchant_btn, medium && p2pStyles.full)}
		>
			{formatMessage(p2pMessages.become_merchant)}
		</InternalLink>
	) : null;

	return (
		<div className={styles.user_stats_container}>
			{isLoading ? (
				<LoadingSpinner noMargin />
			) : (
				<>
					<div className={styles.user_header}>
						<div className={styles.username}>
							<span title={nickname} className={styles.user_title}>
								{nickname}
							</span>
							<EditIcon className={styles.user_edit_icon} onClick={() => toggleModal(true)} />
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
						</div>
						{!medium && becomeMerchant}
						{medium && !profileInfo?.is_merchant && (
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
										{becomeMerchant}
									</div>
								)}
							</DropdownWithContent>
						)}
					</div>
					<div className={styles.user_stats_bar}>
						{!medium ? (
							stats.map(({ label, value }, i) => (
								<div key={i} className={styles.stats_card}>
									<div className={styles.header}>
										<span className={p2pStyles.smallcaps_label}>{label}</span>
									</div>
									<div title={value} className={styles.value}>
										{value}
									</div>
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
												<div title={value} className={styles.value}>
													{value}
												</div>
											</div>
										))}
									</div>
								))}
							</Slider>
						)}
					</div>
				</>
			)}
			<ChangeUsernameModal isOpen={isModalOpened} onClose={() => toggleModal(false)} />
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

import React, { useState } from "react";
import dayjs from "dayjs";
import { useIntl } from "react-intl";

import Button from "components/UI/Button";
import styles from "styles/pages/P2P/OrderDetails.module.scss";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";
import { IOrder, P2POrderStatusEnum, P2PSideEnum } from "types/p2p";
import LoadingSpinner from "components/UI/LoadingSpinner";
import useCopyClick from "hooks/useCopyClick";
import InternalLink from "components/InternalLink";
import buyCryptoMessages from "messages/buy_crypto";
import p2pMessages from "messages/p2p";
import messages from "messages/common";
import Timer from "./Timer";
import ReportModal from "../modals/ReportModal";

interface IProps {
	orderDetails?: IOrder;
	userSide: P2PSideEnum;
}

const Header: React.FC<IProps> = ({ orderDetails, userSide }) => {
	const { formatMessage } = useIntl();
	const localeNavigate = useLocaleNavigate();
	const copyClick = useCopyClick();
	const [isReportModalOpened, toggleReportModalOpened] = useState(false);

	const [baseCurrency] = orderDetails?.pair.symbol.split("_") || [];

	const handleBack = () => {
		localeNavigate(routes.p2p.orders);
	};

	const handleClickCopy = (): void => {
		if (orderDetails?.id) {
			copyClick(orderDetails.id);
		}
	};

	return !orderDetails ? (
		<LoadingSpinner />
	) : (
		<div className={styles.header_container}>
			<div className={styles.control_container}>
				<Button
					className={styles.back_btn}
					onClick={handleBack}
					variant="text"
					iconCode="chevron_left"
					label={formatMessage(messages.back_btn)}
				/>
				{/* <Button variant="text" iconCode="hint_outline_new" label="Help Center" /> */}
				<Button
					onClick={() => toggleReportModalOpened(true)}
					variant="text"
					color="secondary"
					iconCode="flag_filled-221"
					label={formatMessage(p2pMessages.report)}
				/>
			</div>
			<div className={styles.header_meta}>
				<div className={styles.header_info}>
					<span className={styles.title}>
						<strong>
							{userSide === P2PSideEnum.Sell
								? formatMessage(buyCryptoMessages.sell)
								: formatMessage(buyCryptoMessages.buy)}{" "}
							{baseCurrency}{" "}
						</strong>
						{userSide === P2PSideEnum.Sell ? (
							<>
								{formatMessage(messages.to)}{" "}
								<InternalLink to={routes.p2p.getUserDetails(orderDetails.buyer_profile.id)}>
									{orderDetails.buyer_profile.nickname}
								</InternalLink>
							</>
						) : (
							<>
								{formatMessage(messages.from)}{" "}
								<InternalLink to={routes.p2p.getUserDetails(orderDetails.seller_profile.id)}>
									{orderDetails.seller_profile.nickname}
								</InternalLink>
							</>
						)}
					</span>
					<span className={styles.separator} />
					<div className={styles.additional_info}>
						<span>
							{formatMessage(p2pMessages.creation_time)}:{" "}
							<strong>
								{orderDetails.created_at
									? dayjs.utc(dayjs(orderDetails.created_at)).format("DD-MM-YYYY HH:mm:ss")
									: "--"}
							</strong>
						</span>
						<span>
							{formatMessage(p2pMessages.order_number)}:{" "}
							<strong>
								{orderDetails.id}{" "}
								{/* eslint-disable-next-line jsx-a11y/control-has-associated-label,jsx-a11y/interactive-supports-focus */}
								<i role="button" onClick={handleClickCopy} className="ai ai-copy_new" />
							</strong>
							{/* eslint-disable-next-line jsx-a11y/control-has-associated-label,jsx-a11y/interactive-supports-focus */}
						</span>
					</div>
				</div>
				<Timer
					isActive={orderDetails.status === P2POrderStatusEnum.OPEN}
					active_till={orderDetails.active_till}
				/>
			</div>
			{isReportModalOpened && (
				<ReportModal
					nickname={
						userSide === P2PSideEnum.Sell
							? orderDetails.buyer_profile.nickname
							: orderDetails.seller_profile.nickname
					}
					orderId={orderDetails?.id}
					isOpen={isReportModalOpened}
					onClose={() => toggleReportModalOpened(false)}
				/>
			)}
		</div>
	);
};

export default Header;

import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import { useMst } from "models/Root";
import messages from "messages/welcome_bonus";
import useWindowSize from "hooks/useWindowSize";
import styles from "styles/pages/WelcomeBonus.module.scss";
import { routes } from "constants/routing";
import AwardModal from "./modals/AwardModal";
import InternalLink from "../InternalLink";

export const enum AwardCardTypeEnum {
	deposit = "verification_and_deposit",
	$5k = "trade5k",
	$10k = "trade10k",
	$30k = "trade30k",
	$50k = "trade50k",
}

export const enum ActionTypeEnum {
	deposit,
	trade,
}

interface IProps {
	isDone?: boolean;
	actionType: AwardCardTypeEnum;
}

const AwardCard: React.FC<IProps> = ({ isDone, actionType }) => {
	const { formatMessage } = useIntl();
	const {
		global: { isAuthenticated },
	} = useMst();

	const { mobile } = useWindowSize();

	const [isModalOpened, setIsModalOpened] = useState(false);

	const cardInformation = useMemo(() => {
		switch (actionType) {
			case AwardCardTypeEnum.deposit:
				return {
					awardAmount: 10,
					title: formatMessage(messages.deposit50$),
					type: ActionTypeEnum.deposit,
				};
			case AwardCardTypeEnum.$5k:
				return {
					awardAmount: 5,
					title: formatMessage(messages.tradingVolume5000$),
					type: ActionTypeEnum.trade,
				};
			case AwardCardTypeEnum.$10k:
				return {
					awardAmount: 10,
					title: formatMessage(messages.tradingVolume10000$),
					type: ActionTypeEnum.trade,
				};
			case AwardCardTypeEnum.$30k:
				return {
					awardAmount: 25,
					title: formatMessage(messages.tradingVolume30000$),
					type: ActionTypeEnum.trade,
				};
			case AwardCardTypeEnum.$50k:
				return {
					awardAmount: 40,
					title: formatMessage(messages.tradingVolume50000$),
					type: ActionTypeEnum.trade,
				};
			default:
				return {};
		}
	}, [actionType]);

	const buttonLabel = useMemo(
		() =>
			cardInformation.type === ActionTypeEnum.trade
				? formatMessage(messages.goTrading)
				: formatMessage(messages.deposit),
		[cardInformation],
	);

	const linkTo = useMemo(
		() =>
			cardInformation.type === ActionTypeEnum.trade
				? routes.trade.getPair("BTC_USD")
				: routes.profile.createDeposit,
		[isAuthenticated, cardInformation],
	);

	const toggleModal = () => {
		setIsModalOpened((prev) => !prev);
	};

	return (
		<div
			className={styles.card_wrapper}
			{...(mobile && !isDone && !isModalOpened ? { onClick: toggleModal } : {})}
		>
			{isDone ? <i className={cn(styles.card_checkmark, "ai ai-check_filled")} /> : null}
			{mobile && <i className={cn(styles.award_card_action_icon, "ai ai-chevron_right")} />}
			<AwardModal
				awardAmount={cardInformation.awardAmount}
				buttonLabel={buttonLabel}
				buttonRedirectUrl={linkTo}
				actionType={cardInformation.type}
				title={cardInformation.title}
				isOpen={isModalOpened}
				onClose={() => setIsModalOpened(false)}
			/>
			<div
				className={cn(styles.social_card_container, styles.card_container, {
					[styles.isDone]: isDone,
				})}
			>
				<div className={styles.card_task}>
					<span className={styles.card_bonus}>${cardInformation.awardAmount}</span>
					<div className={styles.card_task_meta}>
						<span className={styles.card_task_title}>{cardInformation.title}</span>
						<div className={styles.card_task_desc}>
							{cardInformation.type === ActionTypeEnum.trade ? (
								<span className={styles.award_description}>
									{formatMessage(messages.tradeToGetReward)}
								</span>
							) : (
								formatMessage(messages.verificationCTA, {
									verification: (
										<InternalLink to={routes.verification.root}>
											{formatMessage(messages.identityVerification)}
										</InternalLink>
									),
								})
							)}
						</div>
					</div>
				</div>
				<div className={styles.card_separator} />
				{mobile ? null : (
					<div className={styles.card_button_wrapper}>
						<InternalLink
							className={cn(styles.card_link_button, { [styles.isDone]: isDone })}
							aria-disabled={isDone}
							to={linkTo}
						>
							{cardInformation.type === ActionTypeEnum.deposit && (
								<i className="ai ai-balance_outline" />
							)}
							{buttonLabel}
							{cardInformation.type === ActionTypeEnum.trade && <i className="ai ai-arrow_right" />}
						</InternalLink>
					</div>
				)}
			</div>
		</div>
	);
};

export default observer(AwardCard);

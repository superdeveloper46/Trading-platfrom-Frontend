import React from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import messages from "messages/welcome_bonus";
import styles from "styles/pages/WelcomeBonus.module.scss";
import { useMst } from "models/Root";
import pageStyles from "styles/pages/Page.module.scss";
import Spinner from "components/UI/Spinner";
import BonusProgressBar from "./BonusProgressBar";
import RegistrationBlock from "./RegistrationBlock";
import AwardCardsSkeleton from "./AwardCardsSkeleton";
import AwardCard, { AwardCardTypeEnum } from "./AwardCard";
import SocialCard from "./SocialCard";

const Main: React.FC = () => {
	const { formatMessage } = useIntl();

	const {
		global: { isAuthenticated },
		promo: { status, isLoading },
	} = useMst();

	return (
		<div className={cn(pageStyles.header_content, styles.ny_header_content)}>
			<div className={styles.main_container}>
				{isAuthenticated ? (
					status ? (
						isLoading ? (
							<Spinner size={30} />
						) : (
							<BonusProgressBar
								controlPoints={[50, 100]}
								currentValue={Math.floor(+(status?.amount_unlocked || 0))}
								amountPaid={Math.floor(+(status?.amount_paid || 0))}
							/>
						)
					) : null
				) : (
					<RegistrationBlock />
				)}
				<span className={styles.title}>{formatMessage(messages.activitiesTitle)}</span>
				{isLoading ? (
					<AwardCardsSkeleton />
				) : (
					<>
						<AwardCard
							actionType={AwardCardTypeEnum.deposit}
							isDone={status?.action_verification_and_deposit}
						/>
						<AwardCard actionType={AwardCardTypeEnum.$5k} isDone={status?.action_trade5k} />
						<SocialCard isDone={status?.action_social_activity} />
						<AwardCard actionType={AwardCardTypeEnum.$10k} isDone={status?.action_trade10k} />
						<AwardCard actionType={AwardCardTypeEnum.$30k} isDone={status?.action_trade30k} />
						<AwardCard actionType={AwardCardTypeEnum.$50k} isDone={status?.action_trade50k} />
					</>
				)}
			</div>
		</div>
	);
};

export default observer(Main);

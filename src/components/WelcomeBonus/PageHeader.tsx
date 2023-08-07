import React, { useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import headerMask from "assets/images/promo/header-lines.png";
import promoCoin from "assets/images/promo/promo-coin.png";
import messages from "messages/welcome_bonus";
import { useMst } from "models/Root";
import styleProps from "utils/styleProps";
import useWindowSize from "hooks/useWindowSize";
import styles from "styles/pages/WelcomeBonus.module.scss";
import pageStyles from "styles/pages/Page.module.scss";
import SkeletonLoader from "components/UI/Skeleton";
import Timer from "./Timer";
import BonusRulesModal from "./modals/BonusRulesModal";

const PageHeader: React.FC = () => {
	const { formatMessage } = useIntl();
	const { mobile } = useWindowSize();

	const [isModalOpened, setIsModalOpened] = useState(false);

	const openModal = () => {
		setIsModalOpened(true);
	};

	const {
		global: { isAuthenticated },
		promo: { isLoading },
	} = useMst();

	return (
		<div
			className={cn(pageStyles.header_container, styles.ny_header_container)}
			style={styleProps({ ...(!mobile ? { backgroundImage: `url(${headerMask})` } : {}) })}
		>
			<BonusRulesModal isOpen={isModalOpened} onClose={() => setIsModalOpened(false)} />
			<div className={cn(pageStyles.header_content, styles.ny_header_content)}>
				<div className={cn(pageStyles.header_focus_container, styles.ny_header_focus_container)}>
					<div className={styles.header_info}>
						<div className={styles.title_container}>
							<h1 className={cn(pageStyles.title, styles.ny_header_title)}>
								{formatMessage(messages.getForWelcomeBonus, {
									award: <span>$100</span>,
								})}
							</h1>
						</div>
						<h2
							className={styles.ny_header_subtitle}
							style={styleProps({ marginBottom: mobile ? "15px" : "50px" })}
						>
							{formatMessage(messages.eventHeaderDescription)}
						</h2>
						{mobile ? (
							// eslint-disable-next-line jsx-a11y/interactive-supports-focus
							<div className={styles.rules_mobile_button} role="button" onClick={openModal}>
								<i className="ai ai-error_circle" />
								Ознакомиться с правилами конкурса
							</div>
						) : (
							<h2>
								{formatMessage(
									isAuthenticated ? messages.timeLeft : messages.timeLeftToRegistration,
								)}
							</h2>
						)}
						{mobile && (
							<div
								className={styles.header_gift_icon}
								style={styleProps({ backgroundImage: `url(${promoCoin})` })}
							/>
						)}
						{isLoading ? (
							<SkeletonLoader height={mobile ? 60 : 80} width={mobile ? 300 : 420} />
						) : (
							<Timer />
						)}
					</div>
					{!mobile && (
						<div
							className={styles.header_gift_icon}
							style={styleProps({ backgroundImage: `url(${promoCoin})` })}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default observer(PageHeader);

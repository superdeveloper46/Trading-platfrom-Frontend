import React, { ChangeEvent, useState } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import commonMessages from "messages/common";
import bonusMessages from "messages/welcome_bonus";
import { ActionGroup, SuccessScreen } from "components/UI/Modal";
import { useMst } from "models/Root";
import pageStyles from "styles/pages/Page.module.scss";
import styles from "styles/pages/WelcomeBonus.module.scss";
import Input from "components/UI/Input";
import Button from "components/UI/Button";
import PromoService from "services/PromoService";
import errorHandler from "utils/errorHandler";
import { routes } from "constants/routing";
import InternalLink from "components/InternalLink";

export interface ISubmitSocialActivityBody {
	publication_link: string;
	telegram_username: string;
	accept_data_processing: boolean;
}

interface IFormBody {
	link: string;
	nickname: string;
}

const WelcomeBonusAwardForm: React.FC = () => {
	const { formatMessage } = useIntl();

	const {
		global: { locale, isAuthenticated },
	} = useMst();

	const [formBody, setFormBody] = useState<IFormBody>({
		link: "https://",
		nickname: "",
	});
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
	const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

	const isSubmitDisabled = !(formBody.link && formBody.nickname);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target;
		if (name === "link") {
			setFormBody((prevState) => ({
				...prevState,
				link: value.startsWith("https://") ? value : `https://${value}`,
			}));
		} else {
			setFormBody((prevState) => ({
				...prevState,
				[name]: value,
			}));
		}
	};

	const handleInputKeyDown = (e: React.KeyboardEvent): void => {
		if (e.key === "Enter" && !isSubmitDisabled) {
			handleSubmit();
		}
	};

	const handleSubmit = () => {
		const body = {
			publication_link: formBody.link,
			telegram_username: formBody.nickname,
			accept_data_processing: true,
		};
		setIsSubmitLoading(true);
		PromoService.submitSocialActivity(body)
			.then(() => {
				setIsSuccessful(true);
			})
			.catch(errorHandler)
			.finally(() => setIsSubmitLoading(false));
	};

	return (
		<>
			<div
				className={cn(styles.bonus_award_container, pageStyles.card, pageStyles.hasMobileBorder)}
			>
				{isSuccessful ? (
					<SuccessScreen>
						{formatMessage(bonusMessages.your_response_has_been_sent_for_moderation)}
					</SuccessScreen>
				) : (
					<>
						<div className={styles.bonus_award_content}>
							<span className={pageStyles.card_title}>
								{formatMessage(bonusMessages.i_have_already_shared_the_link)}
							</span>
							<div className={styles.bonus_award_rules_container}>
								<span>
									{formatMessage(bonusMessages.conditions_for_receiving_a__bonus, {
										value: "100 USD",
									})}
								</span>
								<ul className="browser-default">
									<li>
										{formatMessage(
											bonusMessages.share_the_link_of_the_promotion_in_social_networks,
										)}
									</li>
									<li>
										<Link to="/app/download" target="_blank" rel="noopener noreferrer">
											{formatMessage(bonusMessages.downloadAppCTA)}
										</Link>
									</li>
									<li>
										<a
											href={locale === "ru" ? "https://t.me/btcalpha_ru" : "https://t.me/btcalpha"}
											target="_blank"
											rel="noopener noreferrer"
										>
											{formatMessage(bonusMessages.be_a_member_of_the_telegram_chat)}
										</a>
									</li>
								</ul>
							</div>
						</div>
						<div className={styles.bonus_award_content}>
							<div className={styles.already_shared_container}>
								{isAuthenticated ? (
									<div className={styles.award_bonus_form_container}>
										<div className={styles.award_form_input_group}>
											<span>{formatMessage(bonusMessages.the_link_to_the_post)}</span>
											<Input
												type="text"
												name="link"
												labelValue={formatMessage(bonusMessages.link)}
												value={formBody.link}
												onChange={handleInputChange}
												onKeyDown={handleInputKeyDown}
											/>
										</div>
										<div className={styles.award_form_input_group}>
											<span>{formatMessage(bonusMessages.you_telegram_id)}</span>
											<Input
												type="text"
												name="nickname"
												value={formBody.nickname}
												labelValue={formatMessage(bonusMessages.nickname)}
												onChange={handleInputChange}
												onKeyDown={handleInputKeyDown}
											/>
										</div>
										<ActionGroup>
											<Button
												variant="filled"
												color="primary"
												label={formatMessage(commonMessages.send)}
												isLoading={isSubmitLoading}
												disabled={isSubmitDisabled}
												onClick={handleSubmit}
												fullWidth
											/>
											<InternalLink to={routes.welcomeBonus.root}>
												<Button
													variant="outlined"
													color="primary"
													label={formatMessage(commonMessages.back_btn)}
													fullWidth
												/>
											</InternalLink>
										</ActionGroup>
									</div>
								) : (
									<InternalLink to={routes.login.root}>
										{formatMessage(bonusMessages.please_login_to_continue)}
									</InternalLink>
								)}
							</div>
						</div>
					</>
				)}
			</div>
			{isAuthenticated && (
				<div className={styles.award_form_note}>
					<i className="ai ai-warning" />
					{formatMessage(bonusMessages.i_authorize_btc_alpha_to_use_my_personal_data)}
				</div>
			)}
		</>
	);
};

export default observer(WelcomeBonusAwardForm);

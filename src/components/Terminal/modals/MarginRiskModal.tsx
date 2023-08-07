import React, { useState } from "react";
import { useIntl } from "react-intl";

import commonMessages from "messages/common";
import accountMessages from "messages/account";
import exchangeMessages from "messages/exchange";
import alpImg from "assets/images/trade/margin-risk-alp.svg";
import verificationImg from "assets/images/trade/margin-risk-verification.svg";
import Button from "components/UI/Button";
import Modal, { ActionGroup, Content, Description, Footer, Image } from "components/UI/Modal";
import errorHandler from "utils/errorHandler";
import ExchangeService from "services/ExchangeService";
import InternalLink from "components/InternalLink";
import { VERIFICATION_LEVELS } from "constants/exchange";
import CheckBox from "components/UI/CheckBox";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";

interface IProps {
	onClose: () => void;
	onCloseAccepted: () => void;
	requiredVerificationLevel: number;
}

const CancelAllOrdersModal: React.FC<IProps> = ({
	onClose,
	onCloseAccepted,
	requiredVerificationLevel,
}) => {
	const [isRulesAccepted, setIsRulesAccepted] = useState<boolean>(false);

	const localeNavigate = useLocaleNavigate();
	const { formatMessage } = useIntl();

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setIsRulesAccepted(e.target.checked);
	};

	const handleSubmit = async (): Promise<void> => {
		if (requiredVerificationLevel) {
			onClose();
			localeNavigate(
				routes.verification.getVerificationType(VERIFICATION_LEVELS[requiredVerificationLevel]),
			);
		} else if (isRulesAccepted) {
			try {
				await ExchangeService.acceptMarginTerms();
				onCloseAccepted();
			} catch (err) {
				errorHandler(err);
			}
		}
	};

	return (
		<Modal
			isOpen
			iconCode="info_outlined"
			label={formatMessage(exchangeMessages.margin_risks_important)}
			onClose={onClose}
		>
			<Content centered>
				<Description>
					{formatMessage(exchangeMessages.margin_risks_label)}
					<InternalLink to={routes.marginTradingFaq} blank>
						{formatMessage(accountMessages.margin_trading)}&nbsp;FAQ
					</InternalLink>
					{requiredVerificationLevel > 0 &&
						formatMessage(exchangeMessages.margin_risks_verification, {
							verification_label: formatMessage(exchangeMessages.margin_risks_verification_level, {
								level: requiredVerificationLevel,
							}),
						})}
				</Description>
				<Image>
					{requiredVerificationLevel ? (
						<img src={verificationImg} width="256" height="160" alt="Verification Required" />
					) : (
						<img src={alpImg} width="192" height="163" alt="Margin Risk" />
					)}
				</Image>
				{!requiredVerificationLevel && (
					<CheckBox
						name="margin-risk-rules"
						checked={isRulesAccepted}
						onChange={handleCheckboxChange}
					>
						{formatMessage(exchangeMessages.margin_risks_terms_confirmation, {
							terms_of_agreement_policy: (
								<InternalLink to={routes.termsOfUse} blank>
									{formatMessage(exchangeMessages.margin_risks_terms_of_agreement_policy)}.
								</InternalLink>
							),
						})}
					</CheckBox>
				)}
			</Content>
			<Footer>
				<ActionGroup>
					<Button
						fullWidth
						variant="filled"
						color="primary"
						onClick={handleSubmit}
						label={
							requiredVerificationLevel
								? formatMessage(exchangeMessages.margin_risks_pass_verification, {
										level: requiredVerificationLevel,
								  })
								: formatMessage(commonMessages.submit)
						}
						disabled={!isRulesAccepted}
					/>
					<Button
						fullWidth
						variant="outlined"
						color="primary"
						onClick={onClose}
						label={formatMessage(commonMessages.back_btn)}
					/>
				</ActionGroup>
			</Footer>
		</Modal>
	);
};

export default CancelAllOrdersModal;

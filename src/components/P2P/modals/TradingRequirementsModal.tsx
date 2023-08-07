import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import commonMessages from "messages/common";
import Modal, { ActionGroup, Content, ContentForm, Description, Footer } from "components/UI/Modal";
import ChangeUsernameModal from "components/Profile/Security/components/ChangeUsernameModal";
import Button from "components/UI/Button";
import styles from "styles/pages/P2P/Modals.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import CheckBox from "components/UI/CheckBox";
import InternalLink from "components/InternalLink";
import P2PService from "services/P2PService";
import errorHandler from "utils/errorHandler";
import { queryVars } from "constants/query";
import { routes } from "constants/routing";
import { useMst } from "models/Root";
import p2pMessages from "messages/p2p";

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	disableClose?: boolean;
}

const TradingRequirementsModal: React.FC<IProps> = ({ onClose, isOpen, disableClose }) => {
	const { formatMessage } = useIntl();
	const {
		account: { profileStatus, loadProfileStatus },
		global: { locale },
	} = useMst();

	const navigate = useNavigate();

	const [isNicknameModalOpened, toggleNicknameModal] = useState(false);
	const [isAccepted, toggleAccepted] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSubmit = async () => {
		setIsLoading(true);
		P2PService.acceptTerms({ [queryVars.accept]: isAccepted })
			.then(() => {
				onClose();
				loadProfileStatus();
				toast.success(formatMessage(p2pMessages.terms_accepted));
			})
			.catch(errorHandler)
			.finally(() => setIsLoading(false));
	};

	const handleCheckboxToggle = () => {
		toggleAccepted((prev) => !prev);
	};

	const handleOpenNicknameModal = (e: React.SyntheticEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault();
		e.stopPropagation();
		toggleNicknameModal(true);
	};

	const requirements = [
		{
			label: formatMessage(p2pMessages.verification_lvl1),
			isReady: (profileStatus?.verification_level || 0) > 0,
			actionLabel: formatMessage(p2pMessages.pass_1lvl),
			link: routes.verification.identity,
		},
		{
			label: formatMessage(p2pMessages.two_factor_auth),
			isReady: profileStatus?.two_factor_enabled,
			actionLabel: formatMessage(p2pMessages.enable_2fa),
			link: routes.security.authenticator,
		},
		{
			label: formatMessage(p2pMessages.create_nickname),
			isReady: Boolean(profileStatus?.username),
			actionLabel: formatMessage(p2pMessages.create_nickname),
			onClick: (e: React.SyntheticEvent<HTMLDivElement, MouseEvent>) => handleOpenNicknameModal(e),
		},
	];

	const isRequirementsPassed = requirements.every(({ isReady }) => isReady);

	const isValid = isRequirementsPassed && isAccepted;

	const handleClose = () => {
		if (!disableClose) {
			return onClose();
		}
		return navigate(`${locale}${routes.p2p.main}`);
	};

	useEffect(
		() => () => {
			onClose();
		},
		[],
	);

	return (
		<Modal
			className={styles.p2p_modal_container}
			isOpen={isOpen}
			onClose={handleClose}
			label={formatMessage(p2pMessages.trading_requirements)}
		>
			<>
				<Content>
					<Description noMargin>
						<span>{formatMessage(p2pMessages.ensure_safety)}</span>
					</Description>
				</Content>
				<ContentForm>
					{requirements.map(({ isReady, actionLabel, label, link, onClick }, i) => (
						<div key={i} className={styles.requirement_item}>
							{label}
							{isReady ? (
								<div className={p2pStyles.ready_badge}>
									{formatMessage(commonMessages.ready)} <i className="ai ai-check_outlined" />
								</div>
							) : (
								<InternalLink onClick={onClick} className={styles.button_link} to={link}>
									{actionLabel}
								</InternalLink>
							)}
						</div>
					))}
					{isRequirementsPassed && (
						<CheckBox name="terms" onChange={handleCheckboxToggle} checked={isAccepted}>
							<div className={styles.terms_checkbox_content}>
								{formatMessage(p2pMessages.agree_with_reqs, {
									value: formatMessage(p2pMessages.p2p_alp_terms),
								})}
							</div>
						</CheckBox>
					)}
				</ContentForm>
				<Footer>
					<ActionGroup>
						<Button
							variant="filled"
							color="primary"
							onClick={handleSubmit}
							isLoading={isLoading}
							disabled={!isValid}
							fullWidth
							label={formatMessage(p2pMessages.lets_trade)}
						/>
						<Button
							variant="outlined"
							color="primary"
							onClick={handleClose}
							disabled={isLoading}
							fullWidth
							label={formatMessage(commonMessages.cancel)}
						/>
					</ActionGroup>
				</Footer>
			</>
			<ChangeUsernameModal
				isOpen={isNicknameModalOpened}
				onClose={() => toggleNicknameModal(false)}
			/>
		</Modal>
	);
};

export default TradingRequirementsModal;

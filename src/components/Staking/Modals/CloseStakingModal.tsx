import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import stakingMessages from "messages/staking";
import commonMessages from "messages/common";
import cn from "classnames";
import { IPosition, IPromo } from "types/staking";
import Modal, { ActionGroup, Footer, SuccessScreen } from "components/UI/Modal";
import stylesModal from "styles/components/UI/Modal.module.scss";
import InfoSnack from "components/InfoSnack";
import styles from "styles/pages/Staking.module.scss";
import styleProps from "utils/styleProps";
import Button from "components/UI/Button";
import { toast } from "react-toastify";
import { IBalance } from "models/Account";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<any>;
	onConfirmEarly: () => Promise<any>;
	currency: IBalance;
	promo?: IPromo;
	position: IPosition;
	refetchPositions: () => void;
}

const CloseStakingModal: React.FC<Props> = React.memo(
	({ promo, onConfirm, onConfirmEarly, currency, onClose, isOpen, position, refetchPositions }) => {
		const { formatMessage } = useIntl();
		const [isCloseLoading, setIsCloseLoading] = useState<boolean>(false);
		const [success, setSuccess] = useState<boolean>(false);

		const handleClose = () => {
			setIsCloseLoading(true);
			if (!position.plan.is_redemption_instant) {
				onConfirmEarly()
					.then(() => {
						setSuccess(true);
						refetchPositions();
					})
					.catch((err) => toast.error(err.message))
					.finally(() => setIsCloseLoading(false));
			} else {
				onConfirm()
					.then(() => {
						setSuccess(true);
						refetchPositions();
					})
					.catch((err) => toast.error(err.message))
					.finally(() => setIsCloseLoading(false));
			}
		};

		useEffect(() => {
			setSuccess(false);
		}, [isOpen]);

		return (
			<Modal
				iconCode="warning"
				iconClassName={styles.close_staking_modal_icon}
				label={
					<div className={stylesModal.title}>{formatMessage(stakingMessages.close_staking)}</div>
				}
				isOpen={isOpen}
				onClose={onClose}
			>
				{promo ? (
					<InfoSnack color="yellow" align="flex-start">
						<div className={styles.promo_sign} style={styleProps({ marginRight: "10px" })}>
							P
						</div>
						<span>
							{formatMessage(stakingMessages.close_staking_with_promo_code_warning, {
								promo_code: promo.label,
							})}
						</span>
					</InfoSnack>
				) : null}
				{success ? (
					<div className={cn(stylesModal.content)}>
						<SuccessScreen>
							<span>{formatMessage(stakingMessages.position_closed)}</span>
						</SuccessScreen>
					</div>
				) : (
					<>
						<div className={cn(stylesModal.content)}>
							<div className={stylesModal.currency_icon}>
								<i className={`ai ai-${currency?.code?.toLowerCase()}`} />
							</div>
							<div className={stylesModal.info_container}>
								<div className={stylesModal.description}>
									{formatMessage(stakingMessages.close_staking)}&nbsp;
									{currency?.name}?
								</div>
							</div>
						</div>
						<Footer>
							<ActionGroup>
								<Button
									color="primary"
									fullWidth
									onClick={handleClose}
									isLoading={isCloseLoading}
									label={formatMessage(promo ? commonMessages.close_anyway : commonMessages.yes)}
								/>
								<Button
									label={formatMessage(commonMessages.no)}
									variant="outlined"
									fullWidth
									onClick={() => onClose()}
								/>
							</ActionGroup>
						</Footer>
					</>
				)}
			</Modal>
		);
	},
);

export default CloseStakingModal;

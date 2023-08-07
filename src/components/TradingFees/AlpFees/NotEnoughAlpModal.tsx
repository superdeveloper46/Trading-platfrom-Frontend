import { useIntl } from "react-intl";
import React from "react";

import stylesModal from "styles/components/UI/Modal.module.scss";
import Modal, { ActionGroup } from "components/UI/Modal";
import feesTradingMessages from "messages/fees_trading";
import alpCoinMessages from "messages/alp_coin";
import commonMessages from "messages/common";
import Button from "components/UI/Button";
import InternalLink from "components/InternalLink";
import InfoSnack from "components/InfoSnack";
import { routes } from "constants/routing";

interface IProps {
	minimumAmount: number;
	isOpen: boolean;
	onClose(): void;
}

const NotEnoughAlpModal: React.FC<IProps> = ({ isOpen, onClose, minimumAmount }) => {
	const { formatMessage } = useIntl();
	return (
		<Modal
			iconCode="warning"
			label={formatMessage(feesTradingMessages.not_enough_alp)}
			onClose={onClose}
			isOpen={isOpen}
		>
			<div className={stylesModal.content}>
				<div className={stylesModal.description}>
					{formatMessage(feesTradingMessages.top_up_your_alp_balance_first)}
				</div>
				<InfoSnack color="yellow" iconCode="error_circle" justify="center">
					<span>{formatMessage(feesTradingMessages.minimum_vip_level)}</span>
					:&nbsp;
					<b>{minimumAmount} ALP</b>
				</InfoSnack>
			</div>
			<div className={stylesModal.footer}>
				<ActionGroup>
					<InternalLink to={routes.trade.getPair("ALP_USDT")}>
						<Button
							fullWidth
							variant="filled"
							color="quaternary"
							label={formatMessage(alpCoinMessages.buy_btn)}
						/>
					</InternalLink>
					<Button
						fullWidth
						variant="outlined"
						color="primary"
						label={formatMessage(commonMessages.back_btn)}
						onClick={onClose}
					/>
				</ActionGroup>
			</div>
		</Modal>
	);
};

export default NotEnoughAlpModal;

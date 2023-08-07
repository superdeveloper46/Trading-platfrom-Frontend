import React from "react";
import { useIntl } from "react-intl";
import { unix } from "dayjs";

import messages from "messages/history";
import cancelImg from "assets/images/withdraws/Canceling_order.svg";
import common_messages from "messages/common";
import stylesModal from "styles/components/UI/Modal.module.scss";
import Button from "components/UI/Button";
import Modal from "components/UI/Modal";
import { IPair } from "models/Terminal";
import { IWithdraw } from "models/Withdrawal";

interface Props {
	isOpen: boolean;
	withdraw?: IWithdraw;
	onClose: () => void;
	onConfirm: () => void;
	pair?: IPair;
}

const CancelWithdrawModal: React.FC<Props> = ({ isOpen, withdraw, onClose, onConfirm, pair }) => {
	const { formatMessage, formatNumber } = useIntl();

	return (
		<Modal
			isOpen={isOpen}
			// iconCode="referral"
			label={formatMessage(messages.withdraws_table_confirm_cancel)}
			onClose={onClose}
		>
			{withdraw ? (
				<div className={stylesModal.content2}>
					<div className={stylesModal.modal_img}>
						<img src={cancelImg} alt="cancel withdraw" />
					</div>
					<div className={stylesModal.form_body_left_aligned}>
						<div className={stylesModal.form_attribute}>
							<span style={{ color: "var(--color-secondary)" }}>
								{formatMessage(messages.orders_table_date)}
							</span>
							&nbsp;
							<span style={{ fontWeight: "bold" }}>
								{unix(+withdraw.date).format("YYYY-MM-DD HH:mm:ss")}
							</span>
						</div>
						<div className={stylesModal.form_attribute}>
							<span style={{ color: "var(--color-secondary)" }}>
								{formatMessage(messages.orders_table_amount)}
							</span>
							&nbsp;
							<span style={{ fontWeight: "bold" }}>
								{formatNumber(+withdraw.amount, {
									useGrouping: false,
									minimumFractionDigits: (pair && pair.amount_precision) || 6,
								})}
							</span>
						</div>
						<div className={stylesModal.form_attribute}>
							<span style={{ color: "var(--color-secondary)" }}>
								{formatMessage(messages.orders_table_amount)}
							</span>
							&nbsp;
							<span style={{ fontWeight: "bold" }}>{withdraw.currency_id}</span>
						</div>
					</div>
					<div className={stylesModal.btn_group}>
						<Button onClick={onClose} color="primary" label={formatMessage(common_messages.no)} />
						<Button
							onClick={onConfirm}
							variant="text"
							label={formatMessage(common_messages.confirm)}
						/>
					</div>
				</div>
			) : null}
		</Modal>
	);
};

export default CancelWithdrawModal;

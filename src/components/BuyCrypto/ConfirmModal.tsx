import React from "react";
import { useIntl } from "react-intl";
import cn from "classnames";

import buttonStyles from "styles/components/UI/Button.module.scss";
import buyCryptoMessages from "messages/buy_crypto";
import commonMessages from "messages/common";
import styles from "styles/components/UI/Modal.module.scss";
import { ICurrency } from "models/BuyCrypto";
import InternalLink from "components/InternalLink";
import Button from "components/UI/Button";
import Modal from "components/UI/Modal";
import { routes } from "constants/routing";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	amount: number;
	currency: ICurrency;
	siteDomain: string | null;
}

const ConfirmModal: React.FC<Props> = React.memo(
	({ isOpen, onClose, onConfirm, currency, amount, siteDomain }) => {
		const { formatMessage, formatNumber } = useIntl();

		const handleConfirm = () => {
			onConfirm();
		};

		return (
			<Modal
				iconCode="info_circle_outline"
				label={formatMessage(commonMessages.buy_crypto)}
				onClose={onClose}
				isOpen={isOpen}
			>
				<div className={cn(styles.content, styles.centered)}>
					<div className={styles.currency_icon}>
						<i className={`ai ai-${currency.code.toLowerCase()}`} />
					</div>
					<div className={cn(styles.body1, styles.color_primary, styles.center)}>
						{formatNumber(amount, {
							useGrouping: false,
							maximumFractionDigits: 8,
						})}
						&nbsp;
						{currency.code.toUpperCase()}
					</div>
					{siteDomain && (
						<div className={styles.description}>
							<span>
								{formatMessage(buyCryptoMessages.modal_warning, {
									partner: (
										<span>
											<a href={`https://${siteDomain}`} target="_blank" rel="noopener noreferrer">
												{siteDomain}
											</a>
										</span>
									),
								})}
							</span>
						</div>
					)}
				</div>
				<div className={styles.footer}>
					<div className={buttonStyles.buttons_group}>
						<Button
							variant="filled"
							fullWidth
							color="primary"
							onClick={handleConfirm}
							label={formatMessage(commonMessages.continue)}
						/>
					</div>
				</div>
				<div className={styles.footnote}>
					<i className="ai ai-warning" />
					<span>
						{formatMessage(commonMessages.terms_of_use_agree, {
							terms_of_use: (
								<InternalLink to={routes.termsOfUse} blank>
									{formatMessage(commonMessages.terms_of_use_context)}&nbsp;
								</InternalLink>
							),
							privacy_policy: (
								<InternalLink to={routes.privacyPolicy} blank>
									{formatMessage(commonMessages.privacy_policy_context)}
								</InternalLink>
							),
						})}
					</span>
				</div>
			</Modal>
		);
	},
);

export default ConfirmModal;

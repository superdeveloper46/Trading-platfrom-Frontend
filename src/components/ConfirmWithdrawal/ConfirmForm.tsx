import React, { useState } from "react";
import { useIntl } from "react-intl";
import styles from "styles/components/ConfirmationComponents.module.scss";
import financeMessages from "messages/finance";
import commonMessages from "messages/common";
import SecureToken from "components/SecureToken";
import { useParams } from "react-router-dom";
import { CancelModal } from "components/Withdrawal/modals";
import { IAttributesLabel, IConfirmWithdrawalInfo } from "models/ConfirmWithdrawal";
import Button from "components/UI/Button";
import { SecureTokenTypeEnum, SecureTokenVariantEnum } from "types/secureToken";

interface Props {
	info: IConfirmWithdrawalInfo | null;
	tokenType?: SecureTokenTypeEnum;
	onSuccess: (res: any) => void;
	onCancel: () => void;
}

const ConfirmForm: React.FC<Props> = ({ info, tokenType, onSuccess, onCancel }) => {
	const { slug: slugDefault } = useParams<{ slug: string }>();
	const { formatMessage, formatNumber } = useIntl();
	const [slug, setSlug] = useState<string>(slugDefault ?? "");
	const [modalData, setModalData] = useState<{
		amount: string;
		currencyCode: string;
		slug: string;
	} | null>(null);

	const handleTokenChange = (nextSlug: string) => {
		setSlug(nextSlug);
	};

	const handleCloseCancelModal = () => {
		setModalData(null);
	};

	const handleConfirmCancelModal = () => {
		setModalData(null);
		onCancel();
	};

	const handleOpenCancelModal = () => {
		setModalData({
			amount: info?.amount ?? "",
			currencyCode: info?.currency?.code ?? "",
			slug: "",
		});
	};

	return info ? (
		<div className={styles.form_container}>
			{modalData && (
				<CancelModal
					isOpen={!!modalData}
					onClose={handleCloseCancelModal}
					onConfirm={handleConfirmCancelModal}
					data={modalData}
				/>
			)}
			{info?.currency?.code ? (
				<div className={styles.mobile_currency_icon}>
					<i className={`ai ai-${info.currency.code.toLowerCase()}`} />
				</div>
			) : null}
			<div className={styles.header}>
				<h2 className={styles.title}>{formatMessage(financeMessages.withdraw_confirming)}</h2>
				<span className={styles.subtitle}>
					{formatMessage(financeMessages.check_operation_details)}
				</span>
			</div>
			<div className={styles.info_container}>
				<div className={styles.info_inner}>
					<span className={styles.info_group_item}>{formatMessage(commonMessages.amount)}</span>
					<span className={styles.info_group_item}>
						<span className={styles.amount}>
							{formatNumber(parseFloat(info.amount), {
								useGrouping: false,
								maximumFractionDigits: 8,
							})}
						</span>
						&nbsp;{info.currency?.code}
					</span>
					<span className={styles.info_group_item}>
						{formatMessage(financeMessages.withdrawal_method)}
					</span>
					<span className={styles.info_group_item}>{info.payment_method_name}</span>
					{info.attributes_labeled.map((attr: IAttributesLabel, i: number) => (
						<React.Fragment key={attr.value}>
							<span className={styles.info_group_item} key={2 * i}>
								{attr.label}
							</span>
							<span className={styles.info_group_item} key={2 * i + 1}>
								{attr.value}
							</span>
						</React.Fragment>
					))}
					<span className={styles.info_group_item}>
						{formatMessage(financeMessages.withdraw_confirming_fee_amount)}
					</span>
					<span className={styles.info_group_item}>
						{formatNumber(parseFloat(info.fee_amount), {
							useGrouping: false,
							maximumFractionDigits: 8,
						})}
						&nbsp;{info.currency?.code}
					</span>
				</div>
			</div>
			<div className={styles.actions_container}>
				<SecureToken
					requestUrl={`web/withdraw/create/${slug}/confirm`}
					resendRequestUrl={`web/withdraw/create/${slug}/resend`}
					onSlugChange={handleTokenChange}
					shouldAutoFocus
					type={tokenType}
					pincodeTriesleft={info.pincode_tries_left}
					delay={info.pincode_timeout || info.totp_timeout || ""}
					onSuccess={onSuccess}
					variant={SecureTokenVariantEnum.BUTTON}
					buttonLabel={formatMessage(commonMessages.send)}
				/>
				<Button
					fullWidth
					color="primary"
					variant="text"
					onClick={handleOpenCancelModal}
					label={formatMessage(commonMessages.cancel)}
				/>
			</div>
		</div>
	) : null;
};

export default ConfirmForm;

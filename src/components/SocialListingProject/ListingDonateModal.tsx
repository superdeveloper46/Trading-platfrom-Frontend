import React, { useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import messages from "messages/listing";
import common_messages from "messages/common";
import finance_messages from "messages/finance";
import exchange_messages from "messages/exchange";
import form_messages from "messages/form";
import Modal, { ActionGroup, Content } from "components/UI/Modal";
import styles from "styles/pages/SocialListingProject.module.scss";
import stylesModal from "styles/components/UI/Modal.module.scss";
import Button from "components/UI/Button";
import QrCode from "qrcode.react";
import DonateImg from "assets/images/listing/donate_done.svg";
import { useMst } from "models/Root";
import { IListingProject, IPaymentChannel } from "types/listing";
import InternalLink from "components/InternalLink";
import Input, { Appender } from "components/UI/Input";
import SocialListingService from "services/SocialListingService";
import Tooltip from "components/UI/Tooltip";
import { routes, URL_VARS } from "constants/routing";
import useCopyClick from "hooks/useCopyClick";
import ShareContainer from "../ShareContainer";

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	project: IListingProject;
	paymentChannels: IPaymentChannel[];
}

const ListingDonateModal: React.FC<IProps> = ({ isOpen, onClose, project, paymentChannels }) => {
	const {
		global: { isAuthenticated, locale },
		account: { balances },
	} = useMst();
	const { formatMessage, formatNumber } = useIntl();
	const copyClick = useCopyClick();

	const [operationStatus, setOperationStatus] = useState(0);
	const [amount, setAmount] = useState("");
	const copyAttr = useRef(null);
	const [amountError, setAmountError] = useState("");
	const [currentMethod, setCurrentMethod] = useState("btc");
	const alcMethod = paymentChannels && paymentChannels.find((m) => m.currency === "ALC");
	const btcMethod = paymentChannels && paymentChannels.find((m) => m.currency === "BTC");

	const isFormValid = useMemo(() => Boolean(amount), [amount]);

	const handleClickCopyMethod = () => {
		copyClick(btcMethod?.attributes.address || "");
	};
	const handleClickMethod = (name: string) => {
		setAmount("");
		return setCurrentMethod(name);
	};
	const handleOnChange = (e: any) => {
		setAmount(e.target.value.trim());
		setAmountError("");
	};
	const handleDonate = (currency: string) => {
		const body = {
			currency,
			amount,
		};

		if (isFormValid) {
			SocialListingService.sendDonate(project.slug, body)
				.then(() => setOperationStatus(1))
				.catch((err) => {
					setAmountError(err.message);
				});
		} else {
			setAmountError(formatMessage(form_messages.required));
		}
	};

	const handleBalanceClick = (balance: number) => setAmount(balance.toFixed(8));

	const getBalanceForCurrency = (currency: string): number => {
		const balance = balances.find((b) => b.code === currency);

		if (balance) return balance.available;

		return 0;
	};

	useEffect(() => {
		setOperationStatus(0);
		setAmount("");
		setAmountError("");
		setCurrentMethod("btc");
	}, [isOpen]);

	const donateMethods = [
		...(alcMethod
			? [
					{
						name: "alc",
						helpTooltip: (
							<div className={styles.help_container}>
								<Tooltip
									id="alc_help"
									hint
									data-name="alc_help"
									delayHide={150}
									place="bottom"
									clickable
								>
									<div className={styles.help_content}>
										{formatMessage(messages.hint_text)}
										<div className={styles.alp_help_link}>
											<a href="https://alp.com/news/btc-alpha-integrates-alpha-listing-coin-alc-is?utm_source=sociallisting&utm_medium=button&utm_campaign=more">
												{formatMessage(common_messages.more)}
											</a>
										</div>
									</div>
								</Tooltip>
							</div>
						),
						icon: <i className="ai ai-alc" />,
						label: `${formatMessage(messages.transfer)} ALC`,
					},
			  ]
			: []),
		{
			name: "btc",
			icon: <i className="ai ai-btc" />,
			label: `${formatMessage(messages.transfer)} BTC`,
		},
		...(btcMethod
			? [
					{
						name: "qr",
						icon: <i className="ai ai-qr-code-01" />,
						label: "BTC address",
					},
			  ]
			: []),
	];

	return (
		<Modal
			className={styles.modal}
			label={formatMessage(messages.modal_header)}
			isOpen={isOpen}
			onClose={onClose}
		>
			<Content>
				<div className={cn(stylesModal.description, styles.modal_description)}>
					{operationStatus === 0 ? formatMessage(messages.modal_desc) : null}
				</div>
				{operationStatus === 0 && (
					<>
						<div className={styles.methods_container}>
							{donateMethods.map(({ icon, label, helpTooltip, name }) => (
								<div
									key={label}
									className={cn(styles.method, { [styles.active]: currentMethod === name })}
									onClick={() => handleClickMethod(name)}
								>
									{helpTooltip || null}
									<div className={styles.method_image}>{icon}</div>
									{label}
								</div>
							))}
						</div>
						{currentMethod === "qr" && (
							<div className={styles.modal_qr_container}>
								<span className={styles.modal_tech_text}>
									{formatMessage(messages.send_btc_text)}
								</span>
								<div className={styles.qr_container}>
									<div className={styles.qr_header}>
										<div className={styles.qr_desc}>
											<div
												className={cn(styles.qr_copy_address, styles.modal_version)}
												ref={copyAttr}
												data-address={btcMethod && btcMethod.attributes.address}
											>
												{btcMethod && btcMethod.attributes.address}
												<i className="ai ai-copy_outlined" onClick={handleClickCopyMethod} />
											</div>
										</div>
									</div>
									<div className={cn(styles.qr_block, styles.modal_version)}>
										<div className={styles.qr_block_background}>
											{btcMethod && <QrCode value={btcMethod.attributes.address} />}
										</div>
									</div>
								</div>
								<span className={styles.alc_rate}>
									{btcMethod && `1 BTC = ${btcMethod.rate} ALC`}
								</span>
							</div>
						)}
						{isAuthenticated ? (
							<>
								{currentMethod === "alc" && (
									<>
										<span className={styles.modal_tech_text}>
											{formatMessage(messages.transfer_transaction_text)}
										</span>
										<div
											onClick={() => handleBalanceClick(getBalanceForCurrency("ALC"))}
											className={styles.balance_container}
										>
											<i className="ai ai-withdraw_down" />
											<i className="ai ai-wallet-03" />
											{formatMessage(finance_messages.available)}
											<span className={styles.balance_value}>
												{formatNumber(getBalanceForCurrency("ALC"), {
													useGrouping: false,
													maximumFractionDigits: 8,
												})}
											</span>
											<span className={styles.balance_currency}>ALC</span>
											<i className="ai ai-hint_down" />
										</div>
										<div className={styles.input_container}>
											<Input
												name="amount"
												onChange={handleOnChange}
												value={amount}
												error={amountError}
												appender={<Appender>ALC</Appender>}
												labelValue={formatMessage(exchange_messages.amount)}
											/>
										</div>
										<ActionGroup>
											<Button
												color="secondary"
												label="Donate"
												fullWidth
												onClick={() => handleDonate("ALC")}
											/>
										</ActionGroup>
									</>
								)}
								{currentMethod === "btc" && (
									<>
										<span className={styles.modal_tech_text}>
											{formatMessage(messages.transfer_transaction_text)}
										</span>
										<div
											onClick={() => handleBalanceClick(getBalanceForCurrency("BTC"))}
											className={styles.balance_container}
										>
											<i className="ai ai-withdraw_down" />
											<i className="ai ai-wallet-03" />
											{formatMessage(finance_messages.available)}
											<span className={styles.balance_value}>
												{formatNumber(getBalanceForCurrency("BTC"), {
													useGrouping: false,
													maximumFractionDigits: 8,
												})}
											</span>
											<span className={styles.balance_currency}>BTC</span>
											<i className="ai ai-hint_down" />
										</div>
										<div className={styles.input_container}>
											<Input
												name="amount"
												onChange={handleOnChange}
												value={amount}
												error={amountError}
												appender={
													<Appender>
														= &nbsp;
														{formatNumber(Number(amount) * (btcMethod?.rate || 0), {
															useGrouping: false,
															maximumFractionDigits: 8,
														})}
														&nbsp; ALC
													</Appender>
												}
												labelValue={`${formatMessage({
													id: "app.components.Exchange.orders.amount",
												})} BTC`}
											/>
										</div>
										<ActionGroup>
											<Button
												color="secondary"
												fullWidth
												label="Donate"
												data-currency="BTC"
												onClick={() => handleDonate("BTC")}
											/>
										</ActionGroup>
									</>
								)}
							</>
						) : (
							<div className={styles.auth_message}>
								<div className={styles.auth_btn_group}>
									<Button label="Donate" disabled />
								</div>
								<span>
									{formatMessage(messages.login_message, {
										ref1: (
											<>
												<br />
												<InternalLink to={routes.login.root}>
													{formatMessage(common_messages.login)}
												</InternalLink>
											</>
										),
										ref2: (
											<InternalLink to={routes.register.root}>
												{formatMessage(common_messages.register)}
											</InternalLink>
										),
									})}
								</span>
							</div>
						)}
						{currentMethod !== "qr" && (
							<div className={styles.alc_link_container}>
								<a href="https://alp.com/news/btc-alpha-integrates-alpha-listing-coin-alc-is?utm_source=sociallisting&utm_medium=button&utm_campaign=more">
									{formatMessage(messages.get_alc_link_text)}
								</a>
							</div>
						)}
					</>
				)}
				{operationStatus === 1 && (
					<>
						<div className={styles.method_image}>
							<img src={DonateImg} alt="donate success" />
						</div>
						<div className={styles.operation_success_attributes}>
							<span className={styles.sent_info_item}>
								{formatMessage(messages.successful_donation)}: {amount}{" "}
								{currentMethod.toUpperCase()}
							</span>
							<span className={styles.sent_info_item}>
								<InternalLink to={routes.news.root}>
									{formatMessage(messages.watch_for_news)}
								</InternalLink>
							</span>
							<span className={styles.sent_info_item}>
								<ShareContainer
									vertical
									link={`https://alp.com/${locale}/${URL_VARS.SOCIAL_LISTING}/${project.slug}`}
								/>
							</span>
						</div>
						<ActionGroup>
							<Button
								color="primary"
								variant="outlined"
								fullWidth
								onClick={onClose}
								label={formatMessage(common_messages.close)}
							/>
						</ActionGroup>
					</>
				)}
			</Content>
		</Modal>
	);
};

export default observer(ListingDonateModal);

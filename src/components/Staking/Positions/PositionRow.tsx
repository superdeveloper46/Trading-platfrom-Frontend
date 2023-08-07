import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import dayjs from "dayjs";
import cn from "classnames";
import { toast } from "react-toastify";

import commonMessages from "messages/common";
import stakingMessages from "messages/staking";
import styles from "styles/pages/Staking.module.scss";
import tableStyles from "styles/components/UI/Table.module.scss";
import noResultsStyles from "styles/components/Table/NoResultMessage.module.scss";
import { IInterest } from "types/staking";
import { Table, TableData, TableRow, TableRowAdvancedContainer } from "components/UI/Table";
import Tooltip from "components/UI/Tooltip";
import ButtonMicro from "components/UI/ButtonMicro";
import Button from "components/UI/Button";
import Badge from "components/UI/Badge";
import { getStatusColor, getStatusName } from "utils/shell";
import { AlignEnum } from "components/UI/Table/Table";
import LoadingSpinner from "components/UI/LoadingSpinner";
import InternalLink from "components/InternalLink";
import StakingService from "services/StakingService";
import { PositionStylesEnum } from "types/shell";
import { routes } from "constants/routing";
import { IPositionItemProps } from "./PositionItem";

const PositionItem: React.FC<IPositionItemProps> = React.memo(
	({ position, type, openClosePositionModal, openSubscribeModal, openInterestModal }) => {
		const [expanded, setExpanded] = useState<boolean>(false);
		const [interests, setInterests] = useState<IInterest[]>([]);
		const [interestsReceived, setInterestsReceived] = useState<boolean>(false);
		const [income, setIncome] = useState<number>(
			((+position.amount * +position.interest_rate) / 30 / 24 / 60 / 60) *
				dayjs(dayjs(position.redeemed_at ? position.redeemed_at : Date.now())).diff(
					dayjs(position.subscribed_at),
					"seconds",
				) -
				+position.interest_paid,
		);
		const { project, plan } = position;
		const { formatNumber, formatMessage } = useIntl();

		const isProjectEnabled = project.is_enabled;

		const toggleExpand = () => {
			setExpanded((prevState) => !prevState);
			if (!interestsReceived) {
				StakingService.getPositionInterests(position.id)
					.then((res) => {
						if (Array.isArray(res.results)) {
							setInterests(res.results);
						} else {
							throw new Error("Results is not array");
						}
					})
					.catch(() => {
						toast(
							<>
								<i className="ai ai-warning" /> Server error, see the log in the console
							</>,
						);
					})
					.finally(() => setInterestsReceived(true));
			}
		};

		// eslint-disable-next-line consistent-return
		useEffect(() => {
			if (!position.redeemed_at) {
				const interval = setInterval(() => {
					setIncome(
						((+position.amount * +position.interest_rate) / 30 / 24 / 60 / 60) *
							dayjs(dayjs(Date.now())).diff(dayjs(position.subscribed_at), "seconds") -
							+position.interest_paid,
					);
				}, 1000);
				return () => clearInterval(interval);
			}
		}, [position]);

		useEffect(() => {
			setExpanded(false);
			setInterestsReceived(false);
		}, [position.interest_paid]);

		return (
			<TableRowAdvancedContainer active={expanded}>
				<TableRow className={styles.table_row}>
					<TableData className={styles.logo}>
						<>
							<i className={`ai ai-${project?.currency?.code?.toLowerCase()}`} />
							{project?.currency?.code}
						</>
					</TableData>
					<TableData align="right">
						{formatNumber(+position.amount, {
							maximumFractionDigits: 8,
							useGrouping: false,
						})}
					</TableData>
					<TableData width="50px" maxWidth="50px">
						{position.plan?.is_resubscribable && !position.redeemed_at && isProjectEnabled && (
							<Tooltip
								id={position.id.toString()}
								opener={
									<ButtonMicro className={styles.add_funds} onClick={openSubscribeModal}>
										<i className="ai ai-circle_plus" />
									</ButtonMicro>
								}
								text={formatMessage(stakingMessages.add_funds)}
							/>
						)}
					</TableData>
					<TableData maxWidth="100px">
						{formatNumber(+position.interest_rate * 100, {
							maximumFractionDigits: 2,
							useGrouping: false,
						})}
						%
						{position.promo ? (
							<Tooltip
								id={`promosign_${position.id}`}
								opener={<div className={styles.promo_sign}>P</div>}
								text={formatMessage(commonMessages.promo_code_bonuses)}
							/>
						) : null}
					</TableData>
					<TableData maxWidth="120px">
						{position.redeemed_at
							? dayjs(
									dayjs().subtract(
										dayjs(dayjs(position.redeemed_at)).diff(
											dayjs(position.subscribed_at),
											"milliseconds",
										),
										"milliseconds",
									),
							  ).fromNow(true)
							: position.timeout_at
							? formatMessage(stakingMessages.up_to_date, {
									date: dayjs(position.timeout_at).format("DD/MM/YYYY"),
							  })
							: dayjs(position.subscribed_at).fromNow(true)}
					</TableData>
					<TableData align="right" maxWidth="100px">
						{formatNumber(parseFloat(position.interest_paid), {
							maximumFractionDigits: 8,
							minimumFractionDigits: 8,
							useGrouping: false,
						})}
					</TableData>
					<TableData align="center">{dayjs(position.subscribed_at).format("DD/MM/YYYY")}</TableData>
					{type === "active" && (
						<>
							<TableData align="right" maxWidth="120px">
								<span className={styles.income}>
									+
									{formatNumber(income, {
										maximumFractionDigits: 6,
										minimumFractionDigits: 6,
										useGrouping: false,
									})}
								</span>
							</TableData>
							<TableData align="center" width="170px" minWidth="170px">
								<Button
									mini
									color="secondary"
									label={formatMessage(stakingMessages.get_interest)}
									className={styles.get_interest_button}
									disabled={Boolean(plan.penalty_rate && plan.penalty_rate.length)}
									onClick={openInterestModal}
								/>
							</TableData>
						</>
					)}
					<TableData align="center">
						{type === "active" ? (
							<Tooltip
								id={`close_pos_${position.id}`}
								opener={
									<ButtonMicro
										className={styles.close_position_button}
										onClick={openClosePositionModal}
									>
										<i className="ai ai-octagon_x" />
									</ButtonMicro>
								}
								text={formatMessage(stakingMessages.close_staking)}
							/>
						) : position.redeemed_at ? (
							dayjs(position.redeemed_at).format("DD/MM/YYYY")
						) : position.status === 3 ? (
							<>
								&nbsp;
								{dayjs(position.redeem_due_at).format("DD/MM/YYYY")}
							</>
						) : (
							"-"
						)}
					</TableData>
					<TableData align="center" maxWidth="120px">
						<Badge alpha color={getStatusColor(position.status)}>
							{getStatusName(position.status)}
						</Badge>
					</TableData>
					{/* Expand Icon */}
					{position.status !== 3 && +position.interest_paid > 0 ? (
						<TableData width="40px" maxWidth="40px" align="right" onClick={toggleExpand}>
							<Tooltip
								id={`expand_${position.id}`}
								place={PositionStylesEnum.TOP}
								opener={
									<ButtonMicro className={tableStyles.row_expand_button}>
										<i className="ai ai-arrow_down" />
									</ButtonMicro>
								}
								text={formatMessage(commonMessages.more)}
							/>
						</TableData>
					) : (
						<TableData width="40px" maxWidth="40px" />
					)}
				</TableRow>
				{expanded && (
					<Table
						header={{
							columns: [
								{
									label: formatMessage(commonMessages.date),
								},
								{
									label: formatMessage(stakingMessages.positions_table_paid),
									align: AlignEnum.Right,
								},
								{
									label: (
										<>
											{formatMessage(stakingMessages.staking_type)}&nbsp;&nbsp;
											<div className={styles.flexible_staking_type}>
												{formatMessage(stakingMessages.flexible)}
											</div>
										</>
									),
									align: AlignEnum.Right,
								},
							],
						}}
					>
						{interestsReceived ? (
							interests.length ? (
								interests.map((interest: IInterest, iIdx: number) => (
									<TableRow className={styles.interest_row} key={interest.id}>
										<TableData dateMode>
											{dayjs(interest.date).format("DD/MM/YYYY")}&nbsp;
											<span>{dayjs(interest.date).format("HH:mm:ss")}</span>
										</TableData>
										<TableData align="right">
											{formatNumber(+interest.amount, {
												useGrouping: false,
												maximumFractionDigits: 8,
											})}
										</TableData>
										<TableData align="right">
											{iIdx === interests.length - 1 && (
												<InternalLink
													className={styles.payment_history_link}
													to={routes.staking.paymentHistory}
												>
													{formatMessage(stakingMessages.payment_history)}
													<i className="ai ai-chevron_right" />
												</InternalLink>
											)}
										</TableData>
									</TableRow>
								))
							) : (
								<div
									className={cn(noResultsStyles.no_rows_message_container, noResultsStyles.small)}
								>
									<i className="ai ai-dok_empty" />
									<span>{formatMessage(stakingMessages.empty_position_interests)}</span>
								</div>
							)
						) : (
							<LoadingSpinner />
						)}
					</Table>
				)}
			</TableRowAdvancedContainer>
		);
	},
);

export default PositionItem;

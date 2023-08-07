import classnames from "classnames";
import React from "react";
import dayjs from "utils/dayjs";

import InternalLink from "components/InternalLink";
import Badge, { BadgeColorEnum } from "components/UI/Badge";
import ButtonMicro from "components/UI/ButtonMicro";
import { IApiKeyDetails } from "models/ApiKeys";
import styles from "styles/components/Profile/Dashboard/DashboardApi.module.scss";
import { routes } from "constants/routing";
import useApiRow from "./useApiRow";

interface IProps {
	apiKey: IApiKeyDetails;
	onDelete(slug: string, label: string): void;
}

const ApiKeyRowMobile: React.FC<IProps> = ({ apiKey, onDelete }) => {
	const { isActive, toggleExpand, deleteApiKey, limitToIps, allowedSymbols } = useApiRow(
		apiKey,
		onDelete,
	);

	const expandedStyle = {
		[styles.expanded]: isActive,
	};

	return (
		<div className={classnames(styles.card_mobile, expandedStyle)}>
			<div className={classnames(styles.card_mobile_header, expandedStyle)}>
				<span>{apiKey.label}</span>
				<div className={classnames(styles.card_mobile_action, expandedStyle)}>
					<div className={styles.card_mobile_action} onClick={toggleExpand}>
						<i className="ai ai-arrow_down" />
					</div>
				</div>
			</div>
			<div className={styles.card_mobile_content}>
				<div className={styles.card_mobile_content_group}>
					<span>Prefix</span>
					<span>{apiKey.prefix}</span>
				</div>
				<div className={styles.card_mobile_content_group}>
					<span>Created At</span>
					<span>{dayjs(apiKey.created_at).format("DD.MM.YYYY HH:mm")}</span>
				</div>
				<div className={styles.card_mobile_content_group}>
					<span>Created At</span>
					<span>{dayjs(apiKey.created_at).format("DD.MM.YYYY HH:mm")}</span>
				</div>
				<div className={styles.card_mobile_content_group}>
					<span>Used At</span>
					<span>{apiKey.used_at ? dayjs(apiKey.used_at).format("DD.MM.YYYY HH:mm") : "--"}</span>
				</div>
			</div>
			{isActive && (
				<div className={styles.card_mobile_content_hidden}>
					<div className={styles.card_mobile_content_group}>
						<span>Permissions:</span>
						<span>
							Read
							{apiKey.can_trade ? <>, Trade</> : null}
							{apiKey.can_margin ? <>, Margin</> : null}
							{apiKey.can_withdraw ? <>, Withdraw</> : null}
						</span>
					</div>
					<div className={styles.card_mobile_content_group}>
						<span>Restrictions IP&apos;s</span>
						<span>
							{limitToIps.length ? (
								<div className={styles.badge_list}>
									{limitToIps.map((ip: string) => (
										<Badge key={ip} alpha color={BadgeColorEnum.VIOLET}>
											{ip}
										</Badge>
									))}
								</div>
							) : (
								"--"
							)}
						</span>
					</div>
					<div className={styles.card_mobile_content_group}>
						<span>Restrictions Pairs:</span>
						<span>
							{allowedSymbols.length
								? allowedSymbols.map((symbol) => (
										<div className={styles.badge_list}>
											<Badge key={symbol} alpha color={BadgeColorEnum.GREEN}>
												{symbol.replace(/_/g, "/")}
											</Badge>
										</div>
								  ))
								: "all"}
						</span>
					</div>
					<div className={styles.card_mobile_content_group}>
						<ButtonMicro primary colored onClick={deleteApiKey}>
							<i className="ai ai-delete_outline" />
						</ButtonMicro>
						<span>
							<InternalLink to={routes.api.getDetails(apiKey.slug)}>Edit</InternalLink>
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default ApiKeyRowMobile;

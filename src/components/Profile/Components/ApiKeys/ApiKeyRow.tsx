import React from "react";
import dayjs from "utils/dayjs";

import InternalLink from "components/InternalLink";
import Badge, { BadgeColorEnum } from "components/UI/Badge";
import ButtonMicro from "components/UI/ButtonMicro";
import { Table, TableData, TableRow, TableRowAdvancedContainer } from "components/UI/Table";
import { IApiKeyDetails } from "models/ApiKeys";
import styles from "styles/components/Profile/Dashboard/DashboardApi.module.scss";
import { ellipsisInsideWord } from "utils/format";
import { routes } from "constants/routing";
import useCopyClick from "hooks/useCopyClick";
import useApiRow from "./useApiRow";

interface IProps {
	apiKey: IApiKeyDetails;
	onDelete(slug: string, label: string): void;
}

const ApiKeyRow: React.FC<IProps> = ({ apiKey, onDelete }) => {
	const copyClick = useCopyClick();

	const { isActive, toggleExpand, deleteApiKey, limitToIps, allowedSymbols } = useApiRow(
		apiKey,
		onDelete,
	);

	const handleClickCopy = () => {
		copyClick(apiKey.key);
	};

	return (
		<TableRowAdvancedContainer active={isActive}>
			<TableRow active={isActive} onExpand={toggleExpand} isExpandActive>
				<TableData title={apiKey.label}>
					{apiKey.label.slice(0, 10)}
					{apiKey.label.length > 10 && "..."}
				</TableData>
				<TableData className={styles.api_key_value} title={apiKey.key} onClick={handleClickCopy}>
					{ellipsisInsideWord(apiKey.key)}
				</TableData>
				<TableData>
					{limitToIps.length ? (
						<>
							<Badge alpha color={BadgeColorEnum.VIOLET}>
								{limitToIps[0]}
							</Badge>
							&nbsp;
							{limitToIps.length > 1 && "..."}
						</>
					) : (
						"--"
					)}
				</TableData>
				<TableData>
					{allowedSymbols.length ? (
						<>
							<Badge alpha color={BadgeColorEnum.GREEN}>
								{allowedSymbols[0]?.replace(/_/g, "/")}
							</Badge>
							&nbsp;
							{allowedSymbols.length > 1 && "..."}
						</>
					) : (
						"all"
					)}
				</TableData>
				<TableData>{dayjs(apiKey.created_at).format("DD.MM.YYYY HH:mm")}</TableData>
				<TableData>
					{apiKey.used_at ? dayjs(apiKey.used_at).format("DD.MM.YYYY HH:mm") : "--"}
				</TableData>
				<TableData align="center">
					<ButtonMicro primary colored onClick={deleteApiKey}>
						<i className="ai ai-delete_outline" />
					</ButtonMicro>
				</TableData>
				<TableData align="right">
					<InternalLink to={routes.api.getDetails(apiKey.slug)}>Edit</InternalLink>
				</TableData>
			</TableRow>
			{isActive && (
				<Table>
					<TableRow>
						<TableData>{apiKey.label}</TableData>
						<TableData>
							Permissions: Read
							{apiKey.can_trade ? <>, Trade</> : null}
							{apiKey.can_margin ? <>, Margin</> : null}
							{apiKey.can_withdraw ? <>, Withdraw</> : null}
						</TableData>
						<TableData>
							Restrictions IP&apos;s:&nbsp;
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
						</TableData>
						<TableData />
						<TableData>
							Restrictions Pairs:&nbsp;
							{allowedSymbols.length
								? allowedSymbols.map((symbol) => (
										<div className={styles.badge_list}>
											<Badge key={symbol} alpha color={BadgeColorEnum.GREEN}>
												{symbol.replace(/_/g, "/")}
											</Badge>
										</div>
								  ))
								: "all"}
						</TableData>
						<TableData />
					</TableRow>
				</Table>
			)}
		</TableRowAdvancedContainer>
	);
};

export default ApiKeyRow;

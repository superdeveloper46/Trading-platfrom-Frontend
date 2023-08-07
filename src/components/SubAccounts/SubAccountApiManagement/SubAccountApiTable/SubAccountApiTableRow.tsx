import React from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import dayjs from "dayjs";

import commonMessages from "messages/common";
import apiMessages from "messages/api";
import { ISubApi } from "types/subAccounts";
import { TableData, TableRow } from "components/UI/Table";
import InternalLink from "components/InternalLink";
import styles from "styles/pages/SubAccounts/ApiManagement.module.scss";
import subAccountsStyles from "styles/pages/SubAccounts/SubAccount.module.scss";
import Tooltip from "components/UI/Tooltip";
import apiStyles from "styles/components/Profile/Dashboard/DashboardApi.module.scss";
import { ellipsisInsideWord } from "utils/format";
import { routes } from "constants/routing";
import useCopyClick from "hooks/useCopyClick";

interface IProps {
	subApi: ISubApi;
	onDelete: () => void;
}

const SubAccountApiTableRow: React.FC<IProps> = ({ subApi, onDelete }) => {
	const { formatMessage } = useIntl();
	const copyClick = useCopyClick();

	return (
		<TableRow className={subAccountsStyles.table_row} common>
			<TableData width="140px">{subApi.label}</TableData>
			<TableData align="center" width="120px">
				{dayjs(subApi?.created_at).format("DD/MM/YY")}
			</TableData>
			<TableData
				width="140px"
				maxWidth="140px"
				className={apiStyles.api_key_value}
				title={subApi.key}
				onClick={() => copyClick(subApi.key)}
			>
				{ellipsisInsideWord(subApi.key)}
			</TableData>
			<TableData width="140px">
				<div className={styles.ip_container}>
					{subApi.limit_to_ips && subApi.limit_to_ips[0]}{" "}
					{subApi.limit_to_ips?.length > 1 && (
						<Tooltip
							opener={
								<div className={styles.more_ips} data-tip data-for={subApi.slug}>
									{/* eslint-disable-next-line no-unsafe-optional-chaining */}+
									{subApi.limit_to_ips?.length - 1}
								</div>
							}
							className={styles.tooltip}
							padding="0"
							delayHide={50}
							id={subApi.slug}
							place="bottom"
							arrowColor="transparent"
							openOnClick
							clickable
							isCapture
						>
							<div className={styles.ip_list}>
								{subApi.limit_to_ips.map((i) => (
									<div className={styles.ip_item}>
										{i}{" "}
										<i
											className={cn(styles.copy_btn, "ai ai-copy_new")}
											onClick={() => copyClick(i)}
										/>
									</div>
								))}
							</div>
						</Tooltip>
					)}
				</div>
			</TableData>
			<TableData align="center" width="100px">
				<i className={cn(subAccountsStyles.table_data_status, "ai ai-check_filled")} />
			</TableData>
			<TableData align="center" width="100px">
				{subApi.can_margin ? (
					<i className={cn(subAccountsStyles.table_data_status, "ai ai-check_filled")} />
				) : (
					<i className={cn(subAccountsStyles.table_data_status, "ai ai-cancel_filled")} />
				)}
			</TableData>
			<TableData align="right" width="140px">
				<InternalLink to={routes.subAccounts.getApiEdit(subApi.slug)}>
					<div className={subAccountsStyles.action_button}>
						<i className="ai ai-edit" />
						<span>{formatMessage(commonMessages.edit)}</span>
					</div>
				</InternalLink>
			</TableData>
			<TableData align="right" width="140px">
				<button
					type="button"
					className={cn(subAccountsStyles.action_button, subAccountsStyles.delete)}
					onClick={onDelete}
				>
					<i className="ai ai-trash_filled" />
					<span>{formatMessage(apiMessages.delete_btn)}</span>
				</button>
			</TableData>
		</TableRow>
	);
};

export default SubAccountApiTableRow;

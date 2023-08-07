import React, { useState } from "react";
import { toast } from "react-toastify";

import { TableData, TableRow } from "components/UI/NewTable";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import P2PService from "services/P2PService";
import errorHandler from "utils/errorHandler";
import Button from "components/UI/Button";
import { IBlockedUser } from "types/p2p";
import InternalLink from "components/InternalLink";
import { routes } from "constants/routing";
import cn from "classnames";
import dayjs from "dayjs";

interface IProps {
	refetch: () => void;
	user: IBlockedUser;
}

const BlockedUsersTableRow: React.FC<IProps> = ({ refetch, user }) => {
	const [isUnblocking, toggleIsUnblocking] = useState(false);

	const handleUnblock = () => {
		toggleIsUnblocking(true);
		return P2PService.unblockUser(user.target)
			.then(() => {
				refetch();
				toast.success("User unblocked!");
			})
			.catch(errorHandler)
			.finally(() => toggleIsUnblocking(false));
	};

	return (
		<TableRow common>
			<TableData title={user.nickname} maxWidth="400px" minWidth="165px" crop>
				<InternalLink
					className={cn(p2pStyles.black_link, p2pStyles.bold)}
					to={routes.p2p.getUserDetails(user.target)}
				>
					{user.nickname}
				</InternalLink>
			</TableData>
			<TableData minWidth="220px" maxWidth="450px">
				{user.date ? dayjs.utc(dayjs(user.date)).format("DD-MM-YYYY HH:mm:ss") : "--"}
			</TableData>
			<TableData title={user.comment || user.reason} maxWidth="800px" minWidth="200px" crop>
				{user.comment || user.reason}
			</TableData>
			<TableData align="right" width="100px" minWidth="100px" maxWidth="130px">
				<Button
					label="Unblock"
					variant="text"
					onClick={handleUnblock}
					isLoading={isUnblocking}
					className={p2pStyles.table_btn}
				/>
			</TableData>
		</TableRow>
	);
};

export default BlockedUsersTableRow;

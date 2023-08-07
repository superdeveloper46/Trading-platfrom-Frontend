import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import LoadingSpinner from "components/UI/LoadingSpinner";
import messages from "messages/alpha_codes";
import common_messages from "messages/common";
import Pagination from "components/UI/Pagination";
import { useMst } from "models/Root";
import { IAlphaCode } from "models/AlphaCodes";
import { useSearchParams } from "react-router-dom";
import useWindowSize from "hooks/useWindowSize";
import styles from "styles/components/AlphaCodes.module.scss";
import tableStyles from "styles/components/UI/Table.module.scss";
import { Table } from "components/UI/Table";
import { IHeaderColumn } from "components/UI/Table/Table";
import noRowsMessageStyles from "styles/pages/Table.module.scss";
import { queryVars } from "constants/query";
import RowCreated from "./RowCreated";
import RowCreatedMobile from "./RowCreatedMobile";

interface Props {
	paginator?: boolean;
}

const PAGE_SIZE = 10;

const NoDataNode = () => {
	const { formatMessage } = useIntl();

	return (
		<div className={cn(tableStyles.row, tableStyles.disable_hover)}>
			<div className={noRowsMessageStyles.container}>
				<i className="ai ai-dok_empty" />
				<span>{formatMessage(common_messages.no_match_search)}</span>
			</div>
		</div>
	);
};

const TableCreated: React.FC<Props> = ({ paginator = false }) => {
	const { formatMessage } = useIntl();
	const [searchParams] = useSearchParams();
	const { desktop } = useWindowSize();
	const [page, setPage] = useState<number>(Number(Object.fromEntries(searchParams).page || "1"));

	const {
		alphaCodes: { isLoading, results, codesCount, getCreatedAlphaCodes },
	} = useMst();

	useEffect(() => {
		getCreatedAlphaCodes({ [queryVars.page_size]: PAGE_SIZE, [queryVars.page]: 1 });
	}, []);

	const handlePageChange = (page: number) => {
		setPage(page);
		getCreatedAlphaCodes({ [queryVars.page_size]: PAGE_SIZE, page });
	};

	const columns: IHeaderColumn[] = [
		{
			name: "date",
			label: formatMessage(messages.date),
		},
		{
			name: "code",
			label: formatMessage(messages.code),
		},
		{
			name: "amount",
			label: formatMessage(messages.amount),
		},
		{
			name: "currency",
			label: formatMessage(messages.currency),
		},
		{
			name: "recipient_email",
			label: formatMessage(messages.recipient_email),
		},
		{
			name: "status",
			label: formatMessage(messages.status),
		},
	];

	return (
		// eslint-disable-next-line react/jsx-no-useless-fragment
		<>
			{isLoading ? (
				<LoadingSpinner verticalMargin="25px" />
			) : (
				<>
					{results?.length && results.length > 0 ? (
						desktop ? (
							<Table header={{ columns }}>
								{results.map((code: IAlphaCode) => (
									<RowCreated key={code.code_search} code={code} />
								))}
							</Table>
						) : (
							<div className={styles.mobile_rows_wrapper}>
								{results.map((code: IAlphaCode) => (
									<RowCreatedMobile key={code.code_search} code={code} />
								))}
							</div>
						)
					) : (
						<NoDataNode />
					)}
					{paginator && desktop && (
						<div className={styles.paginator_wrapper}>
							<Pagination
								count={Math.ceil(codesCount / PAGE_SIZE)}
								page={page}
								onChange={handlePageChange}
							/>
						</div>
					)}
				</>
			)}
		</>
	);
};

export default observer(TableCreated);

import React, { useEffect, useState } from "react";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";

import messages from "messages/alpha_codes";
import common_messages from "messages/common";
import LoadingSpinner from "components/UI/LoadingSpinner";
import Pagination from "components/UI/Pagination";
import { useSearchParams } from "react-router-dom";
import { useMst } from "models/Root";
import useWindowSize from "hooks/useWindowSize";
import { IAlphaCode } from "models/AlphaCodes";
import tableStyles from "styles/components/UI/Table.module.scss";
import noRowsMessageStyles from "styles/pages/Table.module.scss";
import styles from "styles/components/AlphaCodes.module.scss";
import { queryVars } from "constants/query";
import RowActivated from "./RowActivated";
import RowActivatedMobile from "./RowActivatedMobile";

interface Props {
	paginator?: boolean;
}

const PAGE_SIZE = 10;

const NoDataNode: React.FC = () => {
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

const TableActivated: React.FC<Props> = ({ paginator = false }) => {
	const { formatMessage } = useIntl();
	const [searchParams] = useSearchParams();
	const { mobile } = useWindowSize();
	const desktop = !mobile;
	const [page, setPage] = useState<number>(Number(Object.fromEntries(searchParams).page || "1"));

	const {
		alphaCodes: { isLoading, results, codesCount, getActivatedAlphaCodes },
	} = useMst();

	useEffect(() => {
		getActivatedAlphaCodes({ [queryVars.page_size]: PAGE_SIZE, [queryVars.page]: 1 });
	}, []);

	const handlePageChange = (page: number) => {
		setPage(page);
		getActivatedAlphaCodes({ [queryVars.page_size]: PAGE_SIZE, page });
	};

	return (
		// eslint-disable-next-line react/jsx-no-useless-fragment
		<>
			{isLoading ? (
				<LoadingSpinner verticalMargin="25px" />
			) : (
				<>
					{desktop && (
						<div className={cn(tableStyles.rows, tableStyles.stripped)} style={{ width: "100%" }}>
							<div className={tableStyles.head}>
								<div className={cn(tableStyles.data, tableStyles.header)}>
									{formatMessage(messages.date)}
								</div>
								<div className={cn(tableStyles.data, tableStyles.header)}>
									{formatMessage(messages.code)}
								</div>
								<div className={cn(tableStyles.data, tableStyles.header)}>
									{formatMessage(messages.amount)}
								</div>
								<div className={cn(tableStyles.data, tableStyles.header)}>
									{formatMessage(messages.currency)}
								</div>
							</div>
						</div>
					)}
					{results?.length && results.length > 0 ? (
						<div className={desktop ? "" : styles.mobile_rows_wrapper}>
							{results.map((coupon: IAlphaCode) =>
								desktop ? (
									<RowActivated key={coupon.code_search} code={coupon} />
								) : (
									<RowActivatedMobile key={coupon.code_search} code={coupon} />
								),
							)}
						</div>
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

export default observer(TableActivated);

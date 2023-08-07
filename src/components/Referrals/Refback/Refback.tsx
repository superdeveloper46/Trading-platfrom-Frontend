import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";
import cn from "classnames";

import referralsMessages from "messages/referrals";
import dayjs from "utils/dayjs";
import commonMessages from "messages/common";
import { useMst } from "models/Root";
import useWindowSize from "hooks/useWindowSize";
import styles from "styles/components/Profile/Referrals/Referrals.module.scss";
import { queryVars } from "constants/query";
import Pagination from "components/UI/Pagination";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { IReferralRefback } from "types/referrals";
import SearchInput from "components/UI/SearchInput";
import DateRangePicker, { IChangeDateRange, IDateRange } from "components/UI/DateRangePicker";
import { Table } from "components/UI/Table";
import NoRowsMessage from "components/Table/NoRowsMessage";
import stylesTable from "styles/components/UI/Table.module.scss";
import RefbackRow from "./RefbackRow";
import RefbackRowMobile from "./RefbackRowMobile";

const FORMAT_NUMBER_OPTIONS = {
	useGrouping: false,
	maximumFractionDigits: 8,
};

const Refback: React.FC = () => {
	const {
		referrals: { refbacksList, isRefbacksListLoading, refbacksCount, info, loadReferralRefbacks },
		global: { locale },
	} = useMst();
	const { medium } = useWindowSize();
	const desktop = !medium;
	const { formatMessage, formatNumber } = useIntl();
	const [page, setPage] = useState<number>(1);
	const [filterDateRange, setFilterDateRange] = useState<IDateRange>({
		startDate: "",
		endDate: "",
		key: "selection",
	});
	const [searchQuery, setSearchQuery] = useState<string>("");

	const handlePageChange = (page: number) => {
		setPage(page);
		loadReferralRefbacks({
			[queryVars.page_size]: 15,
			page,
			[queryVars.search]: searchQuery,
			[queryVars.date_after]: filterDateRange.startDate
				? dayjs(filterDateRange.startDate).format("YYYY-MM-DD")
				: undefined,
			[queryVars.date_before]: filterDateRange.endDate
				? dayjs(filterDateRange.endDate).add(1, "day").format("YYYY-MM-DD")
				: undefined,
		});
	};

	const filter = (startD: Date | string, endD: Date | string, searchQ: string) => {
		setPage(1);
		loadReferralRefbacks({
			[queryVars.page_size]: 15,
			[queryVars.page]: 1,
			[queryVars.search]: searchQ,
			[queryVars.date_after]: startD ? dayjs(startD).format("YYYY-MM-DD") : undefined,
			[queryVars.date_before]: endD ? dayjs(endD).add(1, "day").format("YYYY-MM-DD") : undefined,
		});
	};

	const handleDateRangeChange = (nextDate: IChangeDateRange) => {
		setFilterDateRange(nextDate.selection);
		filter(nextDate.selection.startDate, nextDate.selection.endDate, searchQuery);
	};

	const handleRangeClear = () => {
		setFilterDateRange((prevState: IDateRange) => ({
			...prevState,
			startDate: "",
			endDate: "",
		}));
		filter("", "", searchQuery);
	};

	const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nextSearchQuery = e.target.value;
		setSearchQuery(e.target.value);
		filter(filterDateRange.startDate, filterDateRange.endDate, nextSearchQuery);
	};

	useEffect(() => {
		loadReferralRefbacks({ [queryVars.page_size]: 15, page });
	}, []);

	return info?.invite ? (
		<div className={styles.content}>
			<div className={styles.card_container}>
				<div className={styles.table_container}>
					<div className={styles.card_header}>
						<div className={styles.card_title_container}>
							<div className={styles.card_title}>Refback User ID: {info.invite?.code}</div>
							<span className={styles.card_subtitle}>
								{formatMessage(referralsMessages.you_get_from_referrer, {
									percentage: `${formatNumber(
										Number(info?.tier?.rate ?? 0) * 100,
										FORMAT_NUMBER_OPTIONS,
									)}%`,
								})}
							</span>
						</div>
					</div>
					<div className={styles.card_filters}>
						<div className={styles.date_picker_container}>
							<DateRangePicker
								ranges={[filterDateRange]}
								onChange={handleDateRangeChange}
								staticRanges={[]}
								inputRanges={[]}
								onRangeClear={handleRangeClear}
							/>
						</div>
						<div className={styles.search_container}>
							<SearchInput value={searchQuery} onChange={handleSearchQueryChange} />
						</div>
					</div>
					{desktop ? (
						<Table
							className={styles.refback_table}
							header={{
								columns: [
									{
										label: formatMessage(commonMessages.date),
									},
									{
										label: formatMessage(referralsMessages.fee_return),
									},
								],
							}}
						>
							<div className={cn(stylesTable.table, stylesTable.fullWidth, styles.stripped_table)}>
								{isRefbacksListLoading ? (
									<LoadingSpinner />
								) : refbacksList.length > 0 ? (
									refbacksList.map((refback: IReferralRefback, idx: number) => (
										<RefbackRow
											key={`${refback.date}${refback.currency_code}${idx}`}
											refback={refback}
										/>
									))
								) : (
									<NoRowsMessage />
								)}
							</div>
						</Table>
					) : (
						<div className={styles.card_mobiles_list}>
							{isRefbacksListLoading ? (
								<LoadingSpinner />
							) : refbacksList.length > 0 ? (
								refbacksList.map((refback: IReferralRefback, idx: number) => (
									<RefbackRowMobile
										key={`${refback.date}${refback.currency_code}${idx}`}
										refback={refback}
									/>
								))
							) : (
								<NoRowsMessage />
							)}
						</div>
					)}
					<div className={styles.card_footer}>
						<Pagination
							page={page}
							count={Math.ceil(refbacksCount / 15)}
							onChange={handlePageChange}
						/>
					</div>
				</div>
			</div>
		</div>
	) : (
		<Navigate to={`/${locale}/profile/referrals`} replace />
	);
};

export default observer(Refback);

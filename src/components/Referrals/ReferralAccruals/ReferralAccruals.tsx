import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import dayjs from "utils/dayjs";
import referralsMessages from "messages/referrals";
import commonMessages from "messages/common";
import { IReferralAccrual } from "types/referrals";
import { useMst } from "models/Root";
import SearchInput from "components/UI/SearchInput";
import LoadingSpinner from "components/UI/LoadingSpinner";
import NoRowsMessage from "components/Table/NoRowsMessage";
import Pagination from "components/UI/Pagination";
import useWindowSize from "hooks/useWindowSize";
import stylesTable from "styles/components/UI/Table.module.scss";
import styles from "styles/components/Profile/Referrals/Referrals.module.scss";
import { queryVars } from "constants/query";
import { Table } from "components/UI/Table";
import DateRangePicker, { IChangeDateRange, IDateRange } from "components/UI/DateRangePicker";
import ReferralAccrualsRowMobile from "./ReferralAccrualsRowMobile";
import ReferralAccrualsRow from "./ReferralAccrualsRow";

const ReferralAccruals: React.FC = () => {
	const {
		referrals: { accrualsList, isAccrualsListLoading, accrualsCount, info, loadReferralAccruals },
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
	const percentage = info?.tier?.rate?.length ? Number(info.tier.rate) * 100 : 0;

	const handlePageChange = (page: number) => {
		setPage(page);
		loadReferralAccruals({
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
		loadReferralAccruals({
			[queryVars.page_size]: 15,
			[queryVars.page]: 1,
			[queryVars.search]: searchQ,
			[queryVars.date_after]: startD ? dayjs(startD).format("YYYY-MM-DD") : undefined,
			[queryVars.date_before]: endD ? dayjs(endD).add(1, "day").format("YYYY-MM-DD") : undefined,
		});
		setPage(1);
	};

	const handleDateRangeChange = (nextDate: IChangeDateRange) => {
		setFilterDateRange(nextDate.selection);
		filter(nextDate.selection.startDate, nextDate.selection.endDate, searchQuery);
	};

	const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nextSearchQuery = e.target.value;
		setSearchQuery(nextSearchQuery);
		filter(filterDateRange.startDate, filterDateRange.endDate, nextSearchQuery);
	};

	const handleRangeClear = () => {
		setFilterDateRange((prevState: IDateRange) => ({
			...prevState,
			startDate: "",
			endDate: "",
		}));
		filter("", "", searchQuery);
	};

	useEffect(() => {
		loadReferralAccruals({ [queryVars.page_size]: 15, page });
	}, []);

	return (
		<div className={styles.content}>
			<div className={styles.card_container}>
				<div className={styles.table_container}>
					<div className={styles.card_header}>
						<div className={styles.card_title_container}>
							<div className={styles.card_title}>
								{formatMessage(referralsMessages.referral_history_accruement)}
							</div>
							<span className={styles.card_subtitle}>
								{formatMessage(referralsMessages.you_get_from_the_referral_fee, {
									percentage: `${formatNumber(percentage, {
										useGrouping: false,
										maximumFractionDigits: 8,
									})}%`,
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
							className={styles.referrals_accruals_table}
							header={{
								columns: [
									{
										label: formatMessage(commonMessages.date),
									},
									{
										label: "User ID",
									},
									{
										label: formatMessage(referralsMessages.referral_code),
									},
									{
										label: formatMessage(referralsMessages.your_percentage),
										align: "right",
									},
									{
										label: "",
										maxWidth: "80px",
									},
									{
										label: formatMessage(referralsMessages.sum),
										align: "right",
									},
								],
							}}
						>
							<div className={cn(stylesTable.table, stylesTable.fullWidth, styles.stripped_table)}>
								{isAccrualsListLoading ? (
									<LoadingSpinner />
								) : accrualsList.length > 0 ? (
									accrualsList.map((accrual: IReferralAccrual, idx: number) => (
										<ReferralAccrualsRow
											key={`${accrual.date}${accrual.currency_code}${idx}`}
											accrual={accrual}
										/>
									))
								) : (
									<NoRowsMessage />
								)}
							</div>
						</Table>
					) : (
						<div className={styles.card_mobiles_list}>
							{isAccrualsListLoading ? (
								<LoadingSpinner />
							) : accrualsList.length > 0 ? (
								accrualsList.map((accrual: IReferralAccrual, idx: number) => (
									<ReferralAccrualsRowMobile
										key={`${accrual.date}${accrual.currency_code}${idx}`}
										accrual={accrual}
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
							count={Math.ceil(accrualsCount / 15)}
							onChange={handlePageChange}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default observer(ReferralAccruals);

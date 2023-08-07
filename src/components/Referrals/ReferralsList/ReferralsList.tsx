import React, { useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import dayjs from "utils/dayjs";
import referralsMessages from "messages/referrals";
import DateRangePicker, { IChangeDateRange, IDateRange } from "components/UI/DateRangePicker";
import { IReferral } from "types/referrals";
import { useMst } from "models/Root";
import NoRowsMessage from "components/Table/NoRowsMessage";
import useWindowSize from "hooks/useWindowSize";
import Pagination from "components/UI/Pagination";
import LoadingSpinner from "components/UI/LoadingSpinner";
import SearchInput from "components/UI/SearchInput";
import styles from "styles/components/Profile/Referrals/Referrals.module.scss";
import stylesTable from "styles/components/UI/Table.module.scss";
import { queryVars } from "constants/query";
import { Table } from "components/UI/Table";
import ReferralsListRow from "./ReferralsListRow";
import ReferralsListRowMobile from "./ReferralsListRowMobile";

const ReferralsList: React.FC = () => {
	const {
		referrals: { referralsList, isReferralsListLoading, referralsCount, loadReferralsList },
	} = useMst();
	const { formatMessage } = useIntl();
	const [page, setPage] = useState<number>(1);
	const [filterDateRange, setFilterDateRange] = useState<IDateRange>({
		startDate: "",
		endDate: "",
		key: "selection",
	});
	const [searchQuery, setSearchQuery] = useState<string>("");

	const { medium } = useWindowSize();
	const desktop = !medium;

	const handlePageChange = (page: number) => {
		setPage(page);
		loadReferralsList({
			[queryVars.page_size]: 15,
			page,
			[queryVars.search]: searchQuery,
			joined_at_after: filterDateRange.startDate
				? dayjs(filterDateRange.startDate).format("YYYY-MM-DD")
				: undefined,
			joined_at_before: filterDateRange.endDate
				? dayjs(filterDateRange.endDate).add(1, "day").format("YYYY-MM-DD")
				: undefined,
		});
	};
	// debounce
	const filter = (startD: Date | string, endD: Date | string, searchQ: string) => {
		setPage(1);
		loadReferralsList({
			[queryVars.page_size]: 15,
			[queryVars.page]: 1,
			[queryVars.search]: searchQ,
			joined_at_after: startD ? dayjs(startD).format("YYYY-MM-DD") : undefined,
			joined_at_before: endD ? dayjs(endD).add(1, "day").format("YYYY-MM-DD") : undefined,
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

	return (
		<div className={styles.content}>
			<div className={styles.card_container}>
				<div className={styles.table_container}>
					<div className={styles.card_header}>
						<div className={styles.card_title_container}>
							<div className={styles.card_title}>
								{formatMessage(referralsMessages.my_friends_list)}
							</div>
							<span className={styles.card_subtitle}>
								{formatMessage(referralsMessages.more_earnings_possibility)}
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
							className={styles.referrals_list_table}
							header={{
								columns: [
									{
										label: "User ID",
									},
									{
										label: formatMessage(referralsMessages.invite_code),
										align: "right",
									},
									{
										label: "",
										maxWidth: "80px",
									},
									{
										label: formatMessage(referralsMessages.your_percentage),
									},
									{
										label: `${formatMessage(referralsMessages.bonuses_earned)} (USDT)`,
										align: "right",
									},
									{
										label: formatMessage(referralsMessages.registration_date),
										align: "right",
									},
								],
							}}
							stripped
						>
							{isReferralsListLoading ? (
								<LoadingSpinner />
							) : referralsList.length ? (
								referralsList.map((referral: IReferral) => (
									<ReferralsListRow key={referral.referral_uid} referral={referral} />
								))
							) : (
								<NoRowsMessage />
							)}
						</Table>
					) : (
						<div className={styles.card_mobiles_list}>
							{isReferralsListLoading ? (
								<LoadingSpinner />
							) : referralsList.length ? (
								referralsList.map((referral: IReferral) => (
									<ReferralsListRowMobile key={referral.referral_uid} referral={referral} />
								))
							) : (
								<NoRowsMessage />
							)}
						</div>
					)}
					<div className={styles.card_footer}>
						<Pagination
							page={page}
							count={Math.ceil(referralsCount / 15)}
							onChange={handlePageChange}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default observer(ReferralsList);

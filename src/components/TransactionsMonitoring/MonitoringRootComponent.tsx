import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "styles/components/TransactionsMonitoring/Report.module.scss";
import messages from "messages/report";
import useParamQuery from "hooks/useSearchQuery";
import { ContentEnum, ResourceTypeEnum } from "types/amlReport";
import { PageHeader, PageHeaderContent, PageHeaderNav } from "components/UI/Page";
import { isValidAddress, isValidEthHash, isValidTxHash } from "utils/reportUtils";
import { useMst } from "models/Root";
import SearchInput from "components/UI/SearchInput";
import InternalLink from "components/InternalLink";
import Tabs from "components/UI/Tabs";
import Tab from "components/UI/Tab";
import Button from "components/UI/Button";
import { queryVars } from "constants/query";
import { routes } from "constants/routing";
import useStateWithCallback from "hooks/useStateWithCallback";
import { FORMAT_NUMBER_OPTIONS_USDT } from "constants/format";
import Select from "components/UI/Select";
import CurrencySelect from "components/UI/CurrencySelect";
import { useReportInfo } from "services/ReportService";
import CompletedReports from "./CompletedReports";
import Reports from "./Reports";

const ETH_ENABLED = false;

const BTCOption = {
	label: {
		code: "BTC",
		name: "Bitcoin",
	},
	value: "BTC",
};

const MonitoringRootComponent: React.FC = () => {
	const {
		global: { isAuthenticated },
		account: { totalBalance, loadBalances, loadRates },
		tickers: { loadTickers },
	} = useMst();
	const { data: reportInfo } = useReportInfo();
	const { formatMessage, formatNumber } = useIntl();
	const navigate = useNavigate();
	const query = useParamQuery();
	const { pathname } = useLocation();
	const [searchFieldValue, setSearchFieldValue] = useStateWithCallback<string>(
		query.get(queryVars.value) || "",
	);
	const [hashOrAddress, setHashOrAddress] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [type, setType] = useState<ResourceTypeEnum | "">("");
	const [isDemo, setIsDemo] = useState(false);
	const [activeTab, setActiveTab] = useState<ContentEnum>(ContentEnum.REPORT);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (isAuthenticated) {
			loadTickers();
			loadRates();
		}
	}, [isAuthenticated]);

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setSearchFieldValue(value);
		setError("");
	};

	const searchData = (searchValue: string, demo = false) => {
		if (searchValue) {
			let nextType = "";
			setHashOrAddress(searchValue);

			if (isValidEthHash(searchValue) && ETH_ENABLED) {
				nextType = ResourceTypeEnum.ETH;
			} else if (isValidTxHash(searchValue)) {
				nextType = ResourceTypeEnum.HASH;
			} else if (isValidAddress(searchValue)) {
				nextType = ResourceTypeEnum.ADDRESS;
			} else {
				setError(formatMessage(messages.search_error));
			}

			setType(nextType as ResourceTypeEnum);
			setIsDemo(demo);

			if (nextType) {
				setActiveTab(ContentEnum.REPORT);
				navigate({
					[queryVars.search]: `?${queryVars.value}=${searchValue}&${queryVars.type}=${nextType}`,
				});
			}
		}
	};

	const toggleLoading = (v: boolean) => {
		if (v !== loading) {
			setLoading(v);

			if (!v && isAuthenticated) {
				loadBalances();
			}
		}
	};

	const loadDemoReport = () => {
		if (reportInfo?.demo?.length) {
			setSearchFieldValue(reportInfo?.demo[0], (v) => {
				searchData(v, true);
			});
		}
	};

	const getContent = (tab: ContentEnum) => {
		switch (tab) {
			case ContentEnum.REPORT:
				if (type) {
					return (
						<Reports
							hashOrAddress={hashOrAddress}
							type={type as ResourceTypeEnum}
							toggleLoading={toggleLoading}
							demo={isDemo}
						/>
					);
				}

				return reportInfo?.demo?.length && reportInfo?.demo[0] ? (
					<div className={styles.empty}>
						<span>{formatMessage(messages.type_address_or_transaction_hash)}</span>
						<button type="button" name="load-demo-report" onClick={loadDemoReport}>
							{formatMessage(messages.click_here_to_load_demo_report)}
						</button>
					</div>
				) : null;

			case ContentEnum.COMPLETED_REPORTS:
				return <CompletedReports />;
			default:
				return null;
		}
	};

	const handleTabClick = (name: string) => {
		setActiveTab(name as ContentEnum);
	};

	return (
		<div className={styles.wrapper}>
			<PageHeader>
				<PageHeaderContent>
					<div className={styles.header}>
						<h1>{formatMessage(messages.page_title)}</h1>
						<span>{formatMessage(messages.page_subtitle)}</span>
					</div>
				</PageHeaderContent>
				<PageHeaderNav>
					{!isAuthenticated && (
						<InternalLink
							to={routes.login.redirect(pathname)}
							className={styles.search_block_login}
						>
							<i className="ai ai-locked" />
							<span>{formatMessage(messages.please_login_to_coplete_check)}</span>
						</InternalLink>
					)}
					<div className={styles.search_block}>
						<SearchInput
							placeholder={formatMessage(messages.search_input_placeholder)}
							value={searchFieldValue}
							onChange={handleSearchInputChange}
							error={error}
							onEnter={() => searchData(searchFieldValue)}
							inputFocus={isAuthenticated}
						/>
						<CurrencySelect
							onSelectChange={() => {
								console.log(1);
							}}
							options={[BTCOption]}
							value={BTCOption}
							autoFocus
						/>
						<div className={styles.fee_info}>
							<div className={styles.fee}>
								{formatMessage(messages.check_fee)} - {reportInfo?.price ?? "--"}&nbsp;
								{reportInfo?.currency_id ?? "USDT"}
							</div>
							<div>
								<div className={styles.balance_label}>{formatMessage(messages.your_balance)}:</div>
								<div className={styles.balance}>
									{formatNumber(totalBalance?.USDT ?? 0, FORMAT_NUMBER_OPTIONS_USDT)} USDT
								</div>
							</div>
						</div>
						<Button
							label={formatMessage(messages.check)}
							fullWidth
							disabled={!searchFieldValue}
							onClick={() => searchData(searchFieldValue)}
							isLoading={loading}
						/>
					</div>
					{isAuthenticated ? (
						<div className={styles.sections_nav}>
							<Tabs className={styles.sections_nav_tabs}>
								<Tab
									name={ContentEnum.REPORT}
									onClick={handleTabClick}
									isActive={activeTab === ContentEnum.REPORT}
									disabled={loading}
								>
									{formatMessage(messages.report)}
								</Tab>
								<Tab
									name={ContentEnum.COMPLETED_REPORTS}
									onClick={handleTabClick}
									isActive={activeTab === ContentEnum.COMPLETED_REPORTS}
									disabled={loading}
								>
									{formatMessage(messages.completed_checks)}
								</Tab>
							</Tabs>
						</div>
					) : null}
				</PageHeaderNav>
			</PageHeader>
			{getContent(activeTab)}
		</div>
	);
};

export default observer(MonitoringRootComponent);

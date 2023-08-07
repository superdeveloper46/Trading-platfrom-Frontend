import React from "react";
import dayjs from "dayjs";
import { useIntl } from "react-intl";
import cn from "classnames";

import competitionsMessages from "messages/competitions";
import commonMessages from "messages/common";
import styles from "styles/pages/CompetitionsDetails.module.scss";
import { queryVars } from "constants/query";
import { ICompetition } from "types/competitions";
import InternalLink from "components/InternalLink";
import { useMst } from "models/Root";
import { routes } from "constants/routing";

interface IProps {
	competition?: ICompetition;
}

const PageHeader: React.FC<IProps> = ({ competition }) => {
	const { formatMessage, formatNumber } = useIntl();

	const {
		global: { isAuthenticated },
	} = useMst();

	// finance: { totalBalances },
	const isStarted = competition
		? dayjs(dayjs.utc(competition.start_at)).isBefore(dayjs.utc(dayjs()))
		: false;
	const isActive: boolean = competition
		? dayjs(dayjs.utc(competition.end_at)).isAfter(dayjs.utc(dayjs()))
		: false;
	const isDemo = competition?.is_demo;

	const totalBalances = {} as any;

	const handleResetDemoBalance = (): void => {
		// dispatch(
		// 	showModal({
		// 		onClose: handleCloseModal,
		// 		component: <ResetDemoBalanceModal onClose={handleCloseModal} />,
		// 	}),
		// );
	};

	return (
		<div
			className={styles.header_container}
			style={{ backgroundImage: `url(${competition?.cover_image_svg})` }}
		>
			<div className={styles.header_content}>
				<div className={styles.header_info}>
					<div className={styles.status_list}>
						<div className={cn(styles.status_badge, { [styles.disabled]: !isActive })}>
							{formatMessage(isActive ? commonMessages.active : competitionsMessages.completed)}
						</div>
						{isActive && isDemo && (
							<span className={styles.status_badge}>
								{formatMessage(commonMessages.demo_terminal)}
							</span>
						)}
					</div>
					<h1 className={cn(styles.header_title, { [styles.isDemo]: isDemo })}>
						{competition?.name}
					</h1>
					<span className={cn(styles.header_subtitle, { [styles.isDemo]: isDemo })}>
						{competition?.slogan}
					</span>
				</div>
				<div className={styles.additional_info}>
					{isAuthenticated
						? isDemo && (
								<>
									<div className={styles.demo_balance_container}>
										<span>{formatMessage(competitionsMessages.total_demo_account_funds)}:</span>
										<div className={styles.demo_balance}>
											<div className={styles.demo_balance_currency}>
												<i className="ai ai-usd" />
												<span className={styles.demo_balance_sign}>D</span>
											</div>
											<span>
												{formatNumber(totalBalances?.USDTd ?? 0, {
													useGrouping: false,
													maximumFractionDigits: 2,
													minimumFractionDigits: 2,
												})}
												&nbsp;USDTd
											</span>
										</div>
									</div>
									<div className={styles.reset_demo_balance_container}>
										{isActive && (
											<button
												type="button"
												className={styles.reset_demo_balance_button}
												onClick={handleResetDemoBalance}
											>
												<i className="ai ai-mini_down" />
												<span>{formatMessage(competitionsMessages.reset_demo_balance)}</span>
											</button>
										)}
										<div className={styles.reset_demo_balance_info}>
											<i className="ai ai-warning" />
											{formatMessage(competitionsMessages.your_balance_will_be_reset)}
										</div>
									</div>
								</>
						  )
						: isActive &&
						  isStarted && (
								<div className={cn(styles.login_message_container, { [styles.isDemo]: isDemo })}>
									{formatMessage(
										competitionsMessages.to_participate_in_the_competition_you_must_sign_in_or_register,
										{
											login: (
												<InternalLink to={routes.login.root}>
													{formatMessage(competitionsMessages.sign_in)}
												</InternalLink>
											),
											register: (
												<InternalLink to={routes.register.root}>
													{formatMessage(competitionsMessages.register)}
												</InternalLink>
											),
										},
									)}
								</div>
						  )}
				</div>
			</div>
			{competition && isActive && isStarted ? (
				<div className={cn(styles.terminal_snack, { [styles.isDemo]: isDemo })}>
					<i className="ai ai-info_circle_outline" />
					{isDemo
						? formatMessage(competitionsMessages.competition_is_taking_place_in_demo_terminal, {
								terminal: (
									<InternalLink
										to={`/demo/BTCd_USDTd?${queryVars.layout}=advanced&${queryVars.type}=cross`}
									>
										{formatMessage(competitionsMessages.demo_terminal)}
									</InternalLink>
								),
						  })
						: formatMessage(
								competitionsMessages.the_contest_is_being_held_on_the_standard_terminal,
								{
									standard_terminal: (
										<InternalLink to={routes.trade.getPair("BTC_USDT")}>
											{formatMessage(competitionsMessages.standard_terminal)}
										</InternalLink>
									),
								},
						  )}
				</div>
			) : null}
		</div>
	);
};

export default PageHeader;

import React from "react";
import { useIntl } from "react-intl";
import homeMessages from "messages/home";
import userCount from "assets/images/home/user-count-400.svg";
import styles from "styles/pages/Home.module.scss";
import RegisterBlock from "./RegisterBlock";

const Stats: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<section className={styles.section}>
			<div className={styles.stats_container}>
				<img src={userCount} width="488" height="185" alt="user-count" loading="lazy" />
				<div className={styles.stats_user_count}>
					<span>{formatMessage(homeMessages.user_count_thousands)}</span>
					<span>{formatMessage(homeMessages.user_count)}</span>
				</div>
				<div className={styles.stats_list}>
					<div>
						<span>{formatMessage(homeMessages.stats_item_1)}</span>
						<span>
							{formatMessage(homeMessages.stats_item_1_desc, {
								breakingLine: <br />,
							})}
						</span>
					</div>
					<div>
						<span>{formatMessage(homeMessages.stats_item_2)}</span>
						<span>
							{formatMessage(homeMessages.stats_item_2_desc, {
								breakingLine: <br />,
							})}
						</span>
					</div>
					<div>
						<span>
							{formatMessage(homeMessages.stats_item_3, {
								count: 200,
							})}
						</span>
						<span>
							{formatMessage(homeMessages.stats_item_3_desc, {
								breakingLine: <br />,
							})}
						</span>
					</div>
					<div>
						<span>{formatMessage(homeMessages.stats_item_4)}</span>
						<span>
							{formatMessage(homeMessages.stats_item_4_desc, {
								breakingLine: <br />,
							})}
						</span>
					</div>
				</div>
				<h4>{formatMessage(homeMessages.start_trading)}</h4>
				<RegisterBlock name="email-advantages" />
			</div>
		</section>
	);
};

export default Stats;

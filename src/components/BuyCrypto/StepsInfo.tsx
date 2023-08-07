import React from "react";
import { useIntl } from "react-intl";
import cn from "classnames";
import { observer } from "mobx-react-lite";

import commonMessages from "messages/common";
import buyCryptoMessages from "messages/buy_crypto";
import financeMessages from "messages/finance";
import InternalLink from "components/InternalLink";
import styles from "styles/pages/Page.module.scss";
import { routes } from "constants/routing";
import { useMst } from "models/Root";

const StepsInfo: React.FC = () => {
	const { formatMessage } = useIntl();
	const {
		global: { isAuthenticated },
		account: { profileStatus },
	} = useMst();

	return (
		<div className={styles.section_container}>
			<span className={cn(styles.page_steps_title, styles.centered)}>
				{formatMessage(buyCryptoMessages.three_simple_steps)}
			</span>
			<div className={styles.page_steps}>
				<div
					className={cn(styles.page_step, styles.with_divider_line, {
						[styles.passed]: isAuthenticated,
					})}
				>
					<div
						className={cn(
							styles.page_step_icon,
							isAuthenticated ? styles.color_green : styles.color_blue,
						)}
					>
						<i className={`ai ai-${isAuthenticated ? "check_filled" : "avatar"}`} />
					</div>
					<span className={styles.page_step_title}>{formatMessage(commonMessages.register)}</span>
					<span className={styles.page_step_description}>
						{formatMessage(buyCryptoMessages.register_on_btc_alpha, {
							register: (
								<InternalLink to={routes.register.root} blank>
									{formatMessage(commonMessages.registerAction)}
								</InternalLink>
							),
						})}
					</span>
				</div>
				<div
					className={cn(styles.page_step, styles.with_divider_line, {
						[styles.passed]: (profileStatus?.verification_level ?? 0) > 0,
					})}
				>
					<div
						className={cn(
							styles.page_step_icon,
							(profileStatus?.verification_level ?? 0) > 0 ? styles.color_green : styles.color_blue,
						)}
					>
						<i
							className={`ai ai-${
								(profileStatus?.verification_level ?? 0) > 0 ? "check_filled" : "verification"
							}`}
						/>
					</div>
					<span className={styles.page_step_title}>
						{formatMessage(commonMessages.verification)}
					</span>
					<span className={styles.page_step_description}>
						{formatMessage(buyCryptoMessages.pass_verification_to_level, {
							verification: (
								<InternalLink to={routes.verification.root} blank>
									{formatMessage(financeMessages.verification)}
								</InternalLink>
							),
							level: 1,
						})}
					</span>
				</div>
				<div className={cn(styles.page_step, styles.with_divider_line)}>
					<div className={styles.page_step_icon}>
						<i className="ai ai-credit_card" />
					</div>
					<span className={styles.page_step_title}>{formatMessage(buyCryptoMessages.buy)}</span>
					<span className={styles.page_step_description}>
						{formatMessage(buyCryptoMessages.from_your_bank_card)}
					</span>
				</div>
			</div>
		</div>
	);
};

export default observer(StepsInfo);

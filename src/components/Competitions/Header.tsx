import * as React from "react";
import { useIntl } from "react-intl";
import cn from "classnames";

import competitionsMessages from "messages/competitions";
import styles from "styles/pages/Competitions.module.scss";
import pageStyles from "styles/pages/Page.module.scss";
import { useMst } from "models/Root";
import InternalLink from "components/InternalLink";
import Button from "components/UI/Button";
import { routes } from "constants/routing";

const Header: React.FC = () => {
	const {
		global: { isAuthenticated },
	} = useMst();
	const { formatMessage } = useIntl();

	return (
		<div className={cn(styles.header_container, pageStyles.header_container)}>
			<div className={cn(styles.content, pageStyles.header_content)}>
				<div className={styles.focus_container}>
					<h1>{formatMessage(competitionsMessages.trading_competition)}</h1>
					<h2>{formatMessage(competitionsMessages.take_part_in_the_competition)}</h2>
				</div>
				{!isAuthenticated && (
					<div className={pageStyles.buttons_group}>
						<InternalLink to={routes.register.root}>
							<Button
								variant="filled"
								mini
								fullWidth
								color="quaternary"
								label={formatMessage(competitionsMessages.register_for_participation)}
							/>
						</InternalLink>
						<InternalLink to={routes.login.root}>
							<Button
								variant="text"
								color="primary"
								fullWidth
								label={formatMessage(competitionsMessages.or_log_in)}
								mini
							/>
						</InternalLink>
					</div>
				)}
			</div>
		</div>
	);
};

export default Header;

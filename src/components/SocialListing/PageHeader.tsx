import React from "react";
import { useIntl } from "react-intl";
import messages from "messages/listing";
import commonMessages from "messages/common";
import logoDark from "assets/images/listing/logo-dark.svg";
import logoLight from "assets/images/listing/logo-light.svg";
import cn from "classnames";
import stylesPage from "styles/pages/Page.module.scss";
import styles from "styles/pages/SocialListing.module.scss";
import { useMst } from "models/Root";
import { observer } from "mobx-react-lite";
import Button from "components/UI/Button";
import InternalLink from "../InternalLink";

const PageHeader: React.FC = () => {
	const {
		global: { theme },
	} = useMst();
	const { formatMessage } = useIntl();

	return (
		<div className={stylesPage.header_container}>
			<div className={cn(stylesPage.header_content, styles.header_content)}>
				<img
					className={stylesPage.header_image}
					src={theme === "light" ? logoLight : logoDark}
					alt={formatMessage(messages.social_listing_header)}
					width="228"
					height="116"
				/>
				<div className={stylesPage.header_focus_container}>
					<h1>{formatMessage(messages.social_listing_header)}</h1>
					<h2>
						{formatMessage(messages.social_listing_desc, {
							ref: (
								<InternalLink to="/news/btc-alpha-integrates-alpha-listing-coin-alc-is?utm_source=sociallisting&utm_medium=button&utm_campaign=more">
									{formatMessage(commonMessages.more)}
								</InternalLink>
							),
						})}
					</h2>
					<a
						href="https://docs.google.com/forms/d/e/1FAIpQLSd0DneqGO3okuRojpiwinPQ0AudnNBPOLOj50Z9H-5C-Xy_UQ/viewform"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button
							iconAlign="left"
							iconCode="listing"
							label={formatMessage(messages.social_listing_offer_btn)}
							variant="filled"
							color="secondary"
							mini
						/>
					</a>
				</div>
			</div>
		</div>
	);
};

export default observer(PageHeader);

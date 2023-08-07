import React from "react";
import { useIntl } from "react-intl";
import stakingMessages from "messages/staking";
import headerIcons from "assets/images/staking/header-icons.png";
import stylesPage from "styles/pages/Page.module.scss";
import stylesStaking from "styles/pages/Staking.module.scss";
import cn from "classnames";

const PageHeader: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<div className={cn(stylesPage.header_container, stylesStaking.header_container)}>
			<div className={stylesPage.header_content}>
				<img
					className={stylesPage.header_image}
					src={headerIcons}
					alt="Alpha Staking"
					width="228"
					height="116"
				/>
				<div className={stylesPage.header_focus_container}>
					<h1>{formatMessage(stakingMessages.title)}</h1>
					<h2>{formatMessage(stakingMessages.page_subtitle)}</h2>
				</div>
			</div>
		</div>
	);
};

export default PageHeader;

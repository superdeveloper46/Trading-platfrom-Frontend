import React from "react";
import MainLayout from "layouts/MainLayout";
import { Helmet } from "react-helmet";
import styles from "styles/pages/CharityUA.module.scss";
import { useIntl } from "react-intl";
import { getPageTitle } from "helpers/global";
import messages from "messages/charityUA";
import CharityForm from "components/CharityUA/CharityForm";

const CharityUA: React.FC = () => {
	const { formatMessage } = useIntl();
	const title = getPageTitle(formatMessage(messages.alpha_for_ukraine));

	return (
		<MainLayout>
			<Helmet title={title} meta={[{ name: "description", content: title }]} />
			<div className={styles.wrapper}>
				<div className={styles.flag} />
				<div className={styles.container}>
					<CharityForm />
					<a
						href="https://bank.gov.ua/ua/news/all/natsionalniy-bank-vidkriv-spetsrahunok-dlya-zboru-koshtiv-na-potrebi-armiyi"
						target="_blank"
						rel="noopener noreferrer"
					>
						<i className="ai ai-info_outlined" />
						&nbsp;
						{formatMessage(messages.contributions_in_fiat)}&nbsp;
					</a>
				</div>
			</div>
		</MainLayout>
	);
};

export default CharityUA;

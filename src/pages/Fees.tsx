import React from "react";
import MainLayout from "layouts/MainLayout";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import styles from "styles/pages/FeesWithdrawDeposit.module.scss";
import messages from "messages/fees_trading";
import DepositWithDrawFees from "components/FeesWithdrawDeposit/DepositWithdrawFees";
import { getPageTitle } from "helpers/global";
import { PageHeader, PageHeaderContent } from "components/UI/Page";

const Fees: React.FC = () => {
	const { formatMessage } = useIntl();
	const title = getPageTitle(formatMessage(messages.fees));

	return (
		<MainLayout>
			<Helmet
				title={title}
				meta={[
					{ name: "description", content: title },
					{ property: "og:title", content: title },
					{ property: "twitter:title", content: title },
					{ property: "og:description", content: title },
					{ name: "twitter:description", content: title },
				]}
			/>
			<div className={styles.container}>
				<PageHeader>
					<PageHeaderContent masked>
						<h1>{formatMessage(messages.fees)}</h1>
					</PageHeaderContent>
				</PageHeader>
				<DepositWithDrawFees />
			</div>
		</MainLayout>
	);
};

export default Fees;

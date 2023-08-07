import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";

import OrderCreateForm from "components/P2P/OrderCreate/OrderCreateForm";
import TradingRequirementsModal from "components/P2P/modals/TradingRequirementsModal";
import styles from "styles/pages/P2P/OrderCreate.module.scss";
import { useMst } from "models/Root";
import LoadingSpinner from "components/UI/LoadingSpinner";
import p2pMessages from "messages/p2p";

const OrderCreate = () => {
	const { formatMessage } = useIntl();

	const title = `P2P ${formatMessage(p2pMessages.post_new_ad)} | ALP.COM`;

	const {
		account: { profileStatus, isProfileStatusLoaded },
	} = useMst();

	const [isRequirementsModalOpened, toggleRequirementsModal] = useState(false);

	useEffect(() => {
		if (isProfileStatusLoaded) {
			toggleRequirementsModal(
				Boolean(profileStatus && !profileStatus.p2p_terms_accepted) ||
					!profileStatus?.two_factor_enabled ||
					!profileStatus?.username ||
					profileStatus.verification_level === 0,
			);
		}

		return () => toggleRequirementsModal(false);
	}, [profileStatus?.p2p_terms_accepted, isProfileStatusLoaded]);

	return (
		<div className={styles.container}>
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
			{isProfileStatusLoaded ? (
				<>
					<OrderCreateForm />
					<TradingRequirementsModal
						disableClose
						isOpen={isRequirementsModalOpened}
						onClose={() => toggleRequirementsModal(false)}
					/>
				</>
			) : (
				<LoadingSpinner />
			)}
		</div>
	);
};

export default OrderCreate;

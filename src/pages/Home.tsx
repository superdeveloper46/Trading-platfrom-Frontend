import React, { useEffect } from "react";
import { useMst } from "models/Root";
import { SkeletonTheme } from "react-loading-skeleton";
import { observer } from "mobx-react-lite";
import LandingLayout from "layouts/LandingLayout";
import { Helmet } from "react-helmet";
import styles from "styles/pages/Home.module.scss";
import messages from "messages/home";
import {
	Welcome,
	Advantages,
	TopPairs,
	MobileApp,
	Payment,
	Steps,
	Stats,
	AlphaCode,
	MediaPartners,
} from "components/Home";
import { useIntl } from "react-intl";

const Home: React.FC = () => {
	const { render } = useMst();
	const { formatMessage } = useIntl();
	const title = formatMessage(messages.page_title);

	useEffect(() => {
		document.body.setAttribute("data-v", "");
		setTimeout(() => {
			document.body.setAttribute("data-v", "theme");
		});

		return () => {
			document.body.removeAttribute("data-v");
		};
	}, []);

	return (
		<LandingLayout>
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
			<SkeletonTheme baseColor="#19062f" highlightColor="#230446">
				<div className={styles.container}>
					<Welcome />
					<TopPairs />
					{render.mobileApp && <MobileApp />}
					{render.paymentServices && <Payment />}
					{render.buyCrypto && <Steps />}
					{render.alphaCode && <AlphaCode />}
					<Advantages />
					{render.homeStats && <Stats />}
					<MediaPartners />
				</div>
			</SkeletonTheme>
		</LandingLayout>
	);
};

export default observer(Home);

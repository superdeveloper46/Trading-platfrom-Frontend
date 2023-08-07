import React from "react";
import MainLayout from "layouts/MainLayout";
import { Helmet } from "react-helmet";
import styles from "styles/pages/Halving.module.scss";

const Halving: React.FC = () => (
	<MainLayout>
		<Helmet>
			<title>Halving</title>
			<meta name="description" content="Halving" />
		</Helmet>
		<div className={styles.container}>{/* TODO */}</div>
	</MainLayout>
);

export default Halving;

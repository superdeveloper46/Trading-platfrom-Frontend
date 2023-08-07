import React from "react";
import cn from "classnames";
import Footer from "components/Footer";
import Header from "components/Header";
import Cookies from "components/Cookies";
// import MarketBanner from "components/MarketBanner";

interface IProps {
	isExchange?: boolean;
	colorPrimary?: boolean;
}

const MainLayout: React.FC<IProps> = ({ children, colorPrimary, isExchange }) => (
	<>
		{/* <MarketBanner /> */}
		<Header isExchange={isExchange} />
		<div className={cn("layout", colorPrimary && "primary")}>{children}</div>
		<Footer />
		<Cookies />
	</>
);

export default MainLayout;

import React from "react";
import Footer from "components/Footer";
import Header from "components/Header";
import Cookies from "components/Cookies";

interface IProps {
	mobile?: boolean;
}

const TerminalLayout: React.FC<IProps> = ({ children, mobile }) => (
	<>
		<Header isExchange />
		<div className="layout">{children}</div>
		{!mobile && <Footer />}
		<Cookies />
	</>
);

export default TerminalLayout;

import React from "react";
import Footer from "components/Footer";
import Header from "components/Header";
import Cookies from "components/Cookies";

const LandingLayout: React.FC = ({ children }) => (
	<>
		<Header isLanding />
		{children}
		<Footer isLanding />
		<Cookies />
	</>
);

export default LandingLayout;

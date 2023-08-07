import React from "react";
import Header from "components/Header";
import Cookies from "components/Cookies";

const AuthLayout: React.FC = ({ children }) => (
	<>
		<Header />
		<div className="layout">{children}</div>
		<Cookies />
	</>
);

export default AuthLayout;

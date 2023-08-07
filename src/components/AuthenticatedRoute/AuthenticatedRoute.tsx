import React from "react";
import { useMst } from "models/Root";
import { Navigate, RouteProps, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";

// @ts-ignore
const AuthenticatedRoute: React.FC<RouteProps> = ({ children }) => {
	const {
		global: { isAuthenticated, locale },
	} = useMst();
	const { pathname } = useLocation();

	if (!isAuthenticated) {
		return <Navigate to={`/${locale}/login${pathname ? `?redirect=${pathname}` : ""}`} />;
	}

	return children;
};

export default observer(AuthenticatedRoute);

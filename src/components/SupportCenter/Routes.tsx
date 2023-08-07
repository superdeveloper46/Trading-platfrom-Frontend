import React from "react";
import { Route, Routes } from "react-router-dom";
import { observer } from "mobx-react-lite";

import SearchPage from "components/SupportCenter/SearchPage";
import NotFound from "pages/NotFound";
import RootPage from "components/SupportCenter/RootPage";
import NewsPage from "components/SupportCenter/NewsPage";
import ArticlePage from "components/SupportCenter/ArticlePage";
import RequestPage from "components/SupportCenter/RequestPage";
import { useMst } from "models/Root";
import { URL_VARS } from "constants/routing";

const Router = () => {
	const { render } = useMst();

	return (
		<Routes>
			{render.supportCenter && (
				<>
					<Route path={URL_VARS.SEARCH} element={<SearchPage />} />
					<Route path={URL_VARS.NEWS} element={<NewsPage />} />
					<Route path={`:${URL_VARS.SLUG}`} element={<ArticlePage />} />
					<Route path={URL_VARS.ROOT} element={<RootPage />} />
				</>
			)}
			<Route path={URL_VARS.REQUEST} element={<RequestPage />} />
			<Route element={<NotFound />} />
		</Routes>
	);
};

export default observer(Router);

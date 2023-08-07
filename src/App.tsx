import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { observer } from "mobx-react-lite";
import { QueryClient, QueryClientProvider } from "react-query";
import { SkeletonTheme } from "react-loading-skeleton";
import { useLocation } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeEnum } from "types/theme";
import { useMst } from "models/Root";
import config from "helpers/config";
import useSalesDoubler from "hooks/useSalersDoubler";
import Router from "./Router";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
		},
	},
});

console.log(
	"%cThis browser feature is for developers. If someone told you to write here any data, they are scammers. If you paste data, you will give scammers access to your account.",
	"font-size: 26px; color: #bada55",
);

const App: React.FC = () => {
	const { global, account, notifications, render } = useMst();
	const { pathname } = useLocation();
	const salesDoubler = useSalesDoubler();

	const zoomDisable = (e: Event) => {
		e.preventDefault();
		// @ts-ignore
		document.body.style.zoom = 1;
	};

	useEffect(() => {
		global.loadDepartmentInfo();

		if (config.salesDoubler) {
			salesDoubler.sendRegister();
		}

		document.addEventListener("gesturestart", zoomDisable);
		document.addEventListener("gesturechange", zoomDisable);
		document.addEventListener("gestureend", zoomDisable);
	}, []);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	useEffect(() => {
		if (global.isAuthenticated) {
			account.loadBalances();
			account.loadProfileStatus();
			notifications.loadLatestNotifications();
			if (render.welcomeBonus) {
				// promo.loadPromo();
			}
		}
	}, [global.isAuthenticated]);

	useEffect(() => {
		document.body.setAttribute("data-theme", global.theme);
		document
			.querySelector('meta[name="theme-color"]')
			?.setAttribute("content", global.theme === ThemeEnum.Dark ? "#1a1c1f" : "#ffffff");
	}, [global.theme]);

	return (
		<main>
			<Helmet htmlAttributes={{ lang: global.locale }} />
			<QueryClientProvider client={queryClient}>
				<SkeletonTheme
					baseColor="var(--skeleton-base-color)"
					highlightColor="var(--skeleton-highlight-color)"
				>
					<Router />
				</SkeletonTheme>
			</QueryClientProvider>
			<ToastContainer
				position="bottom-left"
				autoClose={5000}
				hideProgressBar
				transition={Slide}
				newestOnTop={false}
				closeOnClick
				theme={global.theme === "dark" ? "dark" : "light"}
			/>
		</main>
	);
};

export default observer(App);

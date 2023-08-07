import React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import LanguageProvider from "providers/LanguageProvider";
import { Provider, rootStore } from "models/Root";
import ReactGA from "react-ga";
import config from "helpers/config";
import App from "./App";
import "./index.scss";

if (config.gaID) {
	ReactGA.initialize(config.gaID);
}

const root = ReactDOM.createRoot(document.getElementById("root") ?? document.createElement("div"));
root.render(
	<Provider value={rootStore}>
		<BrowserRouter>
			<LanguageProvider>
				<App />
			</LanguageProvider>
		</BrowserRouter>
	</Provider>,
);

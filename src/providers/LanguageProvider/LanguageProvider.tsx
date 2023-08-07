import React, { useEffect, useState } from "react";
import dayjs from "utils/dayjs";
import { observer } from "mobx-react-lite";
import { IntlProvider, MessageFormatElement } from "react-intl";
import { useMst } from "models/Root";
import cookie from "js-cookie";
import { CONTENT_LOCALE_CACHE_KEY } from "utils/cacheKeys";
import { translationMessages } from "./i18n";

export function changeContentLocale(locales: string[]) {
	cookie.set(CONTENT_LOCALE_CACHE_KEY, locales.join("+"), { expires: 365 });
}

const LanguageProvider: React.FC = ({ children }) => {
	const [messages, setMessages] = useState<Record<string, Record<string, MessageFormatElement[]>>>(
		{},
	);

	const { global } = useMst();

	const refreshLocale = () => {
		const { pathname } = window.location;
		const splittedPath = pathname.split("/");
		const nextLocale = splittedPath[1];

		if (nextLocale !== global.locale) {
			// TODO: UPDATE PROFILE LANGUAGE
		}
	};

	useEffect(() => {
		window.onpopstate = refreshLocale;
	}, []);

	useEffect(() => {
		translationMessages(global.locale).then(
			(nextMessages: Record<string, MessageFormatElement[]> | any) => {
				setMessages(nextMessages);
				dayjs.locale(global.locale);
			},
		);
	}, [global.locale]);

	const intlErrorHandler = () => {
		//
	};

	return (
		<IntlProvider
			locale={global.locale}
			key={global.locale}
			messages={messages[global.locale]}
			onError={intlErrorHandler}
		>
			{React.Children.only(children)}
		</IntlProvider>
	);
};

export default observer(LanguageProvider);

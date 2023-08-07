export interface IAppLocale {
	name: string;
	value: string;
}

export const appLocales: IAppLocale[] = [
	{ name: "English", value: "en" },
	{ name: "Русский", value: "ru" },
	{ name: "Deutsch", value: "de" },
	{ name: "Español", value: "es" },
	{ name: "Français", value: "fr" },
	{ name: "हिन्दी", value: "hi" },
	{ name: "Portugal", value: "pt" },
	{ name: "Türkçe", value: "tr" },
	{ name: "简体中文", value: "zh" },
	{ name: "Українська", value: "uk" },
];

export const defaultLocale = "en";

export const availableLocales = appLocales.map((i) => i.value);

export const translationMessages = async (locale: string) => {
	const values: Record<string, unknown> = {};

	return Promise.all([import(/* webpackChunkName: `locale` */ `../../lang/${locale}.json`)])
		.then((locales) => {
			values[locale] = locales[0].default;

			return values;
		})
		.catch((err) => Error(`Error while fetching locale data: ${err}`));
};

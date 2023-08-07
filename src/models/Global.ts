import cache from "helpers/cache";
import cookies from "js-cookie";
import config from "helpers/config";
import { applySnapshot, getSnapshot, Instance, cast, types as t } from "mobx-state-tree";
import { availableLocales, defaultLocale } from "providers/LanguageProvider/i18n";
import { ThemeEnum } from "types/theme";
import { LOCALE_CACHE_KEY, THEME_CACHE_KEY, CONTENT_LOCALE_CACHE_KEY } from "utils/cacheKeys";
import { flow } from "mobx";
import errorHandler from "utils/errorHandler";
import ProfileSettingService from "services/ProfileSettingService";
import DepartmentService from "services/DepartmentService";

const deviceTheme =
	window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
		? ThemeEnum.Dark
		: ThemeEnum.Light;

const Department = t.model({
	app_name: t.optional(t.maybeNull(t.string), ""),
	base_url: t.optional(t.maybeNull(t.string), ""),
	code: t.optional(t.maybeNull(t.string), ""),
	label: t.optional(t.maybeNull(t.string), ""),
	support_email: t.optional(t.maybeNull(t.string), ""),
	logo_dark_svg: t.optional(t.maybeNull(t.string), ""),
	logo_home_svg: t.optional(t.maybeNull(t.string), ""),
	logo_white_svg: t.optional(t.maybeNull(t.string), ""),
});

export interface IDepartment extends Instance<typeof Department> {}

export const Global = t
	.model({
		theme: t.optional(t.string, cache.getItem(THEME_CACHE_KEY, deviceTheme)),
		locale: t.optional(t.string, cache.getItem(LOCALE_CACHE_KEY, defaultLocale)),
		contentLocale: t.optional(t.string, cache.getItem(CONTENT_LOCALE_CACHE_KEY, "")),
		isAuthenticated: t.optional(t.boolean, !!cookies.get(config.sessionCookieName)),
		isWSDown: t.optional(t.boolean, false),
		department: t.optional(Department, {}),
	})
	.views((self) => ({
		get logoPath() {
			return (
				(self.theme === ThemeEnum.Light
					? self.department.logo_dark_svg
					: self.department.logo_white_svg) ?? ""
			);
		},
		get logoPathHome() {
			return self.department.logo_home_svg ?? "";
		},
	}))
	.actions((self) => {
		const initialState = getSnapshot(self);
		return {
			resetState() {
				applySnapshot(self, initialState);
			},
		};
	})
	.actions((self) => ({
		setTheme(nextTheme: string) {
			self.theme = nextTheme;
			cache.setItem(THEME_CACHE_KEY, nextTheme);
		},
		setContentLocale(nextLocaleContent: string) {
			self.contentLocale = nextLocaleContent;
			cache.setItem(CONTENT_LOCALE_CACHE_KEY, nextLocaleContent);
		},
		setIsWSDown(nextIsDown: boolean) {
			self.isWSDown = nextIsDown;
		},
		setIsAuthenticated(nextIsAuthenticated: boolean) {
			self.isAuthenticated = nextIsAuthenticated;
		},
		setDepartment(nextDepartment: IDepartment) {
			self.department = cast(nextDepartment);
		},
	}))
	.actions((self) => ({
		setLocale: flow(function* (nextLocale: string) {
			try {
				if (availableLocales.includes(nextLocale)) {
					self.locale = nextLocale;
					cache.setItem(LOCALE_CACHE_KEY, nextLocale);

					if (self.isAuthenticated) {
						yield ProfileSettingService.changeLocale(nextLocale);
					}
				}
			} catch (err) {
				errorHandler(err);
			}
		}),
		loadDepartmentInfo: flow(function* () {
			try {
				const data = yield DepartmentService.getDepartmentInfo();
				self.setDepartment(data);
			} catch (err) {
				errorHandler(err);
			}
		}),
	}));

export type IGlobal = Instance<typeof Global>;

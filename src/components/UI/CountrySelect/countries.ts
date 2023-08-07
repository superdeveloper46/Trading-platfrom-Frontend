// @ts-nocheck
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en";
import de from "i18n-iso-countries/langs/de";
import ru from "i18n-iso-countries/langs/ru";
import es from "i18n-iso-countries/langs/es";
import fr from "i18n-iso-countries/langs/fr";
import hi from "i18n-iso-countries/langs/hi";
import pt from "i18n-iso-countries/langs/pt";
import tr from "i18n-iso-countries/langs/tr";
import uk from "i18n-iso-countries/langs/uk";
import zh from "i18n-iso-countries/langs/zh";

countries.registerLocale(en);
countries.registerLocale(de);
countries.registerLocale(ru);
countries.registerLocale(es);
countries.registerLocale(fr);
countries.registerLocale(hi);
countries.registerLocale(pt);
countries.registerLocale(tr);
countries.registerLocale(uk);
countries.registerLocale(zh);

export default (locale) => countries.getNames(locale);

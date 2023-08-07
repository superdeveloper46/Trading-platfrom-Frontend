export const isSafari =
	navigator.userAgent.indexOf("Safari") !== -1 && navigator.userAgent.indexOf("Chrome") === -1;

export const isAndroid = navigator.userAgent.toLowerCase().indexOf("android") !== -1;
export const isIOS =
	navigator.userAgent.toLowerCase().indexOf("ipod") !== -1 ||
	navigator.userAgent.toLowerCase().indexOf("iphone") !== -1 ||
	navigator.userAgent.toLowerCase().indexOf("ipad") !== -1;

export const removeCaptchaBadge = () => {
	const badge = document.getElementsByClassName("grecaptcha-badge")[0];
	if (badge && badge instanceof HTMLElement) {
		badge.remove();
	}
};

export const disableDocumentScroll = () => {
	document.body.style.overflow = "hidden";
	document.documentElement.style.overflow = "hidden";
};

export const enableDocumentScroll = () => {
	document.body.style.overflow = "auto";
	document.documentElement.style.overflow = "auto";
};

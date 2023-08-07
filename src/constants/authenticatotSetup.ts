import { EventArgs } from "react-ga";

export const ReactGaOpenArgs: EventArgs = {
	category: "Security",
	action: "setup2fa:open",
	label: "Open 2fa setup",
	nonInteraction: false,
};

export const ReactGaQrCodeArgs: EventArgs = {
	category: "Security",
	action: "setup2fa:qrcode",
	label: "Open 2fa qrcode",
	nonInteraction: false,
};

export const ReactGaFormArgs: EventArgs = {
	category: "Security",
	action: "setup2fa:form",
	label: "Open 2fa form",
	nonInteraction: false,
};

export const ReactGaCompleteArgs: EventArgs = {
	category: "Security",
	action: "setup2fa:complete",
	label: "Complete 2fa setup",
	nonInteraction: false,
};

import { LocaleEnum } from "./shell";

interface ISocialNetwork {
	link: string;
	icon: string;
	label: string;
}

export const socialNetworks = (locale = "en"): ISocialNetwork[] => [
	{
		link: "https://twitter.com/alpcom_?s=21&t=PLTJFpnoKiP6Lst4iPsC3A",
		label: "Twitter",
		icon: "twitter",
	},
	{
		link: "https://instagram.com/alp.com_ua?igshid=YmMyMTA2M2Y=",
		label: "Instagram",
		icon: "instagram",
	},
];

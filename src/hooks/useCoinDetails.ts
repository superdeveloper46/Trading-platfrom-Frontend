import { url } from "inspector";
import { useEffect, useState } from "react";
import { IMarketCapCoinInfo } from "types/coinmarketcap";

export interface ICoinDetailLink {
	title: string;
	icon: string;
	links: string[];
}

export const useCoinDetails = (coinInfo?: IMarketCapCoinInfo) => {
	const [coinLinks, setCoinLinks] = useState<ICoinDetailLink[]>([]);

	useEffect(() => {
		processLinks();
	}, [coinInfo]);

	const processLinks = () => {
		if (coinInfo === undefined || coinInfo.urls === undefined) return;
		const urls = coinInfo.urls;
		setCoinLinks((links) => {
			links = [];
			if (urls.facebook && urls.facebook.length !== 0) {
				links.push({ title: "Facebook", icon: "facebook", links: [...urls.facebook] });
			}

			if (urls.announcement && urls.announcement.length !== 0) {
				links.push({ title: "Announcements", icon: "", links: [...urls.announcement] });
			}

			if (urls.chat && urls.chat.length !== 0) {
				links.push({ title: "Chat", icon: "chat", links: [...urls.chat] });
			}

			if (urls.message_board && urls.message_board.length !== 0) {
				links.push({
					title: "Message Board",
					icon: "message_circle",
					links: [...urls.message_board],
				});
			}

			if (urls.reddit && urls.reddit.length !== 0) {
				links.push({ title: "Reddit", icon: "reddit", links: [...urls.reddit] });
			}

			if (urls.source_code && urls.source_code.length !== 0) {
				links.push({ title: "Source Code", icon: "api", links: [...urls.source_code] });
			}

			if (urls.technical_doc && urls.technical_doc.length !== 0) {
				links.push({ title: "Technical Doc", icon: "dok_empty", links: [...urls.technical_doc] });
			}

			if (urls.twitter && urls.twitter.length !== 0) {
				links.push({ title: "Twitter", icon: "twitter", links: [...urls.twitter] });
			}

			if (urls.website && urls.website.length !== 0) {
				links.push({ title: "Website", icon: "web_link", links: [...urls.website] });
			}

			return links;
		});
	};

	return {
		coinLinks,
	};
};

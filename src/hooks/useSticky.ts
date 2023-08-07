import { useEffect, useState } from "react";

export const useSticky = (pixelHeight?: number) => {
	const [isSticky, setSticky] = useState<boolean>();

	useEffect(() => {
		window.addEventListener("scroll", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
		};
	});

	const onScroll = () => setSticky(window.scrollY >= (pixelHeight ?? 250));

	return {
		isSticky,
	};
};

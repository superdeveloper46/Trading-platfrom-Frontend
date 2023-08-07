import React, { useCallback, useEffect, useRef, useState } from "react";
import cookies from "js-cookie";
import styles from "styles/components/MarketBanner.module.scss";
import Slider from "react-slick";

import staking_mobile_en from "assets/images/banners/staking/320_EN.png";
import staking_mobile_ru from "assets/images/banners/staking/320_RU.png";
import staking_tablet_en from "assets/images/banners/staking/780_EN.png";
import staking_tablet_ru from "assets/images/banners/staking/780_RU.png";
import staking_desktop_en from "assets/images/banners/staking/1100_EN.png";
import staking_desktop_ru from "assets/images/banners/staking/1100_RU.png";

import { useMst } from "models/Root";
import { observer } from "mobx-react-lite";
import useWindowSize from "hooks/useWindowSize";
import config from "helpers/config";

interface IBannerLink {
	url: any;
	internal: boolean;
}

interface IBannerImage {
	desktop: string;
	tablet: string;
	mobile: string;
}

interface IBanner {
	id: number;
	link: IBannerLink;
	background: string;
	images: Record<string, IBannerImage>;
}

const banners: IBanner[] = [
	{
		id: 1,
		link: {
			url: "staking",
			internal: true,
		},
		background: "#fdcb7c",
		images: {
			ru: {
				desktop: staking_desktop_ru,
				tablet: staking_tablet_ru,
				mobile: staking_mobile_ru,
			},
			en: {
				desktop: staking_desktop_en,
				tablet: staking_tablet_en,
				mobile: staking_mobile_en,
			},
		},
	},
];

const usePreviousSlide = (slide: number | null) => {
	const ref = useRef<number | null>(null);
	useEffect(() => {
		ref.current = slide;
	});
	return ref.current;
};

const SLIDE_INTERVAL = 10000;

const MarketBanner: React.FC = () => {
	const {
		global: { locale },
	} = useMst();
	const { mobile, width } = useWindowSize();
	const [progress, setProgress] = useState<number>(0);
	const [showBanner, setShowBanner] = useState<boolean>(!cookies.get("adv_v14"));
	const [currentSlide, setCurrentSlide] = useState<number>(0);
	const prevCurrentSlide = usePreviousSlide(currentSlide);
	const sliderRef = useRef<Slider>(null);
	const timeoutRef = useRef<NodeJS.Timeout>(null);

	const handleSliderState = useCallback((_, nextIndex) => {
		setCurrentSlide(nextIndex);
		setProgress(0);
	}, []);

	const renderDots = useCallback(
		(dots: any) => (
			<div>
				{mobile ? (
					<ul className="custom-slick-dots">{dots}</ul>
				) : (
					<ul className="custom-slick-dots">
						{dots.length > 1
							? dots.map((dot: any, idx: number) => (
									<React.Fragment key={idx}>
										{dot.props.className !== "slick-active" ? (
											dot
										) : (
											<li className={styles.progress_dot}>
												<div
													style={{
														animation: `close-wrapper 0.01s ${
															SLIDE_INTERVAL / 2000
														}s forwards linear`,
													}}
												>
													<span
														style={{
															animation: `right-spin ${SLIDE_INTERVAL / 2000}s forwards linear`,
														}}
													/>
													<span
														style={{
															animation: `left-spin ${SLIDE_INTERVAL / 1000}s forwards linear`,
														}}
													/>
												</div>
											</li>
										)}
									</React.Fragment>
							  ))
							: dots}
					</ul>
				)}
			</div>
		),
		[progress, mobile],
	);

	const getSettings = useCallback(
		() => ({
			dots: true,
			infinite: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			appendDots: renderDots,
			beforeChange: handleSliderState,
		}),
		[renderDots, handleSliderState],
	);

	useEffect(() => {
		if (currentSlide !== prevCurrentSlide && showBanner && banners.length > 1) {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			// @ts-ignore
			timeoutRef.current = setTimeout(() => {
				if (sliderRef.current) {
					sliderRef.current.slickNext();
				}
			}, SLIDE_INTERVAL);
		}
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [timeoutRef, currentSlide, showBanner, banners.length]);

	const handleDisableBanner = (e: React.MouseEvent) => {
		e.preventDefault();
		cookies.set("adv_v14", "1", { path: "/", expires: 3 });
		setShowBanner(false);
	};

	const getImage = useCallback(
		(banner: IBanner) => {
			if (width > 1100)
				return banner.images[locale] ? banner.images[locale].desktop : banner.images.en.desktop;
			if (width > 600 && width < 1100)
				return banner.images[locale] ? banner.images[locale].tablet : banner.images.en.tablet;
			if (width < 600)
				return banner.images[locale] ? banner.images[locale].mobile : banner.images.en.mobile;

			return "";
		},
		[locale, width],
	);

	const generateLink = useCallback(
		(link: IBannerLink): string => {
			if (link.internal) {
				return `/${locale}/${link.url}`;
			}
			if (typeof link.url === "object") {
				return `${link.url[locale] || link.url.en}`;
			}
			return "";
		},
		[locale],
	);

	return showBanner ? (
		<div>
			<div
				className={styles.banner}
				style={{
					background: banners[currentSlide]?.background ?? "unset",
				}}
			>
				<button className={styles.button_close} type="button" onClick={handleDisableBanner}>
					<i className="ai ai-close" />
				</button>
				<Slider {...getSettings()} ref={sliderRef}>
					{Array.isArray(banners) &&
						banners.map((banner) => (
							<div key={banner.id} className={styles.banner_wrapper}>
								<a
									target="_blank"
									className={styles.banner_link}
									href={generateLink(banner.link)}
									rel="noopener noreferrer"
								>
									<img className="responsive-img" src={getImage(banner)} alt={config.department} />
								</a>
							</div>
						))}
				</Slider>
			</div>
		</div>
	) : null;
};

export default observer(MarketBanner);

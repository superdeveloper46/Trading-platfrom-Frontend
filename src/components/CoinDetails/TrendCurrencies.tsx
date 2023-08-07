import React from "react";
import Slider, { Settings } from "react-slick";
import { useIntl } from "react-intl";
import cn from "classnames";

import styles from "styles/components/CoinInfo/TrendCurrencies.module.scss";
import { usePromotedPairs } from "services/HomeService";
import messages from "messages/coin_info";
import { IPromotedPair } from "types/home";
import ExternalImage from "components/ExternalImage";
import { MiniChart } from "components/Home/TopPairs";
import InternalLink from "components/InternalLink";
import Badge from "components/UI/Badge";
import { routes } from "constants/routing";

interface IArrowProps {
	onClick?: () => void;
}

const SampleNextArrow = ({ onClick }: IArrowProps) => (
	<button
		type="button"
		aria-label="next"
		onClick={onClick}
		className={cn(styles.slick_arrow, styles.slick_arrow_next)}
	>
		<i className="ai ai-chevron_right" />
	</button>
);

const SamplePrevArrow = ({ onClick }: IArrowProps) => (
	<button
		type="button"
		aria-label="prev"
		onClick={onClick}
		className={cn(styles.slick_arrow, styles.slick_arrow_prev)}
	>
		<i className="ai ai-chevron_left" />
	</button>
);

const settings: Settings = {
	dots: false,
	infinite: true,
	autoplaySpeed: 3000,
	speed: 500,
	slidesToShow: 4,
	slidesToScroll: 1,
	autoplay: true,
	lazyLoad: "progressive",
	responsive: [
		{
			breakpoint: 1366,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
			},
		},
		{
			breakpoint: 960,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1,
				arrows: false,
			},
		},
		{
			breakpoint: 548,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
			},
		},
	],
	nextArrow: <SampleNextArrow />,
	prevArrow: <SamplePrevArrow />,
};

const Tile: React.FC<IPromotedPair> = ({ diff, image_png, image_svg, candles, symbol }) => (
	<InternalLink className={styles.tile} to={routes.trade.getPair(symbol)}>
		<div className={styles.header}>
			<ExternalImage
				src={(image_svg || image_png) as string}
				alt={symbol}
				width="30"
				height="30"
				className={styles.coin_logo}
			/>
			<div className={styles.tile_title}>
				<span>{symbol.replace("_", "/")}</span>
				<Badge color={diff < 0 ? "red" : diff === 0 ? "greyDark" : "green"} alpha>
					<span className={styles.percents_badge}>
						{diff > 0 && "+"}
						{diff}%
					</span>
				</Badge>
			</div>
		</div>
		<div className={styles.chart}>
			<MiniChart candles={candles.slice(0, 50)} className={styles.mini_chart} />
		</div>
	</InternalLink>
);

const TrendCurrencies: React.FC = () => {
	const { data: promotedPairs = [] } = usePromotedPairs();
	const { formatMessage } = useIntl();
	return (
		<>
			<div className={styles.title}>{formatMessage(messages.promoted_pair)}</div>
			<Slider className={styles.slider_container} {...settings}>
				{promotedPairs.map((data, i) => (
					<Tile {...data} key={i} />
				))}
			</Slider>
		</>
	);
};

export default TrendCurrencies;

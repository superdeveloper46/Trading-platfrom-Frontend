import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";
import styles from "styles/components/CoinInfo/TrendCurrencies.module.scss";

interface ArrowProps {
	type: string;
	onClick?: MouseEventHandler;
}

interface Props {
	step: number;
}

const Arrow: React.FC<ArrowProps> = ({ type, onClick }) => {
	const style = type === "n" ? { right: 0 } : { left: 0 };
	return (
		<div onClick={onClick} className={styles.button} style={style}>
			<i className={`ai ai-chevron_${type === "n" ? "right" : "left"}`} />
		</div>
	);
};

const Slider: React.FC<Props> = (props) => {
	const { children, step } = props;
	const [offset, setOffset] = useState(0);
	const [contentWidth, setContentWidth] = useState(0);
	const [sliderWidth, setSliderWidth] = useState(0);
	const contentContainerRef = useRef<HTMLDivElement>(null);
	const sliderRef = useRef<HTMLDivElement>(null);
	const showArrows = contentWidth > sliderWidth;

	useEffect(() => {
		if (contentContainerRef.current?.scrollWidth) {
			setContentWidth(contentContainerRef.current?.scrollWidth);
		}
		if (contentContainerRef.current?.offsetWidth) {
			setSliderWidth(contentContainerRef.current?.offsetWidth);
		}
	}, [contentContainerRef.current]);

	const scrollTo = useCallback(
		(x: number) => {
			sliderRef.current?.scrollTo({
				left: x,
				behavior: "smooth",
			});
		},
		[sliderRef.current],
	);

	const onClickPrev = useCallback(() => {
		setOffset((prevOffset) => {
			let offset;
			if (prevOffset - step < 0) {
				offset = 0;
			} else {
				offset = prevOffset - step;
			}

			scrollTo(offset);
			return offset;
		});
	}, []);

	const onClickNext = useCallback(() => {
		setOffset((prevOffset) => {
			let offset;
			if (prevOffset + step > contentWidth - sliderWidth) {
				offset = contentWidth - sliderWidth;
			} else {
				offset = prevOffset + step;
			}

			scrollTo(offset);
			return offset;
		});
	}, [contentWidth, sliderWidth]);

	return (
		<div className={styles.slider_container}>
			<div className={styles.arrows_container}>
				{offset !== 0 && showArrows && (
					<>
						<div className={styles.shadow_before} />
						<Arrow type="p" onClick={onClickPrev} />
					</>
				)}

				{offset !== contentWidth - sliderWidth && showArrows && (
					<>
						<Arrow type="n" onClick={onClickNext} />
						<div className={styles.shadow_after} />
					</>
				)}
			</div>
			<div className={styles.slider_content_wrapper} ref={sliderRef}>
				<div className={styles.slider_content} ref={contentContainerRef}>
					{children}
				</div>
			</div>
		</div>
	);
};

export default Slider;

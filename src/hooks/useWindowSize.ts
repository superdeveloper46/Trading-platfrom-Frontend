import * as React from "react";

// @ts-ignore
import variables from "../_variables.scss";

export default () => {
	const [width, setWidth] = React.useState(window.innerWidth);
	const [height, setHeight] = React.useState(window.innerHeight);

	const handleResize = () => {
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
	};

	React.useEffect(() => {
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const mobile = React.useMemo(
		() => (width ? width <= parseInt(variables.breakpointMobile, 10) : false),
		[width],
	);
	const medium = React.useMemo(
		() => (width ? width <= parseInt(variables.breakpointMedium, 10) : false),
		[width],
	);
	const smallTablet = React.useMemo(
		() => (width ? width <= parseInt(variables.breakpointLaptop, 10) : false),
		[width],
	);
	const tablet = React.useMemo(
		() => (width ? width <= parseInt(variables.breakpointLargeLaptop, 10) : false),
		[width],
	);
	const smallDesktop = React.useMemo(
		() => (width ? width <= parseInt(variables.breakpointHD, 10) : false),
		[width],
	);
	const desktop = React.useMemo(
		() => (width ? width >= parseInt(variables.breakpointHD, 10) : false),
		[width],
	);

	return {
		width,
		height,
		mobile,
		medium,
		smallTablet,
		tablet,
		smallDesktop,
		desktop,
	};
};

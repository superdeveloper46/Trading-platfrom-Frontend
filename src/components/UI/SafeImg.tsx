/* eslint-disable */
import React, { useRef } from "react";
import icon404 from "assets/images/common/404.svg";

const SafeImg: React.FC<
	React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
> = ({ src, alt, ...rest }) => {
	const imgRef = useRef<HTMLImageElement>(null);

	const handleError = () => {
		if (imgRef.current) {
			if (imgRef.current.parentElement?.tagName === "PICTURE") {
				imgRef.current.parentElement.childNodes.forEach((node) => {
					if (node.nodeName === "SOURCE") {
						imgRef.current?.parentElement?.removeChild(node);
					}
				});
			}
			imgRef.current.src = icon404;
		}
	};

	return <img ref={imgRef} src={src || icon404} alt={alt} onError={handleError} {...rest} />;
};

export default SafeImg;

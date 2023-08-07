import config from "helpers/config";
import React from "react";

const STATIC_PREFIX = config.serverStaticPrefix;

interface IProps
	extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
	src: string;
	alt: string;
}

const ExternalImage: React.FC<IProps> = ({ src, alt, ...rest }) => (
	<img src={`${STATIC_PREFIX}${src}`} alt={alt} {...rest} />
);

export default ExternalImage;

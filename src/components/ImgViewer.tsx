import React from "react";
import styles from "styles/components/ImgViewer.module.scss";

interface Props {
	src?: string;
	onClose: () => void;
}

const ImgViewer: React.FC<Props> = ({ src, onClose }) =>
	src ? (
		<div className={styles.img_to_view_container} onClick={onClose}>
			<img className={styles.img_to_view} alt="" src={src} />
		</div>
	) : null;

export default ImgViewer;

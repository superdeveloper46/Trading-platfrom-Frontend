/* eslint-disable react/no-children-prop */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "styles/components/UI/Markdown.module.scss";

interface Props {
	content: string;
}

const Markdown: React.FC<Props> = ({ content }) => {
	const [imgSrcToView, setImgSrcToView] = useState<string>("");

	return (
		<ReactMarkdown
			className={styles.container}
			components={{
				blockquote: ({ children }) => (
					<blockquote>
						<i className="ai ai-quotes" />
						<p>{children}</p>
					</blockquote>
				),
				img: ({ src, alt }) => (
					// FIXME: Change to button
					// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions,jsx-a11y/interactive-supports-focus
					<span
						role="button"
						className={styles.story_photo}
						onClick={() => setImgSrcToView(src ?? "")}
					>
						<img src={src} alt={alt} loading="lazy" />
					</span>
				),
			}}
			children={content}
			skipHtml
		/>
	);
};

export default Markdown;

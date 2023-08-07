import React from "react";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";

import messages from "messages/common";
import halvingMessages from "messages/halving";
import styles from "styles/components/ShareContainer.module.scss";

interface IProps {
	className?: string;
	link: string;
	vertical?: boolean;
}

const ShareContainer: React.FC<IProps> = ({ className, link, vertical }) => {
	const { formatMessage } = useIntl();

	const handleClickCopy = () => {
		navigator.clipboard.writeText(window.location.href);

		toast(formatMessage(messages.copied));
	};

	const shareLinks = [
		{
			link: `https://twitter.com/intent/tweet?url=https://${link}`,
			iconClassName: "ai ai-twitter",
		},
		{
			link: `https://telegram.me/share/url?url=https://${link}`,
			iconClassName: "ai ai-telegram",
		},
		{
			link: `https://www.facebook.com/sharer/sharer.php?u=${link}`,
			iconClassName: "ai ai-facebook",
		},
	];

	return (
		<div className={cn(styles.container, className, { [styles.vertical]: vertical })}>
			<div className={styles.title}>
				<i className="ai ai-share" />
				{formatMessage(halvingMessages.bonus_3)}
			</div>
			<div className={styles.icons}>
				{shareLinks.map(({ link, iconClassName }, index) => (
					<a key={index} href={link} target="_blank" rel="noopener noreferrer">
						<i className={cn(styles.icon, iconClassName)} />
					</a>
				))}
				<div className={styles.copy_link} onClick={handleClickCopy}>
					<i className={cn(styles.icon, "ai ai-copy_outlined")} />
				</div>
			</div>
		</div>
	);
};

export default observer(ShareContainer);

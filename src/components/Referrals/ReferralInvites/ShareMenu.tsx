import React from "react";
import styles from "styles/components/Profile/Referrals/Referrals.module.scss";
import ddlistStyles from "styles/components/DropdownList.module.scss";

const FloatingShareMenu: React.FC<{ sharingUrl: string; style?: React.CSSProperties }> = ({
	sharingUrl,
	style,
}) => (
	<div style={style}>
		<div className={ddlistStyles.dropdown_list}>
			<div className={styles.social}>
				<div className={styles.social_list}>
					<a
						href="https://www.instagram.com/direct/inbox/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Instagram"
					>
						<i className="ai ai-instagram" />
					</a>
					<a
						href={`https://twitter.com/intent/tweet?url=${sharingUrl}`}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Twitter"
					>
						<i className="ai ai-twitter" />
					</a>
					<a
						href={`https://t.me/share/url?url=${sharingUrl}`}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Telegram"
					>
						<i className="ai ai-telegram" />
					</a>
					<a
						href={`https://www.facebook.com/sharer/sharer.php?u=${sharingUrl}`}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Facebook"
					>
						<i className="ai ai-facebook" />
					</a>
				</div>
			</div>
		</div>
	</div>
);

export default FloatingShareMenu;

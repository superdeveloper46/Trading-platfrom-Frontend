import React, { useState, useEffect } from "react";
import cookies from "js-cookie";
import { useIntl } from "react-intl";
import commonMessages from "messages/common";
import Button from "components/UI/Button";
import styles from "styles/components/Cookies.module.scss";
import CookieIcon from "assets/images/common/cookie-bite-icon.svg";

const Cookies: React.FC = () => {
	const [isAccepted, setIsAccepted] = useState<boolean>(true);
	const { formatMessage } = useIntl();

	useEffect(() => {
		const accepted = cookies.get("cp") === "1";
		setIsAccepted(accepted);
		if (accepted) {
			cookies.set("cp", "1", { expires: 365 });
		}
	}, []);

	const acceptCookies = (): void => {
		cookies.set("cp", "1", { expires: 365 });
		setIsAccepted(true);
	};

	return isAccepted ? null : (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<img src={CookieIcon} width="40" height="40" alt="Cookie" />
				<span>{formatMessage(commonMessages.cookies_accept)}</span>
				<div className={styles.controls}>
					<Button
						label={formatMessage(commonMessages.accept)}
						onClick={acceptCookies}
						variant="filled"
						color="primary"
					/>
				</div>
			</div>
		</div>
	);
};

export default Cookies;

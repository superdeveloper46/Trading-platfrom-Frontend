import React, { useEffect, useRef } from "react";
import { ReCaptcha, loadReCaptcha } from "react-recaptcha-v3";
import { removeCaptchaBadge } from "utils/browser";

interface IProps {
	siteKey: string;
	action: string;
	execute: boolean;
	onTokenChange: (token: string) => void;
}

const Captcha: React.FC<IProps> = React.memo(({ siteKey, action, execute, onTokenChange }) => {
	const captchaRef = useRef<ReCaptcha>(null);

	useEffect(() => {
		if (captchaRef.current && execute) {
			captchaRef.current.execute();
		}
	}, [captchaRef.current, execute]);

	useEffect(() => {
		if (siteKey && action) {
			loadReCaptcha(siteKey);
		}
	}, [siteKey, action]);

	useEffect(() => () => removeCaptchaBadge(), []);

	return siteKey && action ? (
		<ReCaptcha ref={captchaRef} sitekey={siteKey} action={action} verifyCallback={onTokenChange} />
	) : null;
});

export default Captcha;

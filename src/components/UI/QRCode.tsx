import React, { useState } from "react";
import { useIntl } from "react-intl";
import classnames from "classnames";
import QrCodeComponent from "qrcode.react";

import useWindowSize from "hooks/useWindowSize";
import styles from "styles/components/UI/QRCode.module.scss";
import styleProps from "utils/styleProps";
import commonMessages from "messages/common";
import useCopyClick from "hooks/useCopyClick";
import ButtonMicro from "./ButtonMicro";
import Button from "./Button";

interface IProps {
	value: string;
	code?: string;
	label?: string;
	size?: number;
	labelAlignTo?: "center" | "left" | "right";
}

const QRCode: React.FC<IProps> = ({ value, code = "", label = "", size = 175, labelAlignTo }) => {
	const { formatMessage } = useIntl();
	const [isOpen, setOpen] = useState(false);
	const { desktop } = useWindowSize();
	const copyClick = useCopyClick();

	const toggleExpand = () => setOpen(!isOpen);

	const handleCopyToClipboard = (): void => {
		if (!code) return;
		copyClick(code, formatMessage(commonMessages.copied_to_clipboard, { label }));
	};

	return (
		<div
			style={styleProps({ "--qr-code-text-align": labelAlignTo ?? "left" })}
			className={styles.container}
		>
			{label && <div className={styles.label}>{label}</div>}
			{desktop ? (
				<>
					<div className={styles.background}>
						<QrCodeComponent value={value} size={size} />
					</div>
					{code && (
						<div className={styles.value}>
							{code || "--"}
							<ButtonMicro onClick={handleCopyToClipboard}>
								<i className="ai ai-copy_new" />
							</ButtonMicro>
						</div>
					)}
				</>
			) : (
				<>
					<div className={styles.expander} onClick={toggleExpand}>
						<div
							className={classnames(styles.expander_header, {
								[styles.active]: isOpen,
							})}
						>
							<i className="ai ai-qr-code-01" />
							{code && <span>{code}</span>}
							<i className="ai ai-chevron_down" />
						</div>
						{isOpen && (
							<div className={styles.expand_content}>
								<div className={styles.mobile_background}>
									<QrCodeComponent value={value} size={size} />
								</div>
							</div>
						)}
					</div>
					{code && (
						<Button
							label={formatMessage(commonMessages.copy)}
							onClick={handleCopyToClipboard}
							color="primary"
							iconCode="copy_new"
							iconAlign="left"
							fullWidth
						/>
					)}
				</>
			)}
		</div>
	);
};

export default QRCode;

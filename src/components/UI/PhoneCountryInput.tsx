import React, { useCallback, useState } from "react";
import PhoneInput from "react-phone-input-2";
import styles from "styles/components/UI/PhoneCountryInput.module.scss";
import inputStyles from "styles/components/UI/Input.module.scss";
import commonMessages from "messages/common";
import { useIntl } from "react-intl";
import classnames from "classnames";

interface IProps {
	value: any;
	onChange: any;
	searchPlaceholder?: string;
	enableSearch?: boolean;
	error?: string | string[];
	helpText?: string;
	label?: string;
}

const PhoneCountryInput: React.FC<IProps> = ({
	value,
	onChange,
	searchPlaceholder,
	enableSearch,
	error,
	helpText,
	label,
}) => {
	const { formatMessage } = useIntl();
	const [isActive, setIsActive] = useState<boolean>(false);

	const isError = Boolean(error);
	const isHelp = Boolean(helpText);

	const handleBlur = useCallback(() => setIsActive(false), []);
	const handleFocus = useCallback(() => setIsActive(true), []);

	return (
		<div
			onBlur={handleBlur}
			onFocus={handleFocus}
			className={classnames(styles.phone_input_wrapper, {
				[styles.active]: isActive,
				[styles.error]: isError,
			})}
		>
			<PhoneInput
				value={value}
				onChange={onChange}
				enableSearch={enableSearch}
				specialLabel=""
				searchPlaceholder={searchPlaceholder || formatMessage(commonMessages.search)}
			/>
			<div
				className={classnames(inputStyles.placeholder, inputStyles.phone, {
					[inputStyles.active]: isActive,
					[inputStyles.error]: isError,
				})}
			>
				{label}
			</div>
			{isError && (
				<div className={classnames(inputStyles.help_text, inputStyles.error)}>
					{Array.isArray(error) ? error.join("/n") : error}
				</div>
			)}
			{isHelp && <div className={inputStyles.help_text}>sdfsf</div>}
		</div>
	);
};

export default PhoneCountryInput;

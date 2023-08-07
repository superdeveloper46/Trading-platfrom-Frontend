import React from "react";
import Select from "components/UI/Select";
import styles from "styles/components/UI/Selector.module.scss";
import cn from "classnames";

export const ErrorText: React.FC<{ className?: string }> = ({ children, className, ...rest }) => (
	<div className={cn(styles.help_text, styles.error_text, className)} {...rest}>
		{children}
	</div>
);

const Selector = (props: any) => {
	const { placeholder, onChange, options, name, value, defaultValue, error } = props;

	return (
		<div>
			<Select
				className={cn(!!error && styles.error)}
				placeholder={placeholder}
				defaultValue={defaultValue}
				value={value}
				name={name}
				options={options}
				onChange={onChange}
				labeled
			/>
			{error && <ErrorText className={styles.error_and_help_text}>{error}</ErrorText>}
		</div>
	);
};

export default Selector;

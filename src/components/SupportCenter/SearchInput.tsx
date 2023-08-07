import React from "react";
import styles from "styles/pages/SupportCenter.module.scss";
import Input, { Appender } from "components/UI/Input";

interface Props {
	value: string;
	name: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	labelValue?: string;
	onFocus?: () => void;
	onBlur?: () => void;
	onKeyDown?: (e: React.KeyboardEvent) => void;
}

const SearchInput: React.FC<Props> = (props) => {
	const { value, name, labelValue, onChange, placeholder, onBlur, onFocus, onKeyDown } = props;

	return (
		<Input
			className={styles.custom_input}
			type="text"
			onChange={onChange}
			value={value}
			name={name}
			labelValue={labelValue}
			onFocus={onFocus}
			onBlur={onBlur}
			search
			placeholder={placeholder}
			onKeyDown={onKeyDown}
			appender={
				<Appender className={styles.search_appender}>
					<i className="ai ai-search" />
				</Appender>
			}
		/>
	);
};

export default SearchInput;

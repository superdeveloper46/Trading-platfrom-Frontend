import React from "react";
import styles from "styles/components/UI/InputRange.module.scss";

interface Props {
	name?: string;
	value?: number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	labelValue?: string | JSX.Element | Element;
	placeholder?: string;
	autoComplete?: string;
	min: number;
	max: number;
	step?: number;
}

const InputRange: React.FC<Props> = React.memo(({ value, name, onChange, min, max, step = 1 }) => (
	<div className={styles.container}>
		{/* @ts-ignore */}
		<div className={styles.input_container} style={{ "--width": `${value ?? 0 / max}%` }}>
			<input
				className={styles.input}
				id={name}
				type="range"
				onChange={onChange}
				value={value || 0}
				name={name}
				min={min}
				max={max}
				step={step}
			/>
		</div>
	</div>
));

export default InputRange;

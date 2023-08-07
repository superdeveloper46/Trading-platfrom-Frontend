/* eslint-disable no-useless-escape */
import React from "react";
import styles from "styles/pages/Terminal.module.scss";
import cn from "classnames";
import { TableData } from "components/UI/Table";
import { formatNumberNoRounding } from "utils/format";

interface IProps {
	value: number;
	precision: number;
	coloredFull: boolean;
	type?: number; // 1 - sell 2 - buy
}

const FormattedPrice: React.FC<IProps> = React.memo(({ value, coloredFull, precision, type }) => {
	const formattedValue = formatNumberNoRounding(value, precision);
	const splittedValue = formattedValue.split(/[\,\.]/);
	const delimiterIndex = formattedValue.search(/[\,\.]/);
	const hasMantissa = splittedValue.length > 1;

	return (
		<TableData
			className={cn(styles.formatted_price, type === 2 && styles.buy, type === 1 && styles.sell)}
		>
			{coloredFull || precision < 2 ? (
				<span>
					{splittedValue[0]}
					{hasMantissa && (
						<>
							{formattedValue.charAt(delimiterIndex)}
							{splittedValue[1] || "0".repeat(precision)}
						</>
					)}
				</span>
			) : (
				<>
					{splittedValue[0]}
					{hasMantissa && (
						<>
							{formattedValue.charAt(delimiterIndex)}
							{splittedValue[1].slice(0, -2) || "0".repeat(precision - 2)}
							<span>{splittedValue[1].slice(-2)}</span>
						</>
					)}
				</>
			)}
		</TableData>
	);
});

export default FormattedPrice;

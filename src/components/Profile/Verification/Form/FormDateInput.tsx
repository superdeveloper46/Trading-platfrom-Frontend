import React, { useEffect, useState } from "react";
import styles from "styles/components/Profile/Verification/FormDateInput.module.scss";
import stylesInput from "styles/components/UI/Input.module.scss";
import commonMessages from "messages/common";
import { useIntl } from "react-intl";
import Select, { ISelectOption } from "components/UI/Select";
import { IMonth, MONTHS } from "utils/constants";
import dayjs from "utils/dayjs";
import Input from "components/UI/Input";
import classnames from "classnames";

interface IProps {
	title: string;
	name: string;
	disabled?: boolean;
	additionalNode?: React.ReactNode;
	value?: Date;
	error?: string;
	isBefore?: boolean;
	isAfter?: boolean;
	onChange(name: string, value: string): void;
	onTouch?: () => void;
}
export const FormDateInput: React.FC<IProps> = ({
	title,
	onChange,
	onTouch,
	disabled,
	additionalNode,
	value,
	name,
	error,
	isAfter,
	isBefore,
}) => {
	const { formatMessage } = useIntl();
	const [day, setDay] = useState<number | undefined>(value?.getDay());
	const [month, setMonth] = useState<number | undefined>(value?.getMonth());
	const [year, setYear] = useState<number | undefined>(value?.getFullYear());
	const [hasError, setHasError] = useState(!!error);

	const validateDate = (date: string) => {
		const today = dayjs().format("YYYY-MM-DD");

		const isDayAfter = !dayjs(today).isAfter(dayjs(date).format("YYYY-MM-DD"));

		if (isAfter && !isDayAfter) return false;
		if (isBefore && isDayAfter) return false;

		return isRangeValid();
	};

	const isRangeValid = () => {
		const currentYear = new Date().getFullYear();

		if ((day ?? 0) <= 0 || (day ?? 0) > 31) {
			return false;
		}

		if ((isAfter && (year ?? 0) < currentYear) || (year ?? 0) > currentYear + 100) {
			return false;
		}

		return !((isBefore && (year ?? 0) > currentYear - 17) || (year ?? 0) < currentYear - 100);
	};

	useEffect(() => {
		setHasError(!!error);
	}, [error]);

	useEffect(() => {
		if (onTouch) {
			onTouch();
		}
		if (day && year && month) {
			const date = dayjs(new Date(year ?? 0, month ? month - 1 : 0, day)).format("YYYY-MM-DD");
			setHasError(!validateDate(date));
			onChange(name, dayjs(date).format("YYYY-MM-DD"));
		}
	}, [day, year, month]);

	const monthList: ISelectOption[] = MONTHS.map((month: IMonth) => ({
		label: formatMessage((commonMessages as any)[month.name]),
		value: month.value,
	}));

	const onMonthSelect = (e: ISelectOption) => setMonth(+e.value);

	return (
		<div className={styles.form_date_group}>
			<span className={styles.label}>{title}</span>
			<div className={styles.form_date_input}>
				<Input
					labelValue={formatMessage(commonMessages.day)}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDay(+e.target.value)}
					value={day}
					type="number"
					disabled={disabled}
					error={!disabled && hasError}
				/>
				<Select
					isClearable
					isSearchable={false}
					options={monthList}
					value={monthList.find((m) => +m.value === month)}
					onChange={onMonthSelect}
					label={formatMessage(commonMessages.month)}
					getOptionLabel={(option: ISelectOption): JSX.Element => (
						<div className={styles.month_label}>
							{option.label}
							<span>{option.value}</span>
						</div>
					)}
					getOptionValue={(option: ISelectOption): string => option.value}
					disabled={disabled}
					error={!disabled && hasError}
				/>
				<Input
					labelValue={formatMessage(commonMessages.year)}
					type="number"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setYear(+e.target.value)}
					value={year}
					disabled={disabled}
					error={!disabled && hasError}
				/>
			</div>
			{!disabled && hasError && (
				<div className={classnames(styles.error_text, stylesInput.help_text, stylesInput.error)}>
					{error}
				</div>
			)}
			{additionalNode && additionalNode}
		</div>
	);
};

import React, { useRef, useState, useEffect } from "react";
import {
	DateRangePicker as RangePicker,
	DateRangePickerProps as RangePickerProps,
	RangeKeyDict,
} from "react-date-range";
import dayjs from "dayjs";
import enUS from "date-fns/locale/en-US";
import de from "date-fns/locale/de";
import es from "date-fns/locale/es";
import fr from "date-fns/locale/fr";
import pt from "date-fns/locale/pt";
import ru from "date-fns/locale/ru";
import tr from "date-fns/locale/tr";
import uk from "date-fns/locale/uk";
import hi from "date-fns/locale/hi";
import zhCN from "date-fns/locale/zh-CN";
import styles from "styles/components/UI/DateRangePicker.module.scss";
import cn from "classnames";
import ButtonMicro from "components/UI/ButtonMicro";
import { observer } from "mobx-react-lite";
import { useMst } from "../../models/Root";

export interface IDateRange {
	startDate: any;
	endDate: any;
	key: string;
}

export interface IChangeDateRange extends RangeKeyDict {
	selection: IDateRange;
}

interface Props extends Omit<RangePickerProps, "onChange"> {
	onRangeClear: () => void;
	loc: string;
	onChange: (r: IChangeDateRange) => void;
	containerClassName?: string;
	contentClassname?: string;
}

const LOCALES = [enUS, de, es, fr, pt, ru, tr, zhCN, uk, hi];

export const DateRangePicker: React.FC<Props> = (props) => {
	const {
		loc,
		onRangeClear,
		onChange,
		ranges: inputRanges,
		containerClassName,
		contentClassname,
	} = props;
	const [isRangePickerOpen, setIsRangePickerOpen] = useState<boolean>(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const dateRangeLocale = LOCALES.find((locale) => {
		const code: string = locale.code?.split("-")?.length ? locale.code?.split("-")[0] : "";
		return code === loc;
	});
	const [ranges, setRanges] = useState<IDateRange>({
		startDate: null,
		endDate: null,
		key: "selection",
	});
	const startDate = ranges.startDate;
	const endDate = ranges.endDate;

	const toggleIsRangePickerOpen = () => {
		setIsRangePickerOpen((prevState) => !prevState);
	};

	const handleCloseRangePicker = (e: MouseEvent) => {
		if (!containerRef.current?.contains(e.target as Node)) {
			setIsRangePickerOpen(false);
		}
	};

	const handleClear = () => {
		onRangeClear();
	};

	useEffect(() => {
		if (isRangePickerOpen) {
			document.addEventListener("click", handleCloseRangePicker);
		} else {
			document.removeEventListener("click", handleCloseRangePicker);
		}
		return () => document.removeEventListener("click", handleCloseRangePicker);
	}, [isRangePickerOpen]);

	useEffect(() => {
		setRanges((prevState) => ({
			...prevState,
			startDate: typeof inputRanges?.[0]?.startDate === "object" ? inputRanges[0]?.startDate : null,
			endDate: typeof inputRanges?.[0]?.endDate === "object" ? inputRanges[0]?.endDate : null,
		}));
	}, [inputRanges]);

	useEffect(() => {
		if ((!ranges.startDate || !ranges.endDate) && isRangePickerOpen) {
			const startDate = new Date();
			const endDate = new Date();
			setRanges((prevState) => ({
				...prevState,
				startDate,
				endDate,
			}));
			if (onChange) {
				onChange({
					selection: {
						key: "selection",
						startDate,
						endDate,
					},
				});
			}
		}
	}, [isRangePickerOpen, onChange]);

	return (
		<div className={cn(styles.container, containerClassName)} ref={containerRef}>
			<ButtonMicro
				primary
				onClick={toggleIsRangePickerOpen}
				className={cn(styles.date_button, { [styles.active]: isRangePickerOpen })}
			>
				<i className="ai ai-calendar" />
				{startDate || endDate ? (
					<span>
						{startDate ? dayjs(startDate).format("DD.MM.YYYY") : "-"}
						&nbsp;-&nbsp;
						{endDate ? dayjs(endDate).format("DD.MM.YYYY") : "-"}
					</span>
				) : null}
			</ButtonMicro>
			{startDate || endDate ? (
				<ButtonMicro onClick={handleClear} className={styles.close_button}>
					<i className="ai ai-cancel_filled" />
				</ButtonMicro>
			) : null}
			{dateRangeLocale && isRangePickerOpen && ranges.startDate && ranges.endDate ? (
				<div className={cn(styles.range_picker_container, contentClassname)}>
					<RangePicker
						{...props}
						onChange={onChange as (r: RangeKeyDict) => void}
						ranges={[ranges]}
						locale={dateRangeLocale}
						color="#007aff"
					/>
				</div>
			) : null}
		</div>
	);
};

export interface IDateRangePicker extends RangePickerProps {
	onRangeClear: () => void;
	loc: string;
}

interface WrapperProps extends Omit<IDateRangePicker, "onChange" | "loc"> {
	onChange: (nextDate: IChangeDateRange) => void;
	containerClassName?: string;
	contentClassname?: string;
}

const DateRangePickerWrapper: React.FC<WrapperProps> = (props) => {
	const {
		global: { locale },
	} = useMst();

	return <DateRangePicker {...(props as any)} loc={locale} />;
};

export default observer(DateRangePickerWrapper);

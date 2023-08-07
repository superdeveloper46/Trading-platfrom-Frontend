/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from "react";
import { components } from "react-select";
import cn from "classnames";
import styles from "styles/components/UI/CountrySelect.module.scss";
import stylesInput from "styles/components/UI/Input.module.scss";
import Select from "components/UI/Select";
import countries from "./countries";

// TODO FIX VIEW

interface IDynamicImgProps {
	className?: string;
	alt: string;
	src: string;
}

const DynamicImg: React.FC<IDynamicImgProps> = ({ className, alt, src }) => {
	const [icon, setIcon] = useState();

	useEffect(() => {
		import(
			/* webpackPrefetch: true */ /* webpackPreload: true */ /* webpackMode: "lazy-once" */ /* webpackChunkName: "flag-image" */ `./flags/${src}.svg`
		).then((module) => setIcon(module.default));
	}, []);

	return <img src={icon} alt={alt} className={className} loading="lazy" width="24" height="24" />;
};

const excludeCountries = [
	"aq",
	"bv",
	"bn",
	"cx",
	"cc",
	"gf",
	"tf",
	"gp",
	"gy",
	"hm",
	"va",
	"yt",
	"nc",
	"re",
	"sh",
	"lc",
	"pm",
	"vc",
	"gs",
	"sj",
	"tl",
	"um",
	"vg",
	"wf",
	"eh",
	"ax",
	"bq",
	"bl",
	"mf",
	"xk",
];

const buildCountriesList = (
	locale: string,
	overwriteCountries?: string[],
): { label: string; value: string }[] => {
	const countriesData = countries(locale);
	const list = Object.keys(countriesData)
		.filter((c) => (overwriteCountries ? overwriteCountries.includes(c) : true))
		.map((c) => ({
			label: countriesData[c],
			value: c.toLowerCase(),
		}));

	return list.filter((c) => excludeCountries.indexOf(c.value) === -1);
};

const Control = (props: any) => {
	const {
		selectProps: { label, error },
		hasValue,
		isFocused,
		isListOpen,
	} = props;
	return (
		<>
			<components.Control {...props} />
			<div
				className={cn(styles.placeholder, stylesInput.placeholder, {
					[styles.active]: isFocused || isListOpen,
					[styles.filled]: hasValue,
					[stylesInput.active]: isFocused || isListOpen,
					[stylesInput.filled]: hasValue,
					[stylesInput.error]: !!error,
				})}
			>
				{label}
			</div>
		</>
	);
};

// const ContainerOfValue = styled(components.ValueContainer)`
// 	padding: 0 18px 0 8px;

// 	i.ai.ai-web_outlined {
// 		right: 22px;
// 	}

// 	${ValueMock} {
// 		position: relative;
// 		top: -1px;
// 	}
// `;

// const CustomSingleValue = styled(components.SingleValue)`
// 	margin: 0 !important;
// `;
// const EmptyFlag = styled.div`
// 	margin-right: 45px;
// `;

const Option = React.memo(
	(props: any) => {
		const { data } = props;
		const value = data.value.toLowerCase();

		return (
			<components.Option {...props}>
				<div className={styles.option_content}>
					{value ? (
						<DynamicImg src={value} alt={value} />
					) : (
						<div className={styles.empty_flag}>
							<i className="ai ai-web_outlined" />
						</div>
					)}
					{data.label}
				</div>
			</components.Option>
		);
	},
	(prevProps, nextProps) => prevProps.label === nextProps.label,
);

const SingleValue = (props: any) => {
	const { data, selectProps } = props;
	const value = data.value.toLowerCase();

	return (
		<components.SingleValue {...props} className={styles.single_value}>
			<div className={cn(styles.option_content, styles.value)}>
				<div className={styles.img_block} key={value}>
					<DynamicImg src={value} alt={value} />
					{selectProps.isListOpen ? (
						<i className="ai ai-arrow_up" />
					) : (
						<i className="ai ai-arrow_down" />
					)}
				</div>
				{data.label}
			</div>
		</components.SingleValue>
	);
};

const PlaceholderCustom = (props: any) => (
	<components.Placeholder
		{...props}
		className={cn(styles.placeholder_comp_container, props.selectProps.error && styles.error)}
	>
		<div className={styles.placeholder_comp}>
			<div className={styles.img_block}>
				<i className="ai ai-web_outlined" />
				{props.isFocused ? <i className="ai ai-arrow_up" /> : <i className="ai ai-arrow_down" />}
			</div>
		</div>
	</components.Placeholder>
);

const ValueContainer = ({ children, ...props }: any) => (
	<components.ValueContainer {...props} className={styles.value_container}>
		{!children?.[0] && (
			<div className={styles.img_block}>
				<i className="ai ai-web_outlined" />
				<i className="ai ai-arrow_up" />
			</div>
		)}
		{children}
	</components.ValueContainer>
);

const Indicator = () => null;

const SelectComponents = {
	Option,
	SingleValue,
	Control,
	Placeholder: PlaceholderCustom,
	ValueContainer,
	IndicatorsContainer: Indicator,
	IndicatorSeparator: Indicator,
};

const CountrySelect: React.FC<any> = (props) => {
	const list = buildCountriesList(props.locale, props.countries);
	const value: any = list.find((item) => item.value === props.value?.toLowerCase());

	const handleSelectChange = (e: any) => {
		const { name, onSelect } = props;
		onSelect(name, (e && e.value.toUpperCase()) || null);
	};

	return (
		<div className={cn(styles.wrapper, props.containerClassname)}>
			<Select
				{...props}
				options={list}
				isClearable
				styles={{}}
				value={value || ""}
				onChange={handleSelectChange}
				instanceId={props.name}
				label={props.label}
				error={props.error}
				components={SelectComponents}
			/>
			{props.error && (
				<div className={cn(stylesInput.help_text, stylesInput.error)}>{props.error}</div>
			)}
			{props.helpText && !props.error && (
				<div className={stylesInput.help_text}>{props.helpText}</div>
			)}
		</div>
	);
};

export default CountrySelect;

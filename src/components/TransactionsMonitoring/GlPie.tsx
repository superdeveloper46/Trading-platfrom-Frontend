import React, { useCallback, useState } from "react";
import { Cell, Pie, PieChart, Tooltip, TooltipProps, Sector } from "recharts";
import styles from "styles/components/TransactionsMonitoring/PieDataList.module.scss";
import { IScoreDataSourceVisual } from "types/amlReport";

interface Props {
	dataSource: IScoreDataSourceVisual[];
	width?: number;
	height?: number;
}

const CustomTooltip = (props: TooltipProps<string, string>) => {
	const { active, payload } = props;

	if (active) {
		return (
			<div className={styles.custom_tooltip}>
				<p className="label">{payload && payload[0] ? payload[0].payload.tooltip : ""}</p>
			</div>
		);
	}

	return null;
};

const renderActiveShape = (props: any) => {
	const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

	return (
		<g>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius + 6}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
			/>
		</g>
	);
};

const GlPie: React.FC<Props> = ({ dataSource, width = 350, height = 300 }) => {
	const [activeIndex, setActiveIndex] = useState(-1);

	const onPieEnter = useCallback((_, index) => {
		setActiveIndex(index);
	}, []);

	const onPieLeave = useCallback(() => {
		setActiveIndex(-1);
	}, []);

	return (
		<PieChart width={width} height={height}>
			<Pie
				data={dataSource}
				cx={width / 2}
				cy={height / 2}
				innerRadius={width / 2 - 100}
				outerRadius={width / 2 - 40}
				fill="#8884d8"
				paddingAngle={1}
				dataKey="value"
				stroke="none"
				activeIndex={activeIndex}
				activeShape={renderActiveShape}
				onMouseEnter={onPieEnter}
				onMouseLeave={onPieLeave}
			>
				{dataSource.map((entry, index) => (
					<Cell key={`cell-${index}`} fill={entry.itemStyle.color} />
				))}
			</Pie>
			<Tooltip content={<CustomTooltip />} />
		</PieChart>
	);
};

export default GlPie;

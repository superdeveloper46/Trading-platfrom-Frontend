import React from "react";

interface Props {
	sqSize?: number;
	percentage?: number;
	strokeWidth?: number;
	color?: string;
	fontStyle?: React.CSSProperties;
}

const PercentIndicator: React.FC<Props> = React.memo(
	({ sqSize = 200, percentage = 0, strokeWidth = 10, color = "green", fontStyle = {} }) => {
		const radius = (sqSize - strokeWidth) / 2;
		const viewBox = `0 0 ${sqSize} ${sqSize}`;
		const dashArray = radius * Math.PI * 2;
		const dashOffset = dashArray - (dashArray * percentage) / 100;

		return (
			<svg width={sqSize} height={sqSize} viewBox={viewBox}>
				<circle
					className="circle-background"
					cx={sqSize / 2}
					cy={sqSize / 2}
					r={radius}
					strokeWidth={`${strokeWidth}px`}
				/>
				<circle
					className={`circle-progress ${color}`}
					cx={sqSize / 2}
					cy={sqSize / 2}
					r={radius}
					strokeWidth={`${strokeWidth}px`}
					// Start progress marker at 12 O'Clock
					transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
					style={{
						strokeDasharray: dashArray,
						strokeDashoffset: dashOffset,
					}}
				/>
				<text
					className={`circle-text ${color}`}
					x="50%"
					y="50%"
					dy=".3em"
					textAnchor="middle"
					style={{ ...fontStyle }}
				>
					{`${percentage}%`}
				</text>
			</svg>
		);
	},
);

export default PercentIndicator;

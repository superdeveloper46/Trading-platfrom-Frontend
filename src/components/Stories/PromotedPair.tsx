import React from "react";
import cn from "classnames";
import { useIntl } from "react-intl";

import InternalLink from "components/InternalLink";
import { IPromotedPair } from "types/home";
import styles from "styles/pages/Stories.module.scss";
import ExternalImage from "components/ExternalImage";
import { routes } from "constants/routing";

interface IProps {
	pair: IPromotedPair;
}

const PromotedPair: React.FC<IProps> = ({ pair }) => {
	const { formatNumber } = useIntl();
	const [baseCurrency, quoteCurrency] = pair.symbol.split("_");

	return (
		<InternalLink blank className={styles.top_pair} to={routes.trade.getPair(pair.symbol)}>
			<ExternalImage
				src={(pair.image_svg || pair.image_png) as string}
				alt={pair.symbol}
				width="48"
				height="48"
			/>
			<div className={styles.top_pair_header}>
				<b>
					{baseCurrency}
					<i className={`ai ai-${pair.diff >= 0 ? "hint_up" : "hint_down"}`} />
				</b>
				<span className={styles.rate}>
					{formatNumber(pair.last_price, {
						useGrouping: false,
						maximumFractionDigits: 8,
					})}
					&nbsp;
					{quoteCurrency}
				</span>
				<span
					className={cn(styles.diff, {
						[styles.red]: pair.diff < 0,
						[styles.green]: pair.diff > 0,
					})}
				>
					{pair.diff > 0 && "+"}
					{pair.diff ?? "--"}%
				</span>
			</div>
		</InternalLink>
	);
};

export default PromotedPair;

import React, { useCallback, useState } from "react";
import styles from "styles/components/TransactionsMonitoring/Tables.module.scss";
import cn from "classnames";
import ButtonMicro from "components/UI/ButtonMicro";
import { IScoreDataSourceExt, SourcesTypeEnum } from "types/amlReport";
import {
	capitalizeFirstLetter,
	findMinMaxFields,
	formatShare,
	roundShare,
	trancateString,
} from "utils/reportUtils";
import { useIntl } from "react-intl";
import messages from "messages/report";
import GlTag from "../GlTag";

interface Props {
	data: IScoreDataSourceExt;
	type: SourcesTypeEnum;
}

const TxRowMobile: React.FC<Props> = ({ data, type }) => {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const { formatMessage } = useIntl();

	const handleExpandClick = useCallback(() => {
		setIsExpanded((prevState) => !prevState);
	}, []);

	const AddressOrOwner = () =>
		data.emptyOwner || !data.owner ? (
			<div className={styles.link}>{trancateString(data.address || "")}</div>
		) : (
			<div>{capitalizeFirstLetter(data.owner)}</div>
		);

	const ExpandedContent = () => (
		<div className={styles.expanded_content_container}>
			<div className={styles.card_mobile_additional_info}>
				<span>{formatMessage(messages.type_tag)}: </span>
				<div style={{ lineHeight: "1.2" }}>
					{data.funds?.name ? (
						<GlTag score={data.funds.score} tag={capitalizeFirstLetter(data.funds.name)} />
					) : data.funds?.type ? (
						<GlTag score={data.funds.score} tag={capitalizeFirstLetter(data.funds.type)} />
					) : data.typeData ? (
						<GlTag score={data.typeData.score} tag={capitalizeFirstLetter(data.typeData.name)} />
					) : (
						<div>--</div>
					)}
				</div>
			</div>
			<div className={styles.card_mobile_additional_info}>
				<span>{formatMessage(messages.depth)}: </span>
				<span>{findMinMaxFields(data.depth)}</span>
			</div>
			<div className={styles.card_mobile_additional_info}>
				<span>{formatMessage(messages.share)}: </span>
				<span>{formatShare(roundShare(data.share))}</span>
			</div>
		</div>
	);

	return (
		<div className={cn(styles.card_mobile, isExpanded && styles.expanded)}>
			<div className={styles.card_mobile_header}>
				<div className={styles.card_mobile_header_text}>
					<AddressOrOwner />
				</div>
				<div className={cn(styles.card_mobile_action, isExpanded && styles.active)}>
					<ButtonMicro onClick={handleExpandClick}>
						<i className="ai ai-arrow_down" />
					</ButtonMicro>
				</div>
			</div>
			<div className={styles.card_mobile_content}>
				<div className={styles.order_data_item}>
					<div className={styles.order_data_item_title}>{formatMessage(messages.tx_hash)}:</div>
					&nbsp;
					<span className={styles.primary_bold}>{data.tx_hash || "--"}</span>
				</div>
			</div>
			{isExpanded && <ExpandedContent />}
		</div>
	);
};

export default TxRowMobile;

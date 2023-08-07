import React, { useCallback, useState } from "react";
import styles from "styles/components/TransactionsMonitoring/Tables.module.scss";
import cn from "classnames";
import { NavSourcesEnum, SourcesTypeEnum } from "types/amlReport";
import { useIntl } from "react-intl";
import messages from "messages/report";
import ButtonMicro from "../UI/ButtonMicro";

interface Props {
	type: SourcesTypeEnum;
}

const ExpandableList: React.FC<Props> = ({ type, children }) => {
	const { formatMessage } = useIntl();
	const backgroundColor =
		type === SourcesTypeEnum.RISKY
			? "#FF000060"
			: type === SourcesTypeEnum.UNKNOWN
			? "#FFFF0060"
			: "#00FF0060";
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const handleExpandClick = useCallback(() => {
		setIsExpanded((prevState) => !prevState);
	}, []);

	return (
		<div className={cn(styles.card_mobile, isExpanded && styles.expanded)}>
			<div className={styles.card_mobile_header} style={{ backgroundColor }}>
				<div
					className={styles.card_mobile_header_text}
					id={
						type === SourcesTypeEnum.RISKY
							? NavSourcesEnum.RISKY_SOURCES
							: type === SourcesTypeEnum.UNKNOWN
							? NavSourcesEnum.UNKNOWN_SOURCES
							: NavSourcesEnum.KNOWN_SOURCES
					}
				>
					{type === SourcesTypeEnum.RISKY
						? formatMessage(messages.risky_sources)
						: type === SourcesTypeEnum.UNKNOWN
						? formatMessage(messages.unknown_sources)
						: formatMessage(messages.known_sources)}
				</div>
				<div className={cn(styles.card_mobile_action, isExpanded && styles.active)}>
					<ButtonMicro onClick={handleExpandClick}>
						<i className="ai ai-arrow_down" />
					</ButtonMicro>
				</div>
			</div>
			{isExpanded && <div className={styles.expanded_list_content}>{children}</div>}
		</div>
	);
};

export default ExpandableList;

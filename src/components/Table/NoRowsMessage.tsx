import React from "react";
import { useIntl } from "react-intl";
import commonMessages from "messages/common";
import styles from "styles/pages/Table.module.scss";
import cn from "classnames";

interface Props {
	small?: boolean;
	disableHover?: boolean;
	children?: React.ReactNode;
	customMessage?: string;
}

const NoRowsMessage: React.FC<Props> = ({ small, disableHover, children, customMessage }) => {
	const { formatMessage } = useIntl();
	return (
		<div
			className={cn(styles.container, {
				[styles.small]: small,
				[styles.disable_hover]: disableHover,
			})}
		>
			{children || (
				<>
					<i className="ai ai-dok_empty" />
					<span>{customMessage || formatMessage(commonMessages.table_no_data)}</span>
				</>
			)}
		</div>
	);
};

export default NoRowsMessage;

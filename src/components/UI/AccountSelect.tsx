import React from "react";
import { components } from "react-select";
import cn from "classnames";

import styles from "styles/components/UI/AccountSelect.module.scss";
import Select from "./Select";

export interface IAccountSelectLabel {
	login?: string;
	email?: string;
}

export interface IAccountSelectOption {
	label: IAccountSelectLabel;
	value: string;
}

const Option = React.memo(
	({ children, ...props }: { children: IAccountSelectLabel } & Record<string, any>) => (
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		<components.Option {...props}>
			<div className={cn(styles.row, styles.fullWidth)}>
				<div className={styles.row}>
					{children.login}
					{children.email ? <span className={styles.email_label}>({children.email})</span> : null}
				</div>
			</div>
		</components.Option>
	),
	(prevProps, nextProps) => prevProps.label === nextProps.label,
);

const SingleValue = React.memo(
	({ children, ...props }: { children: IAccountSelectLabel } & Record<string, any>) => (
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		<components.SingleValue {...props}>
			<div className={styles.row}>
				{children.login}
				{children.email ? <span className={styles.email_label}>({children.email})</span> : null}
			</div>
		</components.SingleValue>
	),
);

type Props = Record<string, any>;

const AccountSelect: React.FC<Props> = React.memo(({ ...props }) => (
	<Select
		components={{
			Option,
			SingleValue,
		}}
		{...props}
	/>
));

export default AccountSelect;

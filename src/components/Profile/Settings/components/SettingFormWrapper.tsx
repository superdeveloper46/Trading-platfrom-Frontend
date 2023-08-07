import classnames from "classnames";
import React from "react";
import { useIntl } from "react-intl";

import Breadcrumbs from "components/Breadcrumbs";
import styles from "styles/pages/ProfileSettings.module.scss";
import commonMessages from "messages/common";
import InternalLink from "components/InternalLink";
import Button, { ButtonsGroup } from "components/UI/Button";
import SuccessScreen from "components/UI/SuccessScreen";
import { routes } from "constants/routing";

interface IProps {
	breadcrumb: string | React.ReactNode;
	title: string | React.ReactNode;
	subTitle: string;
	onSubmit?(): void | Promise<void>;
	isLoading?: boolean;
	isSuccessful?: boolean;
	content?: boolean;
	footer?: boolean;
}

const SettingFormWrapper: React.FC<IProps> = ({
	breadcrumb,
	title,
	children,
	subTitle,
	isLoading,
	isSuccessful,
	content,
	footer,
	onSubmit,
}) => {
	const { formatMessage } = useIntl();
	return (
		<div className={styles.settings_form_container}>
			<Breadcrumbs
				links={[
					{
						link: routes.settings.root,
						label: formatMessage(commonMessages.settings),
					},
				]}
				current={breadcrumb as string}
			/>
			<div className={classnames(styles.settings_card_container, styles.no_padding)}>
				{!isSuccessful && (
					<>
						<div className={classnames(styles.settings_header, styles.has_border, styles.column)}>
							<div className={styles.settings_card_title}>{title}</div>
							<div className={styles.settings_card_subtitle}>{subTitle}</div>
						</div>
						{!content && children}
						{content && <div className={styles.settings_content}>{children}</div>}
					</>
				)}

				{isSuccessful && (
					<SuccessScreen>
						<InternalLink to={routes.settings.root}>
							<Button
								variant="text"
								color="primary"
								fullWidth
								label={formatMessage(commonMessages.ready)}
							/>
						</InternalLink>
					</SuccessScreen>
				)}
				{footer && (
					<InternalLink className={styles.settings_footer} to={routes.settings.root}>
						<i className="ai ai-chevron_left" />
						{formatMessage(commonMessages.back_btn)}
					</InternalLink>
				)}
			</div>
			{!isSuccessful && onSubmit && !footer && (
				<ButtonsGroup>
					<Button
						variant="filled"
						color="primary"
						fullWidth
						onClick={onSubmit}
						label={formatMessage(commonMessages.submit)}
						isLoading={isLoading}
					/>
					<InternalLink to={routes.settings.root}>
						<Button
							variant="text"
							color="primary"
							fullWidth
							label={formatMessage(commonMessages.back_btn)}
						/>
					</InternalLink>
				</ButtonsGroup>
			)}
		</div>
	);
};

export default SettingFormWrapper;

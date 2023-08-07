import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import cn from "classnames";
import { useIntl } from "react-intl";

import { useMst } from "models/Root";
import commonMessages from "messages/common";
import Button from "components/UI/Button";
import Input from "components/UI/Input";
import styles from "styles/pages/Home.module.scss";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import { routes } from "constants/routing";
import InternalLink from "components/InternalLink";

interface IProps {
	name: string;
}

const RegisterBlock: React.FC<IProps> = ({ name }) => {
	const { global } = useMst();
	const [email, setEmail] = useState<string>("");
	const { formatMessage } = useIntl();
	const localeNavigate = useLocaleNavigate();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handleInputKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && email) {
			localeNavigate(routes.register.getRegisterWithEmail(email));
		}
	};

	return (
		<div
			className={cn(styles.register_block, {
				[styles.authenticated]: global.isAuthenticated,
			})}
		>
			{global.isAuthenticated ? (
				<InternalLink to={routes.trade.root}>
					<Button
						fullWidth
						variant="filled"
						color="secondary"
						iconAlign="left"
						iconCode="trade_new"
						label={formatMessage(commonMessages.standard)}
					/>
				</InternalLink>
			) : (
				<>
					<Input
						name={name}
						value={email}
						onChange={handleInputChange}
						onKeyDown={handleInputKeyDown}
						placeholder={formatMessage(commonMessages.enter_email)}
					/>
					<InternalLink to={routes.register.getRegisterWithEmail(email)}>
						<Button
							fullWidth
							variant="filled"
							color="secondary"
							label={formatMessage(commonMessages.registerAction)}
						/>
					</InternalLink>
				</>
			)}
		</div>
	);
};

export default observer(RegisterBlock);

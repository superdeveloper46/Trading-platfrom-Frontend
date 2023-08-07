import React from "react";
import { useIntl } from "react-intl";

import commonMessages from "messages/common";
import { AuthenticatorVariantEnum } from "types/authenticatorSetup";
import InternalLink from "components/InternalLink";
import Button, { ButtonsGroup } from "components/UI/Button";
import { routes } from "constants/routing";
import AuthenticatorLinks from "./AuthenticatorLinks";
import AuthenticatorVariants from "./AuthenticatorVariants";

interface IAuthenticatorDownloadStepProps {
	variant: AuthenticatorVariantEnum;
	onChangeVariant(variant: AuthenticatorVariantEnum): void;
	handleNextClick(): void;
}

const AuthenticatorDownloadStep: React.FC<IAuthenticatorDownloadStepProps> = ({
	variant,
	onChangeVariant,
	handleNextClick,
}) => {
	const { formatMessage } = useIntl();
	return (
		<>
			<AuthenticatorVariants variant={variant} onChangeVariant={onChangeVariant} />
			<AuthenticatorLinks variant={variant} />
			<ButtonsGroup>
				<Button
					variant="filled"
					color="primary"
					label={formatMessage(commonMessages.continue)}
					fullWidth
					onClick={handleNextClick}
				/>
				<InternalLink to={routes.security.root}>
					<Button
						variant="text"
						color="primary"
						label={formatMessage(commonMessages.back_btn)}
						fullWidth
					/>
				</InternalLink>
			</ButtonsGroup>
		</>
	);
};

export default AuthenticatorDownloadStep;

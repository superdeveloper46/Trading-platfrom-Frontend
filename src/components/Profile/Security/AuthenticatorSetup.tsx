import React, { useEffect, useState } from "react";
import ReactGA from "react-ga";
import classnames from "classnames";
import styles from "styles/components/Profile/Security/AuthenticatorSetup.module.scss";
import { AuthenticatorStepEnum, AuthenticatorVariantEnum } from "types/authenticatorSetup";
import { useMst } from "models/Root";
import {
	ReactGaCompleteArgs,
	ReactGaFormArgs,
	ReactGaOpenArgs,
	ReactGaQrCodeArgs,
} from "constants/authenticatotSetup";
import errorHandler from "utils/errorHandler";
import { IQrCode } from "types/profileSecurity";
import LoadingSpinner from "components/UI/LoadingSpinner";
import AuthenticatorDownloadStep from "./authenticatorSetup/AuthenticatorDownloadStep";
import AuthenticatorQrCodeStep from "./authenticatorSetup/AuthenticatorQrCodeStep";
import AuthenticatorCompletedStep from "./authenticatorSetup/AuthenticatorCompletedStep";

interface IAuthenticatorStepProps {
	step: AuthenticatorStepEnum;
	stepnum: AuthenticatorStepEnum;
}

const AuthenticatorStep: React.FC<IAuthenticatorStepProps> = ({ step, stepnum }) => (
	<div
		className={classnames(styles.step, {
			[styles.pass]: step === AuthenticatorStepEnum.Completed ? step >= stepnum : step > stepnum,
		})}
	>
		<div className={classnames(styles.step_num, { [styles.active]: step >= stepnum })}>
			{stepnum}
		</div>
	</div>
);

interface IProps {
	generateCallback: () => Promise<IQrCode>;
	setupCallback: (token: string) => void;
	subAccountMode?: boolean;
}

const AuthenticatorSetup: React.FC<IProps> = ({
	generateCallback,
	setupCallback,
	subAccountMode,
}) => {
	const {
		account: { profileStatus, loadProfileStatus },
	} = useMst();
	const [step, setStep] = useState<AuthenticatorStepEnum>(AuthenticatorStepEnum.Loading);
	const [maxStep, setMaxStep] = useState<AuthenticatorStepEnum>(AuthenticatorStepEnum.Loading);
	const [variant, setVariant] = useState<AuthenticatorVariantEnum>(AuthenticatorVariantEnum.Alp);
	const [qrCode, setQrCode] = useState<IQrCode>();
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		init();
	}, [profileStatus]);

	useEffect(() => {
		setMaxStep((s) => Math.max(s, step));
	}, [step]);

	useEffect(() => {
		switch (maxStep) {
			case AuthenticatorStepEnum.QrScan:
				ReactGA.event(ReactGaQrCodeArgs);
				ReactGA.event(ReactGaFormArgs);
				break;
			case AuthenticatorStepEnum.Completed:
				ReactGA.event(ReactGaCompleteArgs);
				break;
			default:
				break;
		}
	}, [maxStep]);

	const init = () => {
		if (profileStatus?.two_factor_enabled && !subAccountMode) {
			setStep(AuthenticatorStepEnum.Completed);
			return;
		}
		if (!(subAccountMode && step === AuthenticatorStepEnum.Completed)) {
			generate();
			setStep(AuthenticatorStepEnum.Download);
			ReactGA.event(ReactGaOpenArgs);
		}
	};

	const generate = async () => {
		try {
			setLoading(true);
			setQrCode(await generateCallback());
		} catch (err) {
			errorHandler(err);
		} finally {
			setLoading(false);
		}
	};

	const handleNextClick = (): void => setStep((prevState) => prevState + 1);

	const handlePrevClick = (): void => setStep((prevState) => prevState - 1);

	const onChangeVariant = (varaint: AuthenticatorVariantEnum) => setVariant(varaint);

	const onSuccess = () => {
		loadProfileStatus();
		setStep(AuthenticatorStepEnum.Completed);
	};

	return (
		<div className={styles.container}>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<div className={styles.steps}>
						<AuthenticatorStep step={step} stepnum={AuthenticatorStepEnum.Download} />
						<AuthenticatorStep step={step} stepnum={AuthenticatorStepEnum.QrScan} />
						<AuthenticatorStep step={step} stepnum={AuthenticatorStepEnum.Completed} />
					</div>
					{step === AuthenticatorStepEnum.Download && (
						<AuthenticatorDownloadStep
							variant={variant}
							onChangeVariant={onChangeVariant}
							handleNextClick={handleNextClick}
						/>
					)}
					{step === AuthenticatorStepEnum.QrScan && (
						<AuthenticatorQrCodeStep
							qrCode={qrCode}
							setupCallback={setupCallback}
							onSuccess={onSuccess}
							handlePrevClick={handlePrevClick}
						/>
					)}
					{step === AuthenticatorStepEnum.Completed && (
						<AuthenticatorCompletedStep subAccountMode={subAccountMode} />
					)}
				</>
			)}
		</div>
	);
};

export default AuthenticatorSetup;

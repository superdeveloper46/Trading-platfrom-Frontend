import React, { useEffect, useState } from "react";
import dayjs from "utils/dayjs";
import { observer } from "mobx-react-lite";
import ConfirmForm from "components/ConfirmWithdrawal/ConfirmForm";
import styles from "styles/components/ConfirmationComponents.module.scss";
import { SecureTokenTypeEnum } from "types/secureToken";
import { useParams } from "react-router-dom";
import { useMst } from "models/Root";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import { getPageTitle } from "helpers/global";
import financeMessages from "messages/finance";
import { ScreenCanceled, ScreenConfirmed, ScreenTimeHasExpired } from "../components/StatusScreens";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { NotFoundError } from "../components/Error";

const ConfirmWithdrawal: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();
	const {
		confirmWithdrawal: model,
		account: { loadBalances },
	} = useMst();
	const { formatMessage } = useIntl();
	const { info, isLoading } = model;
	const [tokenType, setTokenType] = useState<SecureTokenTypeEnum>();
	const [isCancelled, setIsCancelled] = useState<boolean>(false);
	const title = getPageTitle(formatMessage(financeMessages.withdraw_confirming));

	useEffect(() => {
		if (slug) {
			model.getWithdrawDetails(slug);
		}
	}, [slug]);

	useEffect(() => {
		if (info) {
			if (info.is_totp_required && !info.is_totp_ok) {
				setTokenType(SecureTokenTypeEnum.OTPCODE);
			} else if (info.is_pincode_required && !info.is_pincode_ok) {
				setTokenType(SecureTokenTypeEnum.PINCODE);
			}
		}
	}, [info?.is_totp_required, info?.is_pincode_required, info?.is_totp_ok, info?.is_pincode_ok]);

	useEffect(
		() => () => {
			model.setWithdrawInfo(null);
		},
		[],
	);

	const handleSuccess = (info: any) => {
		model.setWithdrawInfo(info);
		loadBalances();
	};

	const handleCancel = () => {
		if (slug) {
			model.cancelWithdraw(slug).then(() => {
				setIsCancelled(true);
			});
		}
	};

	const renderContent = (): JSX.Element | null => {
		if (isLoading) return <LoadingSpinner />;
		if (!info) return <NotFoundError />;
		if (isCancelled) {
			return (
				<ScreenCanceled type="withdrawal" currency={info.currency?.code} amount={info.amount} />
			);
		}
		if (dayjs(info.deadline_at).isBefore(Date.now()) && !info.is_ok) {
			return (
				<ScreenTimeHasExpired
					type="withdrawal"
					currency={info.currency?.code}
					amount={info.amount}
				/>
			);
		}
		if (info.is_ok) {
			return (
				<ScreenConfirmed type="withdrawal" currency={info.currency?.code} amount={info.amount} />
			);
		}
		return (
			<ConfirmForm
				info={info}
				tokenType={tokenType}
				onSuccess={handleSuccess}
				onCancel={handleCancel}
			/>
		);
	};

	return (
		<>
			<Helmet
				title={title}
				meta={[
					{ name: "description", content: title },
					{ property: "og:title", content: title },
					{ property: "twitter:title", content: title },
					{ property: "og:description", content: title },
					{ name: "twitter:description", content: title },
				]}
			/>
			<div className={styles.container}>{renderContent()}</div>
		</>
	);
};

export default observer(ConfirmWithdrawal);

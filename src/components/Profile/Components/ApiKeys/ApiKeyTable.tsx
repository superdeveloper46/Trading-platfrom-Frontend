import useWindowSize from "hooks/useWindowSize";
import React, { useEffect, useState } from "react";
import styles from "styles/components/Profile/Dashboard/DashboardApi.module.scss";
import { useMst } from "models/Root";
import Table from "components/UI/Table/Table";
import NoRowsMessage from "components/Table/NoRowsMessage";
import { observer } from "mobx-react-lite";
import LoadingSpinner from "components/UI/LoadingSpinner";
import { ApiKeysColumns } from "./ApiCommon";
import ApiKeyRow from "./ApiKeyRow";
import ApiKeyRowMobile from "./ApiKeyRowMobile";
import DeleteApiKeyModal from "./DeleteApiKeyModal";

interface IProps {
	mobileClassName?: string;
}

const ApiKeyTable: React.FC<IProps> = ({ mobileClassName }) => {
	const { desktop } = useWindowSize();
	const {
		apiKeys: { isLoading, apiKeys, getApiKeys },
	} = useMst();

	const [showModal, setShowModal] = useState<boolean>(false);
	const [modalData, setModalData] = useState<{ slug: string; label: string }>({
		slug: "",
		label: "",
	});

	const handleCloseModal = () => {
		setShowModal(false);
		setModalData({
			slug: "",
			label: "",
		});
	};

	const onDeleteApiKey = (slug: string, label: string) => {
		setModalData({
			slug,
			label,
		});
		setShowModal(true);
	};

	return (
		<>
			<DeleteApiKeyModal
				isOpen={showModal}
				label={modalData.label}
				slug={modalData.slug}
				onClose={handleCloseModal}
			/>
			{desktop ? (
				<Table
					header={{ columns: ApiKeysColumns, advanced: true, primary: true }}
					className={styles.table_container}
				>
					{isLoading ? (
						<LoadingSpinner verticalMargin="30px" />
					) : apiKeys.length ? (
						apiKeys.map((apiKey, index) => (
							<ApiKeyRow key={index} apiKey={apiKey} onDelete={onDeleteApiKey} />
						))
					) : (
						<NoRowsMessage />
					)}
				</Table>
			) : (
				<div className={mobileClassName}>
					{isLoading ? (
						<LoadingSpinner verticalMargin="30px" />
					) : apiKeys.length ? (
						apiKeys.map((apiKeys, index) => (
							<ApiKeyRowMobile key={index} apiKey={apiKeys} onDelete={onDeleteApiKey} />
						))
					) : (
						<NoRowsMessage />
					)}
				</div>
			)}
		</>
	);
};

export default observer(ApiKeyTable);

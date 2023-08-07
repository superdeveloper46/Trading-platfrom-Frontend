import { IOrder } from "models/History";
import { useState } from "react";
import { useIntl } from "react-intl";
import { transformDate } from "utils/dayjs";

export const useActiveOrderRow = (order: IOrder) => {
	const { formatNumber, formatMessage } = useIntl();
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const pairSymbols: string[] = order?.symbol?.split("_") ?? [];
	const date = transformDate(order?.date ?? 0);

	const toggle = () => setIsExpanded(!isExpanded);

	const onOpenModal = () => setModalOpen(true);
	const onCloseModal = () => setModalOpen(false);
	return {
		formatNumber,
		formatMessage,
		isExpanded,
		setIsExpanded,
		modalOpen,
		onCloseModal,
		onOpenModal,
		toggle,
		pairSymbols,
		date,
	};
};

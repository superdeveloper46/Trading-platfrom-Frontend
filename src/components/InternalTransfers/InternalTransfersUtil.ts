import { IInternalTransferHistory } from "types/internal_transfers";
import dayjs from "dayjs";
import { TransferStatusColors } from "constants/internal_transfers";
import internalTransfersMessages from "messages/transfers";
import commonMessages from "messages/common";
import halvingMessages from "messages/halving";
import { IBalance } from "models/Account";
import { IOption } from "components/UI/CurrencySelect";
import { MessageFormatter } from "../../types/general";

export const getColor = (transfer: IInternalTransferHistory) => {
	if (transfer.status.key === 10 && dayjs(transfer.valid_till).isAfter(dayjs(Date.now())))
		return TransferStatusColors.Red;
	if (transfer.status.key === 10 && transfer.is_outgoing) return TransferStatusColors.Grey;
	if (transfer.can_accept) return TransferStatusColors.Blue;
	if (transfer.can_cancel) return TransferStatusColors.Red;
	if (transfer.status.key === 10) return TransferStatusColors.Blue;
	return "";
};

export const getAmountColor = (transfer: IInternalTransferHistory) => {
	if (transfer.status.key === 20) return TransferStatusColors.Grey;
	if (!transfer.is_outgoing) return TransferStatusColors.Green;
	if (transfer.is_outgoing) return TransferStatusColors.Red;
	return "";
};

export const getDateLabelColor = (transfer: IInternalTransferHistory) => {
	if (transfer.status.key === 10 && transfer.is_outgoing && transfer.can_cancel)
		return TransferStatusColors.Red;
	if (transfer.status.key === 10 && transfer.can_accept && !transfer.is_outgoing)
		return TransferStatusColors.Blue;
	if (transfer.status.key === 10 && transfer.is_outgoing) return TransferStatusColors.LightBlue;
	if (transfer.status.key === 20) return TransferStatusColors.Red;
	if (dayjs(transfer.valid_till).isBefore(dayjs(Date.now()))) return TransferStatusColors.Red;
	return "";
};

export const getStatusLabel = (
	transfer: IInternalTransferHistory,
	formatMessage: MessageFormatter,
): string => {
	const now = Date.now();

	if (
		transfer.status.key === 10 &&
		transfer.is_outgoing &&
		dayjs(transfer.valid_till).isAfter(dayjs(now))
	) {
		return formatMessage(internalTransfersMessages.transfer_sent_activation);
	}

	if (
		transfer.status.key === 10 &&
		transfer.can_accept &&
		!transfer.is_outgoing &&
		dayjs(transfer.valid_till).isAfter(dayjs(now))
	) {
		return formatMessage(internalTransfersMessages.transfer_received_activation);
	}

	if (transfer.status.key === 10 && dayjs(transfer.valid_till).isBefore(dayjs(now))) {
		return formatMessage(commonMessages.status_overdue);
	}

	if (transfer.status.key === 20) {
		return formatMessage(commonMessages.status_canceled);
	}

	if (transfer.status.key === 30) {
		return formatMessage(commonMessages.status_sent);
	}

	return "";
};

export const getUnitOfTime = (diff: number, formatMessage: MessageFormatter) => {
	const absDiff = Math.abs(diff);

	if (absDiff > 86400) {
		return formatMessage(halvingMessages.days);
	}

	if (absDiff < 86400 && absDiff > 3600) {
		return formatMessage(halvingMessages.hours);
	}

	if (absDiff < 3600 && absDiff > 0) {
		return formatMessage(halvingMessages.minutes);
	}

	return "--";
};

export const getUnitValue = (diff: number): number => {
	const absDiff = Math.abs(diff);

	if (absDiff > 86400) {
		return Math.round(absDiff / 86400);
	}

	if (absDiff < 86400 && absDiff > 3600) {
		return Math.floor(absDiff / 3600);
	}

	if (absDiff < 3600) {
		return absDiff / 60;
	}

	return 0;
};

export const getStatusIcon = (status: number) => {
	switch (status) {
		case 30:
			return "ai ai-check_filled";
		case 20:
			return "ai ai-cancel_filled";
		default:
			return "";
	}
};

export const getStatusIconColor = (status: number) => {
	switch (status) {
		case 30:
			return "var(--color-green)";
		case 20:
			return "var(--color-red)";
		default:
			return "";
	}
};

export const processBalances = (balances?: IBalance[]): IOption[] => {
	if (!Array.isArray(balances)) return [];
	return [...balances]
		.sort((a, b) => {
			const usdTA = (a.valuation.USDT ?? 0) * +a.balance;
			const usdTB = (b.valuation.USDT ?? 0) * +b.balance;
			return usdTB - usdTA;
		})
		.map((b) => ({
			label: {
				code: b.code,
				name: b.name,
				available: b.available.toString(),
				precision: b.precision ?? 8,
				disabled: !b.is_withdraw_enabled,
				image_png: b.image_png ?? "",
				image_svg: b.image_svg ?? "",
			},
			value: b.code,
		}));
};

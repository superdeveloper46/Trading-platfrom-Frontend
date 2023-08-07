import { WithdrawalStatusesEnum } from "types/withdrawal";
import { BadgeBackgroundColorEnum } from "components/UI/Badge";

export const badgeColor = (status: WithdrawalStatusesEnum): BadgeBackgroundColorEnum => {
	switch (status) {
		case WithdrawalStatusesEnum.WITHDRAW_STATUS_NEW:
			return BadgeBackgroundColorEnum.BLUE;
		case WithdrawalStatusesEnum.WITHDRAW_STATUS_CONFIRMED:
			return BadgeBackgroundColorEnum.ORANGE;
		case WithdrawalStatusesEnum.WITHDRAW_STATUS_VERIFIED:
			return BadgeBackgroundColorEnum.ORANGE;
		case WithdrawalStatusesEnum.WITHDRAW_STATUS_PROCESSING:
			return BadgeBackgroundColorEnum.ORANGE;
		case WithdrawalStatusesEnum.WITHDRAW_STATUS_DONE:
			return BadgeBackgroundColorEnum.GREEN;
		case WithdrawalStatusesEnum.WITHDRAW_STATUS_REFUSED:
			return BadgeBackgroundColorEnum.RED;
		case WithdrawalStatusesEnum.WITHDRAW_STATUS_CANCELLED:
			return BadgeBackgroundColorEnum.LIGHT_GREY_DISABLED;
		default:
			return BadgeBackgroundColorEnum.LIGHT_GREY_DISABLED;
	}
};

export const getWithdrawStatus = (status: number): string => {
	switch (status) {
		case 10:
			return "active";
		case 20:
			return "moderation";
		default:
			return "";
	}
};

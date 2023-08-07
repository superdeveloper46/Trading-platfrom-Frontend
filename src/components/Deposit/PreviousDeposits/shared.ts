import { DepositStatusesEnum } from "types/deposit";
import { BadgeBackgroundColorEnum } from "../../UI/Badge";

export const badgeColor = (status: DepositStatusesEnum): BadgeBackgroundColorEnum => {
	switch (status) {
		case DepositStatusesEnum.Pending:
			return BadgeBackgroundColorEnum.ORANGE;
		case DepositStatusesEnum.Confirmed:
			return BadgeBackgroundColorEnum.GREEN;
		case DepositStatusesEnum.Moderation:
			return BadgeBackgroundColorEnum.LIGHT_GREY;
		case DepositStatusesEnum.Rejected:
			return BadgeBackgroundColorEnum.LIGHT_GREY_DISABLED;
		default:
			return BadgeBackgroundColorEnum.LIGHT_GREY_DISABLED;
	}
};

import { toast } from "react-toastify";
import React from "react";
import { useIntl } from "react-intl";

import commonMessages from "messages/common";

const useCopyClick = () => {
	const { formatMessage } = useIntl();

	return (text: string | number, message?: React.ReactNode) => {
		window.navigator.clipboard.writeText(text.toString());
		toast(
			<>
				<i className="ai ai-copy_new" />
				{message || formatMessage(commonMessages.copied)}
			</>,
		);
	};
};

export default useCopyClick;

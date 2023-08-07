import React from "react";
import { useIntl } from "react-intl";

import Accordion from "components/UI/Accordion";
import p2pMessages from "messages/p2p";

const FAQ: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<Accordion
			plain
			title={formatMessage(p2pMessages.faq_title)}
			sections={[
				{
					label: formatMessage(p2pMessages.faq_label_1),
					value: formatMessage(p2pMessages.faq_desc_1),
				},
				{
					label: formatMessage(p2pMessages.faq_label_2),
					value: formatMessage(p2pMessages.faq_desc_2),
				},
				{
					label: formatMessage(p2pMessages.faq_label_3),
					value: formatMessage(p2pMessages.faq_desc_3),
				},
				{
					label: formatMessage(p2pMessages.faq_label_4),
					value: formatMessage(p2pMessages.faq_desc_4),
				},
				{
					label: formatMessage(p2pMessages.faq_label_5),
					value: formatMessage(p2pMessages.faq_desc_5),
				},
				{
					label: formatMessage(p2pMessages.faq_label_6),
					value: formatMessage(p2pMessages.faq_desc_6),
				},
				{
					label: formatMessage(p2pMessages.faq_label_7),
					value: formatMessage(p2pMessages.faq_desc_7),
				},
				{
					label: formatMessage(p2pMessages.faq_label_8),
					value: formatMessage(p2pMessages.faq_desc_8),
				},
				{
					label: formatMessage(p2pMessages.faq_label_9),
					value: formatMessage(p2pMessages.faq_desc_9),
				},
				{
					label: formatMessage(p2pMessages.faq_label_10),
					value: formatMessage(p2pMessages.faq_desc_10),
				},
			]}
		/>
	);
};

export default FAQ;

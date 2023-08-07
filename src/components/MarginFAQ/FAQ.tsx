import React from "react";
import { useIntl } from "react-intl";
import messages from "messages/margin_faq";
import Accordion from "components/UI/Accordion";
import styles from "styles/pages/MarginFAQ.module.scss";
import pageStyles from "styles/pages/Page.module.scss";

const FAQ: React.FC = () => {
	const { formatMessage } = useIntl();

	return (
		<section className={pageStyles.section_container}>
			<div className={styles.qa_container}>
				<Accordion
					plain
					sections={[
						{
							label: formatMessage(messages.faq_1_title),
							value: formatMessage(messages.faq_1_description),
						},
						{
							label: formatMessage(messages.faq_2_title),
							value: formatMessage(messages.faq_2_description),
						},
						{
							label: formatMessage(messages.faq_3_title),
							value: formatMessage(messages.faq_3_description),
						},
						{
							label: formatMessage(messages.faq_4_title),
							value: formatMessage(messages.faq_4_description),
						},
						{
							label: formatMessage(messages.faq_5_title),
							value: formatMessage(messages.faq_5_description),
						},
						{
							label: formatMessage(messages.faq_6_title),
							value: formatMessage(messages.faq_6_description),
						},
						{
							label: formatMessage(messages.faq_7_title),
							value: formatMessage(messages.faq_7_description),
						},
						{
							label: formatMessage(messages.faq_8_title),
							value: formatMessage(messages.faq_8_description),
						},
						{
							label: formatMessage(messages.faq_9_title),
							value: formatMessage(messages.faq_9_description),
						},
						{
							label: formatMessage(messages.faq_10_title),
							value: formatMessage(messages.faq_10_description),
						},
						{
							label: formatMessage(messages.faq_11_title),
							value: formatMessage(messages.faq_11_description),
						},
					]}
				/>
			</div>
		</section>
	);
};

export default FAQ;

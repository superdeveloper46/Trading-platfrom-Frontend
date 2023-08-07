import React from "react";
import { useIntl } from "react-intl";
import styles from "styles/pages/SocialListing.module.scss";
import rocketIcon from "assets/images/listing/rocket.svg";
import graphIcon from "assets/images/listing/graph.svg";
import mediaIcon from "assets/images/listing/media.svg";
import messages from "messages/listing";

const HowItWorks: React.FC = () => {
	const { formatMessage } = useIntl();

	const list = [
		{
			imgSrc: rocketIcon,
			label: formatMessage(messages.instruction_item1),
			description: formatMessage(messages.instruction_item1_desc),
		},
		{
			imgSrc: mediaIcon,
			label: formatMessage(messages.instruction_item2),
			description: formatMessage(messages.instruction_item2_desc),
		},
		{
			imgSrc: graphIcon,
			label: formatMessage(messages.instruction_item3),
			description: formatMessage(messages.instruction_item3_desc),
		},
	];

	return (
		<div className={styles.how_it_works}>
			<div className={styles.how_it_works_title}>
				<h3>{formatMessage(messages.instruction_header)}</h3>
				<span>{formatMessage(messages.instruction_desc)}</span>
			</div>
			<div className={styles.how_it_works_list}>
				{list.map(({ label, imgSrc, description }) => (
					<div key={label} className={styles.how_it_works_list_item}>
						<img src={imgSrc} alt={label} />
						<b>{label}</b>
						<span>{description}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default HowItWorks;

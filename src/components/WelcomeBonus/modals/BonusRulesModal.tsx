import React from "react";
import { useIntl } from "react-intl";

import messages from "messages/welcome_bonus";
import styles from "styles/pages/WelcomeBonus.module.scss";
import Modal, { Content } from "components/UI/Modal";

const rules = [messages.rule_1, messages.rule_2, messages.rule_3, messages.rule_4, messages.rule_5];

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const BonusRulesModal: React.FC<Props> = ({ onClose, isOpen }) => {
	const { formatMessage } = useIntl();

	return (
		<Modal label={formatMessage(messages.rules)} isOpen={isOpen} onClose={onClose}>
			<Content>
				{rules.map((rule, idx) => (
					<span key={idx} className={styles.modal_rule_item}>
						{idx + 1}. {formatMessage(rule)}
					</span>
				))}
			</Content>
		</Modal>
	);
};

export default BonusRulesModal;

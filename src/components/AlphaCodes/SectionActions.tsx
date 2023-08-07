import React, { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import messages from "messages/alpha_codes";
import AplhImg1 from "assets/images/alpha_codes/alph_1.svg";
import AplhImg2 from "assets/images/alpha_codes/alph_2.svg";
import AplhImg3 from "assets/images/alpha_codes/alph_3.svg";
import styles from "styles/components/AlphaCodes.module.scss";
import Button from "components/UI/Button";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";
import cn from "classnames";
import ModalActivate from "./ModalActivate";
import ModalCreate from "./CreateAlphaCodeModal";

const AlphaCodesActions: React.FC = () => {
	const { formatMessage } = useIntl();

	const {
		global: { isAuthenticated },
	} = useMst();

	const [createModalShown, setShowCreateModal] = useState<boolean>(false);
	const [activateModalShown, setShowActivateModal] = useState<boolean>(false);

	const showActivateModal = useCallback((): void => {
		setShowActivateModal(true);
	}, []);

	const showCreateModal = useCallback((): void => {
		setShowCreateModal(true);
	}, []);

	const handleCloseModal = useCallback((): void => {
		setShowCreateModal(false);
		setShowActivateModal(false);
	}, []);

	return (
		<div className={cn(styles.codes_section, styles.action_screen_section)}>
			<ModalCreate isOpen={createModalShown} onClose={handleCloseModal} />
			<ModalActivate isOpen={activateModalShown} onClose={handleCloseModal} />
			<h2 className={styles.title}>{formatMessage(messages.alpha_code)}</h2>
			<div className={styles.subtitle}>{formatMessage(messages.instruction_desc)}</div>
			<div className={styles.alph_images_block}>
				<div className={styles.img_block}>
					<img src={AplhImg1} alt="alp-coin" />
					<div className={styles.img_block_title}>{formatMessage(messages.img_1_title)}</div>
					<div className={styles.img_block_description}>{formatMessage(messages.img_1_desc)}</div>
				</div>
				<div className={styles.img_block}>
					<img src={AplhImg2} alt="alp-coin" />
					<div className={styles.img_block_title}>{formatMessage(messages.img_2_title)}</div>
					<div className={styles.img_block_description}>{formatMessage(messages.img_2_desc)}</div>
				</div>
				<div className={styles.img_block}>
					<img src={AplhImg3} alt="alp-coin" />
					<div className={styles.img_block_title}>{formatMessage(messages.img_3_title)}</div>
					<div className={styles.img_block_description}>{formatMessage(messages.img_3_desc)}</div>
				</div>
			</div>

			{isAuthenticated && (
				<div className={styles.buttons_container}>
					<Button
						label={formatMessage(messages.create_coupon)}
						onClick={showCreateModal}
						variant="filled"
						fullWidth
						color="primary"
					/>
					<Button
						label={formatMessage(messages.button_name)}
						onClick={showActivateModal}
						variant="text"
						color="primary"
						fullWidth
					/>
				</div>
			)}
		</div>
	);
};

export default observer(AlphaCodesActions);

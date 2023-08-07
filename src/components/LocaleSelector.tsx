import React, { useState } from "react";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { useMst } from "models/Root";
import styles from "styles/components/LocaleSelector.module.scss";
import Tooltip from "components/UI/Tooltip";
import { PositionStylesEnum } from "types/shell";
import LocaleMenu from "./LocaleMenu";
import LanguageSettingsModal from "./LanguageSettingsModal";

interface IProps {
	className?: string;
	wrapperClassName?: string;
	isLanding?: boolean;
	id: string;
	modalMode?: boolean;
}

const LocaleSelector: React.FC<IProps> = ({
	className,
	wrapperClassName,
	isLanding,
	modalMode = false,
	id,
}) => {
	const {
		global: { locale },
	} = useMst();

	const [isLocaleModalOpened, toggleLocaleModal] = useState(false);
	const [isLocaleMenuOpen, setIsLocaleMenuOpen] = useState<boolean>(false);

	const handleAfterShowLocale = () => setIsLocaleMenuOpen(true);
	const handleAfterHideLocale = () => setIsLocaleMenuOpen(false);

	const handleOnClick = () => {
		if (!isLocaleModalOpened) {
			toggleLocaleModal(true);
		}
	};

	const handleCloseModal = () => {
		toggleLocaleModal(false);
	};

	return (
		<div
			className={cn(wrapperClassName, styles.wrapper)}
			{...(modalMode ? { onClick: handleOnClick } : {})}
		>
			{modalMode ? (
				<div className={cn(styles.container, className, { [styles.landing]: isLanding })}>
					{locale}
					<i
						className={cn("ai ai-chevron_up", {
							[styles.menuOpen]: isLocaleMenuOpen,
						})}
					/>
				</div>
			) : (
				<Tooltip
					id={`locale_${id}`}
					clickable
					afterShow={handleAfterShowLocale}
					afterHide={handleAfterHideLocale}
					className={styles.menu}
					contentClassName={styles.tooltip_content}
					place={PositionStylesEnum.RIGHT}
					arrowColor="transparent"
					padding="0"
					opener={
						<div className={cn(styles.container, className, { [styles.landing]: isLanding })}>
							{locale}
							<i className={`ai ai-chevron_${isLocaleMenuOpen ? "up" : "down"}`} />
						</div>
					}
				>
					<LocaleMenu />
				</Tooltip>
			)}
			<LanguageSettingsModal isOpen={isLocaleModalOpened} onClose={handleCloseModal} />
		</div>
	);
};

export default observer(LocaleSelector);

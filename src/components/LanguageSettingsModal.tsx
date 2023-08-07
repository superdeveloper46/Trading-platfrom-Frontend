import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import cookies from "js-cookie";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import commonMessages from "messages/common";
import { appLocales, availableLocales } from "providers/LanguageProvider/i18n";
import { useMst } from "models/Root";
import Modal, { ActionGroup, BodyContainer, Footer } from "components/UI/Modal";
import styles from "styles/components/LanguageSettingsModal.module.scss";
import RadioChoice from "components/UI/Radio";
import Button from "components/UI/Button";
import CheckBox from "components/UI/CheckBox";
import { changeContentLocale } from "providers/LanguageProvider/LanguageProvider";
import { CONTENT_LOCALE_CACHE_KEY } from "utils/cacheKeys";
import { queryVars } from "constants/query";
import usePathname from "hooks/usePathname";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const LanguageSettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
	const { search } = useLocation();
	const pathname = usePathname();
	const navigate = useNavigate();
	const { formatMessage } = useIntl();
	const { global, render } = useMst();
	const { locale: currentLocale } = useParams();

	const [locale, setLocale] = useState<string>(currentLocale ?? "");
	const [contentLocale, setContentLocale] = useState<string[]>([]);
	const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

	useEffect(() => {
		const contentCookie: string = cookies.get(CONTENT_LOCALE_CACHE_KEY) || "";
		setContentLocale(contentCookie ? contentCookie.split("+") : []);
	}, []);

	const handleLocaleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setLocale(e.target.value);
	};

	const handleSubmit = async () => {
		setIsSubmitLoading(true);
		changeContentLocale(contentLocale);
		global.setLocale(locale);
		const nextPath = [...availableLocales, ""].includes(pathname) ? "" : pathname;
		navigate({
			[queryVars.pathname]: `/${locale}/${nextPath}`,
			[queryVars.search]: search,
		});
		setIsSubmitLoading(false);
		onClose();
	};

	const handleContentLocale = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { name } = e.target;
		let list = [...contentLocale];

		if (contentLocale.indexOf(name) > -1) {
			list = contentLocale.filter((i) => i !== name);
		} else {
			list.push(name);
		}
		setContentLocale(list);
	};

	return (
		<Modal
			label={formatMessage(commonMessages.language_setting)}
			iconClassName="ai ai-web_outlined"
			isOpen={isOpen}
			onClose={onClose}
		>
			<BodyContainer>
				<div className={styles.content_section}>
					<span className={styles.section_title}>
						{formatMessage(commonMessages.language_interface)}
					</span>
					<span className={styles.section_desc}>
						{formatMessage(commonMessages.language_interface_text)}
					</span>
					<div className={styles.locales_block}>
						{appLocales.map((localeObj) => (
							<div className={styles.locale_container} key={localeObj.value}>
								<RadioChoice
									onChange={handleLocaleChange}
									label={localeObj.name}
									value={locale}
									name="language"
									choice={localeObj.value}
								/>
							</div>
						))}
					</div>
				</div>
				{render.stories && (
					<>
						<div className={styles.divider_block}>
							<div className={styles.divider} />
						</div>
						<div className={styles.content_section}>
							<span className={styles.section_title}>
								{formatMessage(commonMessages.language_content)}
							</span>
							<span className={styles.section_desc}>
								{formatMessage(commonMessages.language_content_text)}
							</span>
							<div className={styles.locales_block}>
								{appLocales.map((l: { name: string; value: string }) => (
									<div
										className={cn(styles.locale_container, styles.check_container)}
										key={l.value}
									>
										<CheckBox
											name={l.value}
											checked={contentLocale.indexOf(l.value) > -1}
											onChange={handleContentLocale}
										>
											{l.name}
										</CheckBox>
									</div>
								))}
							</div>
						</div>
					</>
				)}
			</BodyContainer>
			<Footer>
				<ActionGroup>
					<Button
						fullWidth
						variant="filled"
						color="primary"
						onClick={handleSubmit}
						isLoading={isSubmitLoading}
						label={formatMessage(commonMessages.confirm)}
					/>
					{/* <Button
						variant="outlined"
						color="primary"
						onClick={onClose}
						fullWidth
						label={formatMessage(commonMessages.back_btn)}
					/> */}
				</ActionGroup>
			</Footer>
		</Modal>
	);
};

export default observer(LanguageSettingsModal);

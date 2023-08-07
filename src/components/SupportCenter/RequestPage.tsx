import React, { useState, KeyboardEvent, useCallback } from "react";
import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";

import lines_img_light from "assets/images/support_center/lines_support_light.svg";
import lines_img_dark from "assets/images/support_center/lines_support_dark.svg";
import support_img_dark from "assets/images/support_center/24_support_dark.svg";
import support_img_light from "assets/images/support_center/24_support_light.svg";
import messages from "messages/support";
import common_messages from "messages/common";
import styles from "styles/pages/SupportCenter.module.scss";
import { useMst } from "models/Root";
import { socialNetworks } from "constants/socialNetworks";
import InternalLink from "components/InternalLink";
import { routes } from "constants/routing";
import useLocaleNavigate from "hooks/useLocaleNavigate";
import SearchInput from "./SearchInput";
import RequestForm from "./RequestForm";

const RequestPage: React.FC = () => {
	const {
		global: { theme, locale },
		render,
	} = useMst();
	const localeNavigate = useLocaleNavigate();
	const [search, setSearch] = useState<string>("");
	const { formatMessage } = useIntl();

	const handleSearch = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
		[],
	);

	const onKeyDown = useCallback(
		(e: KeyboardEvent<Element>) => {
			if (e.key === "Enter" && search.length > 0) {
				localeNavigate(routes.support.getSearchValue(search));
			}
		},
		[search, locale],
	);

	return (
		<div className={styles.support_center_wrapper}>
			<div className={styles.support_center_block}>
				{render.supportCenter && (
					<>
						<InternalLink to={routes.support.root}>
							<div className={styles.support_center_label}>
								<i className="ai ai-chevron_left" />
								{formatMessage(messages.support_center)}
							</div>
						</InternalLink>
						<div className={styles.support_center_header_block}>
							<div className={styles.input_container}>
								<div className={styles.search_input_wrapper}>
									<SearchInput
										name="search"
										onChange={handleSearch}
										value={search}
										placeholder={formatMessage(common_messages.search)}
										onKeyDown={onKeyDown}
									/>
								</div>
							</div>
						</div>
					</>
				)}
				<div className={styles.support_center_content}>
					<div className={styles.request_content}>
						<div className={styles.header_images}>
							<div className={styles.support_img}>
								<img
									src={theme === "light" ? support_img_light : support_img_dark}
									alt="24/7 Support"
								/>
							</div>
							<div className={styles.lines_img_block}>
								<img
									src={theme === "light" ? lines_img_light : lines_img_dark}
									alt="Support Request"
								/>
							</div>
						</div>
						<div className={styles.request_form_content}>
							<div className={styles.request_page_header}>
								{formatMessage(messages.support_request_header)}
							</div>
							<div className={styles.page_desc}>{formatMessage(messages.support_request_desc)}</div>
							<RequestForm />
							<div className={styles.tg_address_block}>
								<div className={styles.tg_address_block_text}>
									<i className="ai ai-chat" />
									<div className={styles.tg_address_text}>
										{formatMessage(messages.support_tg_address)}
										&nbsp;
										<a
											href={
												locale === "en"
													? "https://telegram.me/btcalpha"
													: "https://t.me/btcalpha_ru"
											}
											target="_blank"
											rel="noopener noreferrer"
										>
											@BTC-Alpha_support
										</a>
									</div>
								</div>
							</div>
							<div className={styles.tg_community_text}>
								{formatMessage(messages.support_tg_join, {
									link: (
										<a
											href={
												locale === "en"
													? "https://telegram.me/btcalpha"
													: "https://t.me/btcalpha_ru"
											}
											target="_blank"
											rel="noopener noreferrer"
										>
											{locale === "en" ? "t.me/btcalpha " : "t.me/btcalpha_ru "}
											<i className="ai ai-web_link" />
										</a>
									),
								})}
							</div>
						</div>
					</div>
					<div className={styles.social_link_container}>
						<div className={styles.icons}>
							{socialNetworks(locale).map((n) => (
								<a
									href={n.link}
									key={n.link}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={n.label}
								>
									<i className={`ai ai-${n.icon}`} />
								</a>
							))}
						</div>
						{formatMessage(messages.social_links_label)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default observer(RequestPage);

import React, { useState } from "react";
import { useLocation, matchPath } from "react-router-dom";
import cn from "classnames";
import InternalLink from "components/InternalLink";
import styles from "styles/components/Header.module.scss";
import { useMst } from "models/Root";
import { observer } from "mobx-react-lite";

export interface IMenuItem {
	icon: string | React.ReactElement;
	title: string;
	subtitle?: string;
	link: string;
	path?: string;
	isActive?: boolean;
	forbid?: boolean;
	img?: {
		name: string;
		src: string;
	};
}

interface IImage {
	src: string;
	name: string;
}

interface IProps {
	message?: string;
	name?: string;
	link?: string;
	icon?: string | React.ReactElement;
	img?: IImage;
	menu?: (IMenuItem | null)[];
	isActive?: boolean;
	alignRight?: boolean;
	menuStyle?: React.CSSProperties;
}

const ItemIcon = React.memo(({ icon }: { icon: string | React.ReactElement }) =>
	typeof icon === "string" ? <i className={`ai ai-${icon}`} /> : icon,
);

const ItemImage = React.memo(({ img }: { img?: IImage }) =>
	img ? <img src={img.src} alt={img.name} className={img.name} /> : null,
);

const DropdownMenuItem: React.FC<{ item: IMenuItem; pathname: string; locale: string }> = ({
	item,
	pathname,
	locale,
}) => {
	const [isOut, setIsOut] = useState<boolean>(false);

	const handleMouseLeave = () => {
		setIsOut(true);

		setTimeout(() => {
			setIsOut(false);
		}, 200);
	};

	const isActive =
		item.isActive ??
		(item.link === "/"
			? [`/${locale}/`, `/${locale}`].includes(pathname)
			: !!matchPath(`/${item.path || item.link}`, `/${pathname.split("/").slice(2).join("/")}`));

	return (
		<div
			onMouseLeave={handleMouseLeave}
			className={cn(styles.dropdown_menu_item, {
				[styles.active]: isActive,
			})}
		>
			<InternalLink to={item.link}>
				<ItemIcon icon={item.icon} />
				<div className={styles.dropdown_menu_item_content}>
					<div className={styles.dropdown_menu_item_content_title}>
						{item.title}
						{item.img ? <img src={item.img.src} alt={item.img.name} /> : null}
					</div>
					{item.subtitle ? <span>{item.subtitle}</span> : null}
				</div>
				<i className={cn("ai ai-chevron_right", isOut && styles.on_out)} />
			</InternalLink>
		</div>
	);
};

const NavMenuItem: React.FC<IProps> = ({
	message,
	menu,
	name,
	icon,
	img,
	alignRight,
	link,
	isActive,
	menuStyle,
}) => {
	const { global } = useMst();
	const { pathname } = useLocation();
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	const handleMouseEnter = () => {
		setIsMenuOpen(true);
	};

	const handleMouseLeave = () => {
		setIsMenuOpen(false);
	};

	const toggleIsMenuOpen = () => {
		setIsMenuOpen((prevState) => !prevState);
	};

	const Label = () => (
		<>
			{icon ? <ItemIcon icon={icon} /> : null}
			<ItemImage img={img} />
			{message}
		</>
	);

	return (
		<div
			className={cn(styles.nav_menu_item, {
				[styles.active]: isActive ?? pathname === `/${global.locale}${link}`,
			})}
			onMouseLeave={handleMouseLeave}
			onClick={toggleIsMenuOpen}
			data-name={name}
		>
			{menu?.length ? (
				<div className={styles.menu_item_hover_area} onMouseEnter={handleMouseEnter} />
			) : null}
			{link ? (
				<InternalLink to={link}>
					<Label />
				</InternalLink>
			) : (
				<Label />
			)}
			{menu?.length ? (
				<>
					<i
						className={cn("ai ai-chevron_down", {
							[styles.menuOpen]: isMenuOpen,
						})}
					/>
					{isMenuOpen && (
						<div
							className={cn(styles.dropdown_menu, {
								[styles.right]: alignRight,
							})}
							style={menuStyle}
						>
							{menu.map((item, idx) =>
								item && !item.forbid ? (
									<DropdownMenuItem
										key={idx}
										item={item}
										locale={global.locale}
										pathname={pathname}
									/>
								) : null,
							)}
						</div>
					)}
				</>
			) : null}
		</div>
	);
};

export default observer(NavMenuItem);

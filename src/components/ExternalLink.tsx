import React, { useState } from "react";
import ExternalLinkModal from "./ExternalLinkModal";

interface IProps {
	to: string;
	className?: string;
}

const ExternalLink: React.FC<IProps> = ({ to, children, className }) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const handleModalOpen = (e: React.SyntheticEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsModalOpen(true);
	};

	const hadleModalClose = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			<a
				href={to}
				onClick={handleModalOpen}
				className={className}
				target="_blank"
				rel="noopener noreferrer"
			>
				{children}
			</a>
			<ExternalLinkModal isOpen={isModalOpen} onClose={hadleModalClose} link={to} />
		</>
	);
};

export default ExternalLink;

import React, { useEffect, useRef, useState } from "react";
import cn from "classnames";
import dayjs from "dayjs";
import { useIntl } from "react-intl";

import styles from "styles/pages/P2P/OrderDetails.module.scss";
import p2pStyles from "styles/pages/P2P/P2P.module.scss";
import P2PService, { useChatMessages, useUserDetails } from "services/P2PService";
import Input from "components/UI/Input";
import { ReactComponent as PlaneIcon } from "assets/icons/send-plane-icon.svg";
import { IMessage, IOrder } from "types/p2p";
import errorHandler from "utils/errorHandler";
import LoadingSpinner from "components/UI/LoadingSpinner";
import P2PWebSocket, { WSListenEventEnum } from "components/P2P/P2PWebSocket";
import p2pMessages from "messages/p2p";
import messages from "messages/common";

interface IProps {
	hidden: boolean;
	companionId: number;
	orderDetails: IOrder;
	userId: number;
}

const Chat: React.FC<IProps> = ({ hidden, companionId, orderDetails, userId }) => {
	const { formatMessage } = useIntl();

	const { data: companionInfo } = useUserDetails(companionId);
	const { data: chatMessages, refetch } = useChatMessages(orderDetails.id);

	const [isSending, toggleIsSending] = useState<boolean>(false);
	const [inputMessage, setInputMessage] = useState<string>("");
	const [messagesToRender, setMessagesToRender] = useState<IMessage[]>([]);

	const messageListRef = useRef<HTMLDivElement>(null);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputMessage(e.target.value);
	};

	useEffect(() => {
		if (chatMessages?.results) {
			setMessagesToRender(
				[...chatMessages.results].sort((a, b) =>
					dayjs(a.created_at).isAfter(b.created_at) ? 1 : -1,
				),
			);
		}
	}, [chatMessages?.results]);

	const handleSendMessage = () => {
		if (inputMessage) {
			toggleIsSending(true);
			return P2PService.sendMessage(orderDetails.id, inputMessage)
				.then(() => {
					refetch();
					setInputMessage("");
				})
				.catch(errorHandler)
				.finally(() => toggleIsSending(false));
		}

		return null;
	};

	const handleInputKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSendMessage();
		}
	};

	const handleWebSocketMessage = (m: Pick<IMessage, "text" | "created_at">) => {
		setMessagesToRender((prevState) => [...prevState, { ...m, author: companionId }]);
	};

	useEffect(() => {
		if (messageListRef.current) {
			messageListRef.current?.scrollTo({
				top: messageListRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [messagesToRender]);

	return (
		<>
			<P2PWebSocket
				callbackOnMessage={handleWebSocketMessage}
				events={[WSListenEventEnum.P2P_CHAT]}
			/>
			<div className={cn(styles.chat, { [styles.hidden]: hidden })}>
				<div className={styles.header}>
					<div className={p2pStyles.badges}>
						<div className={styles.nickname}>{companionInfo?.nickname}</div>
						<div className={cn(p2pStyles.verified_badge, p2pStyles.user)}>
							<i className="ai ai-user_check" />
							{formatMessage(p2pMessages.verified_user)}
						</div>
						{companionInfo?.is_merchant && (
							<div className={cn(p2pStyles.verified_badge, p2pStyles.merchant)}>
								<i className="ai ai-check_filled" />
								{formatMessage(p2pMessages.verified_merchant)}
							</div>
						)}
						{companionInfo?.is_blocked && (
							<div className={cn(p2pStyles.verified_badge, p2pStyles.blocked)}>
								<i className="ai ai-error_circle" />
								{formatMessage(p2pMessages.blocked)}
							</div>
						)}
					</div>
				</div>
				<div ref={messageListRef} className={styles.chat_screen}>
					<div className={styles.greeting}>
						<span>{dayjs.utc(dayjs(orderDetails.created_at)).format("DD / MM / YYYY, HH:mm")}</span>
						<span>{formatMessage(p2pMessages.chat_greeting)}</span>
					</div>
					<div className={styles.messages_list}>
						{messagesToRender.map((item, i, arr) => {
							const isLast = item.author !== arr[i + 1]?.author;
							return (
								<div
									key={i}
									className={cn(
										styles.message,
										item.author === userId ? styles.my : styles.companion,
										isLast && styles.last,
									)}
								>
									{isLast && (
										<span className={styles.time}>
											{formatMessage(messages.status_sent)}{" "}
											{dayjs.utc(dayjs(item.created_at)).format("HH:mm")}
										</span>
									)}
									{item.text}
								</div>
							);
						})}
					</div>
				</div>
				<div className={styles.footer}>
					<Input
						className={styles.input}
						name="input-message"
						value={inputMessage}
						labelValue={formatMessage(p2pMessages.type_your_message)}
						onKeyDown={handleInputKeyDown}
						onChange={handleInputChange}
					/>
					{/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
					<div role="button" onClick={handleSendMessage} className={styles.send_button}>
						{isSending ? (
							<LoadingSpinner noMargin />
						) : (
							<>
								{formatMessage(p2pMessages.send_message)}
								<PlaneIcon />
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Chat;

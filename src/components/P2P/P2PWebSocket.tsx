import { useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect, useRef } from "react";
import cookies from "js-cookie";

import { useMst } from "models/Root";
import messages from "messages/common";
import config from "helpers/config";
import styles from "styles/components/WebSocket.module.scss";
import Button from "components/UI/Button";
import { IMessage } from "types/p2p";

export enum WSListenEventEnum {
	P2P_CHAT = "p2p_chat",
}

enum WSEventEnum {
	ChatMessage = "pm",
}

interface IProps {
	events: WSListenEventEnum[];
	callbackOnMessage: (message: Pick<IMessage, "text" | "created_at">) => void;
}

const WebSocketComponent: React.FC<IProps> = ({ events = [], callbackOnMessage }) => {
	const {
		global: { isAuthenticated, isWSDown, setIsWSDown },
	} = useMst();
	const reconnectCount = useRef<number>(5);
	const reconnectInterval = useRef<NodeJS.Timer | null>(null);
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const { formatMessage } = useIntl();

	const isEventActive = (key: WSListenEventEnum) => events.includes(key);

	const reconnect = () => {
		setTimeout(() => {
			if (reconnectCount.current > 0) {
				console.log("Reconnecting...");
				reconnectCount.current -= 1;
				connect();
			} else {
				setIsWSDown(true);
				if (!reconnectInterval.current) {
					reconnectInterval.current = setInterval(() => {
						console.log("Reconnecting...");
						connect();
					}, 5000);
				}
			}
		}, 1000);
	};

	const connect = () => {
		const prefix = config.wsPrefix;

		if (prefix) {
			const nextSocket = new WebSocket(prefix);

			nextSocket.onopen = () => {
				setSocket(nextSocket);
				setIsWSDown(false);
				if (reconnectInterval.current) {
					clearInterval(reconnectInterval.current);
					reconnectInterval.current = null;
				}
			};

			nextSocket.onclose = (event: { wasClean: boolean; code: number; reason: string }) => {
				setSocket(null);
				if (event.wasClean) {
					console.log("[close] Socket closed clean", event.code, event.reason);
				} else {
					console.log("[close] Socket unexpectly closed");
					reconnect();
				}
			};

			nextSocket.onerror = () => {
				console.log("[error] Socket error");
			};
		}
	};

	useEffect(() => {
		connect();

		return () => {
			if (reconnectInterval.current) {
				clearInterval(reconnectInterval.current);
			}
		};
	}, []);

	useEffect(() => {
		if (socket && isEventActive(WSListenEventEnum.P2P_CHAT)) {
			socket.send(JSON.stringify(["subscribe", "p2p_chat.*"]));
		}
	}, [socket]);

	useEffect(() => {
		if (socket && isAuthenticated) {
			const sessionToken = cookies.get(config.sessionCookieName);
			if (sessionToken) {
				socket.send(JSON.stringify(["auth", sessionToken]));
			}
		}
	}, [socket, isAuthenticated]);

	useEffect(() => {
		if (socket) {
			// eslint-disable-next-line consistent-return
			socket.onmessage = (event) => {
				const eventDataParsed = JSON.parse(event.data);

				if (event.data === "1") {
					socket.send("2");
				} else if (Array.isArray(eventDataParsed) && eventDataParsed.length) {
					const [eventKey, ...eventData] = eventDataParsed;

					switch (eventKey) {
						case WSEventEnum.ChatMessage: {
							const message: Pick<IMessage, "text" | "created_at"> = {
								text: eventData[3],
								created_at: new Date(), // FIX ME get date from back
							};
							return callbackOnMessage(message);
						}
						default:
							break;
					}
				}
			};
		}
	}, [socket]);

	useEffect(
		() => () => {
			if (socket) {
				socket.close();
			}
		},
		[socket],
	);

	const handleReloadPage = () => {
		document.location.reload();
	};

	return isWSDown ? (
		<div className={styles.message_container}>
			<i className="ai ai-warning" />
			<span>
				<b>{formatMessage(messages.ws_connection_lost)}</b>&nbsp;
				{formatMessage(messages.ws_reload_the_page)}
			</span>
			<Button label="Reload" mini onClick={handleReloadPage} />
		</div>
	) : null;
};

export default observer(WebSocketComponent);

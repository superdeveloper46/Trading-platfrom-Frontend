/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import messages from "messages/common";
import config from "helpers/config";
import { RecentTradeTypeEnum } from "types/exchange";
import styles from "styles/components/WebSocket.module.scss";
import { IRecentTrade } from "models/Terminal";
import Button from "components/UI/Button";

export enum WSListenEventEnum {
	ORDERS = "orders",
	CHAT = "chat",
	TICKERS = "tickers",
	FUNDS = "funds",
	ORDERBOOK = "orderbook",
	TRADES = "trades",
	ORDERS_PAIR = "orders-pair",
	WALLETS = "wallets",
}

enum WSEventEnum {
	Orders = "o",
	Tickers = "tk",
	Orderbook = "d",
	Trades = "t",
	Wallets = "w",
	Auth = "auth",
	ChatHistory = "mh",
	ChatMessage = "m",
}

interface ITrade extends IRecentTrade {
	symbol: string;
}

// ONLY FOR TRADES

interface IProps {
	onAddTrade: (trade: ITrade) => void;
	symbol?: string;
}

const SupportWebSocket: React.FC<IProps> = ({ onAddTrade, symbol }) => {
	const [isWSDown, setIsWSDown] = useState<boolean>(false);
	const reconnectCount = useRef<number>(5);
	const reconnectInterval = useRef<NodeJS.Timer | null>(null);
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const { formatMessage } = useIntl();

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
		if (socket) {
			socket.send(JSON.stringify(["subscribe", `trade.${symbol || "*"}`]));
		}
	}, [socket, symbol]);

	useEffect(
		() => () => {
			if (socket) {
				socket.send(JSON.stringify(["unsubscribe", `trade.${symbol || "*"}`]));
			}
		},
		[symbol],
	);

	useEffect(() => {
		if (socket) {
			socket.onmessage = (event) => {
				const eventDataParsed = JSON.parse(event.data);

				if (event.data === "1") {
					socket.send("2");
				} else if (Array.isArray(eventDataParsed) && eventDataParsed.length) {
					const [eventKey, ...eventData] = eventDataParsed;

					switch (eventKey) {
						case WSEventEnum.Auth: {
							console.log("Authorized WS Connection");
							break;
						}
						case WSEventEnum.Trades: {
							const trade = {
								date: eventData[0],
								symbol: eventData[2],
								id: eventData[1],
								amount: +eventData[3],
								price: +eventData[4],
								type: eventData[5] === RecentTradeTypeEnum.Sell ? 1 : 2,
							};
							onAddTrade(trade);
							break;
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

export default SupportWebSocket;

/* eslint-disable no-unused-vars */
import { ACCOUNT_TYPE, STOP_OPERATOR } from "constants/exchange";
import usePreviousState from "hooks/usePreviousState";
import { observer } from "mobx-react-lite";
import { IHistoryOrder } from "models/History";
import messages from "messages/common";
import exchangeMessages from "messages/exchange";
import config from "helpers/config";
import { useMst } from "models/Root";
import React, { useState, useEffect, useRef } from "react";
import { OrderSideEnum } from "types/orders";
import { ITickerWS } from "types/ticker";
import { IOrderBookData, RecentTradeTypeEnum } from "types/exchange";
import styles from "styles/components/WebSocket.module.scss";
import cookies from "js-cookie";
import Button from "components/UI/Button";
import { IBalanceWS } from "types/account";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";

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

interface IProps {
	events: WSListenEventEnum[];
	pairSymbol?: string;
}

const WebSocketComponent: React.FC<IProps> = ({ events = [], pairSymbol = "" }) => {
	const {
		global: { isAuthenticated, isWSDown, setIsWSDown },
		account,
		terminal,
		tickers,
		history,
	} = useMst();
	const reconnectCount = useRef<number>(5);
	const reconnectInterval = useRef<NodeJS.Timer | null>(null);
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const symbol = terminal.pair?.symbol ?? pairSymbol;
	const prevPair = usePreviousState(symbol);
	const { formatMessage, formatNumber } = useIntl();

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

		if (isEventActive(WSListenEventEnum.CHAT)) {
			// TODO CHAT
		}

		return () => {
			if (reconnectInterval.current) {
				clearInterval(reconnectInterval.current);
			}
		};
	}, []);

	// const addChatMessage = useCallback(
	// 	(message: IMessage | null) => {
	// 		if (message) {
	// 			const ownMessage = profileStatus?.username === message.username;
	// 			if (
	// 				!ownMessage &&
	// 				profileStatus?.username &&
	// 				message?.text &&
	// 				isAuthenticated &&
	// 				taggedMessageCount < 99
	// 			) {
	// 				if (message.text.includes(`@${profileStatus.username}`)) {
	// 					dispatch(increaseTaggedMessageCount());
	// 					// eslint-disable-next-line no-param-reassign
	// 					message.tagged = true;
	// 					// eslint-disable-next-line no-param-reassign
	// 					message.taggedUnread = true;
	// 				}
	// 			}
	// 			dispatch(chatUpdate(message));
	// 		}
	// 	},
	// 	[profileStatus, isAuthenticated, taggedMessageCount],
	// );

	// const initChatMessages = useCallback(
	// 	(allMessages: IMessage[] | null) => {
	// 		if (allMessages) {
	// 			const messages = allMessages.slice(-100);
	// 			dispatch(chatInit(messages));
	// 			let count = 0;
	// 			const readIds = JSON.parse(Shelf.get("readTaggedMessagesIds")) || [];
	// 			if (profileStatus) {
	// 				for (let i = 0; i < messages.length; i++) {
	// 					const ownMessage = profileStatus?.username === messages[i]?.username;
	// 					if (!ownMessage) {
	// 						const messageIncludesTag = messages[i].text.includes(`@${profileStatus.username}`);
	// 						const availableToIncreaseCount = !!(
	// 							profileStatus?.username &&
	// 							messages[i]?.text &&
	// 							isAuthenticated &&
	// 							taggedMessageCount < 99
	// 						);
	// 						const messageIsUnread = readIds ? !readIds.includes(messages[i].id) : true;
	// 						if (messageIncludesTag && availableToIncreaseCount && messageIsUnread) {
	// 							// eslint-disable-next-line no-param-reassign
	// 							messages[i].taggedUnread = true;
	// 							count++;
	// 						}
	// 					}
	// 				}
	// 			}
	// 			dispatch(setTaggedMessageCount(count));
	// 		}
	// 		dispatch(setChatIsLoading(false));
	// 	},
	// 	[profileStatus, isAuthenticated, taggedMessageCount],
	// );

	// useEffect(() => {
	// 	if (isEventActive("chat")) {
	// 		if (chats?.length && !activeChat) {
	// 			const activeChatId = JSON.parse(Shelf.get("activeChatId")) || 0;
	// 			const currentChat = chats.find((ch: IChat) =>
	// 				activeChatId ? ch.id === activeChatId : ch.default_lang === locale,
	// 			);
	// 			dispatch(setActiveChat(currentChat || chats[0]));
	// 			Shelf.set("activeChatId", currentChat?.id || chats[0].id);
	// 		}
	// 	}
	// }, [chats, activeChat]);

	// useEffect(() => {
	// 	if (socket && isEventActive("chat") && activeChat) {
	// 		const { default_lang: language } = activeChat;
	// 		dispatch(setChatIsLoading(true));
	// 		socket.send(JSON.stringify(["subscribe", `chat.${language}`]));
	// 	}
	// }, [socket, activeChat]);

	const handleOrderOpen = () => {
		toast(
			<>
				<i className="ai ai-check_outline" />
				{formatMessage(exchangeMessages.order_created)}
			</>,
		);
	};

	const capitalize = (s: string) => {
		const f = s.length > 0 ? s[0] : "";
		const r = s.length > 1 ? s.slice(1) : "";
		return f.toUpperCase() + r.toLowerCase();
	};

	const handleOrderClose = (order: IHistoryOrder) => {
		const amountPrecision = order.pair?.amount_precision ?? 8;
		const currencyCode = order.symbol.split("_")[0];
		toast(
			<>
				<i className="ai ai-check_outline" />
				{`${capitalize(order.type)} ${capitalize(order.side)}	${formatNumber(order.amount ?? 0, {
					useGrouping: false,
					minimumFractionDigits: amountPrecision,
					maximumFractionDigits: amountPrecision,
				})} ${currencyCode} ${formatMessage(exchangeMessages.order_done)}`}
			</>,
		);
	};

	useEffect(() => {
		if (socket && symbol) {
			if (prevPair && prevPair !== symbol) {
				if (isEventActive(WSListenEventEnum.ORDERBOOK)) {
					socket.send(JSON.stringify(["unsubscribe", `diff.${prevPair}`]));
				}
				if (isEventActive(WSListenEventEnum.TRADES)) {
					socket.send(JSON.stringify(["unsubscribe", `trade.${prevPair}`]));
				}
			}
			if (isEventActive(WSListenEventEnum.ORDERBOOK)) {
				socket.send(JSON.stringify(["subscribe", `diff.${symbol}`]));
			}
			if (isEventActive(WSListenEventEnum.TRADES)) {
				socket.send(JSON.stringify(["subscribe", `trade.${symbol}`]));
			}
		}
	}, [socket, symbol]);

	useEffect(() => {
		if (
			socket &&
			terminal.chartSubscribeSymbol &&
			terminal.chartSubscribeSymbol !== symbol &&
			isEventActive(WSListenEventEnum.TRADES)
		) {
			socket.send(JSON.stringify(["subscribe", `trade.${terminal.chartSubscribeSymbol}`]));
		}
	}, [socket, terminal.chartSubscribeSymbol, symbol]);

	useEffect(
		() => () => {
			if (prevPair && socket) {
				if (isEventActive(WSListenEventEnum.ORDERBOOK)) {
					socket.send(JSON.stringify(["unsubscribe", `diff.${prevPair}`]));
				}
				if (isEventActive(WSListenEventEnum.TRADES)) {
					socket.send(JSON.stringify(["unsubscribe", `trade.${prevPair}`]));
				}
			}
		},
		[],
	);

	useEffect(() => {
		if (socket && isEventActive(WSListenEventEnum.TICKERS)) {
			socket.send(JSON.stringify(["subscribe", "ticker.*"]));
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
						case WSEventEnum.Orders: {
							const order = {
								date: +eventData[0],
								id: +eventData[1],
								symbol: eventData[2],
								side: eventData[3] === "ASK" ? OrderSideEnum.SELL : OrderSideEnum.BUY,
								type: eventData[4],
								amount: eventData[5] ? +eventData[5] : null,
								amount_original: eventData[5] ? +eventData[5] : null,
								key: eventData[6],
								price: eventData[6] ? +eventData[6] : null,
								amount_unfilled: eventData[7] ? +eventData[7] : null,
								amount_filled: eventData[8] ? +eventData[8] : null,
								amount_cancelled: eventData[9] ? +eventData[9] : null,
								value_filled: eventData[10] ? +eventData[10] : null,
								price_avg: eventData[11] ? +eventData[11] : null,
								done_at: eventData[12],
								status: eventData[13],
								quote_amount: eventData[14] ? +eventData[14] : null,
								wallet_type: ACCOUNT_TYPE[eventData[15].toLowerCase()],
								stop_price: eventData[16] ? +eventData[16] : null,
								stop_operator: STOP_OPERATOR[eventData[17]],
							};
							history.updateOrders(order as IHistoryOrder, handleOrderOpen, handleOrderClose);
							break;
						}
						case WSEventEnum.Tickers: {
							const nextTickers: ITickerWS[] = [];
							eventData.forEach((t: any[]) => {
								nextTickers.push({
									symbol: t[0],
									close: +t[1],
									base_volume: +t[2],
									quote_volume: +t[3],
									change_percent: +t[4],
									high: +t[5],
									low: +t[6],
									bid: +t[7],
									ask: +t[8],
								});
							});
							tickers.updateTickersWS(nextTickers);
							if (terminal.pair) {
								const ticker = nextTickers.find((t) => t.symbol === terminal.pair?.symbol);
								if (ticker) {
									terminal.updatePair({
										...terminal.pair,
										close: ticker.close,
										base_volume: ticker.base_volume,
										change_percent: ticker.change_percent,
										high: ticker.high,
										low: ticker.low,
									});
								}
							}
							break;
						}
						case WSEventEnum.Orderbook: {
							const data: IOrderBookData = {
								symbol: eventData[1],
								asks: eventData[2],
								bids: eventData[3],
							};
							terminal.updateOrderBook(data);
							break;
						}
						case WSEventEnum.ChatHistory: {
							// const messagesData = eventData.slice(2);
							// const nextMessages: IMessage[] = [];

							// messagesData.forEach((m) => {
							// 	nextMessages.push({
							// 		id: m[1],
							// 		username: m[2],
							// 		text: m[3],
							// 		is_staff: m[4],
							// 		date: m[5],
							// 	});
							// });

							// initChatMessages(nextMessages);
							break;
						}
						case WSEventEnum.ChatMessage: {
							// const nextMessage: IMessage = {
							// 	date: eventData[0],
							// 	id: eventData[2],
							// 	username: eventData[3],
							// 	text: eventData[4],
							// 	is_staff: eventData[5],
							// };

							// addChatMessage(nextMessage);
							break;
						}
						case WSEventEnum.Trades: {
							const trade = {
								date: eventData[0],
								id: eventData[1],
								symbol: eventData[2],
								amount: +eventData[3],
								price: +eventData[4],
								type: eventData[5] === RecentTradeTypeEnum.Sell ? 1 : 2,
							};
							terminal.addRecentTrade(trade);
							if (terminal.pair?.symbol === (trade.symbol as string)) {
								terminal.updatePair({
									...terminal.pair,
									close: trade.price,
									base_volume: terminal.pair.base_volume + trade.amount,
								});
							}
							break;
						}
						case WSEventEnum.Wallets: {
							const balance: IBalanceWS = {
								code: eventData[1],
								type: eventData[2],
								market: eventData[3],
								balance: eventData[4],
								reserve: eventData[5],
							};
							account.updateBalance(balance);
							break;
						}
						default:
							break;
					}
				}
			};
		}
	}, [socket, symbol]);

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

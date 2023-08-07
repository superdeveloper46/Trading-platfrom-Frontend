/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unreachable-loop */
import React from "react";
import { toast } from "react-toastify";

const getDetails = (obj: Record<string, unknown> | string): string | string[] => {
	if (typeof obj === "string") return obj;
	const d = obj[Object.keys(obj)?.length ? Object.keys(obj)[0] : "details"];
	if (typeof d === "object") {
		if (Array.isArray(d)) {
			// in case data was an array
			const c: string[] = [];
			for (let i = 0; i < d.length; i++) {
				c.push(getDetails(d[i] as Record<string, unknown>) as string);
			}

			return c;
		}
		return getDetails(d as Record<string, unknown>);
	}
	return (
		typeof d === "string"
			? d
			: "It looks like something went wrong. Please refresh the page and try again."
	) as string;
};

const errorHandler = (err: unknown, throwError = true) => {
	console.error("Error", err);
	if (typeof err === "object") {
		if ((err as Record<string, unknown>).status === 403) {
			toast(
				<>
					<i className="ai ai-info_outlined" />
					Access denied [403]
				</>,
			);

			return;
		}
		if ((err as Record<string, unknown>).status === 401) {
			toast(
				<>
					<i className="ai ai-info_outlined" />
					Unauthorized [401]
				</>,
			);

			return;
		}
	}

	const details = (err as Record<string, unknown>)?.data || err;

	const message =
		typeof details === "object"
			? getDetails(details as Record<string, unknown>)
			: "It looks like something went wrong. Please, refresh the page.";

	toast(
		<>
			<i className="ai ai-info_outlined" />
			{!Array.isArray(message)
				? message
				: message.map((m) => (
						<>
							{m} <br />
						</>
				  ))}
		</>,
	);

	if (throwError) {
		throw details;
	}
};

export default errorHandler;

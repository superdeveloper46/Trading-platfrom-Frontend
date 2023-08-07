import React from "react";
import { IError } from "types/supportCenter";
import {
	NetworkError,
	ForbiddenError,
	NotFoundError,
	ServerError,
	ServiceTemporaryUnavailable,
} from "./index";

interface Props {
	error: IError;
}

const Error: React.FC<Props> = (props) => {
	const {
		error: { status },
	} = props;

	if (status > 500) return <ServiceTemporaryUnavailable status={status.toString()} />;

	switch (status) {
		case 404:
			return <NotFoundError />;
		case 403:
			return <ForbiddenError />;
		case 500:
			return <ServerError />;
		case "network Error":
			return <NetworkError />;
		case "pair_error":
			// TODO: add pair error
			// return <PairError {...props} />;
			return null;
		default:
			return null;
	}
};

export default Error;

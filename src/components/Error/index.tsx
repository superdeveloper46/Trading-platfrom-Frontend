import Error from "./Error";
import NetworkError from "./errors/NetworkError";
import ForbiddenError from "./errors/ForbiddenError";
import NotFoundError from "./errors/NotFoundError";
import ServerError from "./errors/ServerError";
import ServiceTemporaryUnavailable from "./errors/ServiceTemporaryUnavailable";

export { NetworkError, ForbiddenError, NotFoundError, ServerError, ServiceTemporaryUnavailable };

export default Error;

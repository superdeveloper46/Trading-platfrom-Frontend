import ApiClient from "helpers/ApiClient";
// import { IListingRequestRequestBody } from "types/listing";

const ListingService = {
	sendRequest: (body: FormData): Promise<void> =>
		ApiClient.post("web/listing/listing-request", body, null, {
			"content-type": "multipart/form-data",
		}),
};

export default ListingService;

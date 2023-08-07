import ApiClient from "helpers/ApiClient";
import {
	RequestTypeEnum,
	IAddressInfoData,
	IAddressScoreData,
	ITransactionAMLInfoData,
	ITransactionInfoData,
	ITransactionScoreData,
	IReportDescriptor,
	IReportDescriptorError,
	IReportPriceData,
} from "types/amlReport";
import { useQuery } from "react-query";
import { formattingScoringList } from "utils/reportUtils";
import { IPaginationRes } from "types/general";

// TODO: adjust requests if eth report needed
const getTxEthData = (value: string) =>
	ApiClient.post("web/aml/report", {
		type: RequestTypeEnum.REPORT_TYPE_TRANSACTION,
		address: value,
	});

const getTxEthScore = (value: string) =>
	ApiClient.post("web/aml/report", {
		type: RequestTypeEnum.REPORT_TYPE_TRANSACTION,
		address: value,
	});

const getReports = (page: number): Promise<IPaginationRes<IReportDescriptor>> =>
	ApiClient.get("web/aml/reports", { page });

export const useReports = (page = 1) =>
	useQuery<IPaginationRes<IReportDescriptor>>(["reports", page], async () => {
		const data: IPaginationRes<IReportDescriptor> = await getReports(page);

		return {
			count: data?.count ?? 0,
			results: data?.results ?? [],
		};
	});

const useTxEthData = (value: string) =>
	useQuery(["report-tx-eth-data", value], async () => {
		const data = await getTxEthData(value);
		return data ?? null;
	});

const useTxEthScore = (value: string) =>
	useQuery(["report-tx-eth-score", value], async () => {
		const data = await getTxEthScore(value);
		return data ?? null;
	});

export const useEthReportData = (value: string) => {
	const ethInfo = useTxEthData(value);
	const scoreInfo = useTxEthScore(value);
	const dataLoading = ethInfo.isLoading || scoreInfo.isLoading;

	return { ethInfo, scoreInfo, dataLoading };
};

interface IAddressBatchResponseData extends IReportDescriptor {
	info: IAddressInfoData;
	score: IAddressScoreData;
}

interface ITransactionResponseData extends IReportDescriptor {
	info: ITransactionInfoData;
	score: ITransactionScoreData;
	aml_info: ITransactionAMLInfoData;
}

export const useReportInfo = () =>
	useQuery<IReportPriceData>(
		["report-price"],
		async (): Promise<IReportPriceData> => ApiClient.get("web/aml/report"),
	);

export const useReportIdData = (value: string, type: RequestTypeEnum, demo = false) =>
	useQuery<IReportDescriptor, IReportDescriptorError>(
		["report-id", value, demo],
		async () => {
			if (demo) {
				return ApiClient.get(`web/aml/demo/${value}`);
			}

			return ApiClient.post("web/aml/report", {
				report_type: type,
				address: value,
			});
		},
		{ enabled: !!value, staleTime: Infinity },
	);

export const useTransactionData = (id: number) => {
	const transactionBatchData = useQuery<ITransactionResponseData>(
		["report-transaction-batch-data", id],
		async () => ApiClient.get(`web/aml/report/transaction/${id}`),
	);

	return {
		transactionInfo: transactionBatchData.data?.info,
		amlInfo: transactionBatchData.data?.aml_info,
		transactionScore: transactionBatchData.data?.score,
		dataLoading: transactionBatchData.isLoading,
	};
};

export const useAddressData = (id: number) => {
	const addressBatchData = useQuery<IAddressBatchResponseData>(
		["report-address-batch-data", id],
		async () => ApiClient.get(`web/aml/report/address/${id}`),
	);

	const addressInfo = {
		...addressBatchData.data?.info,
		assumedMeta: formattingScoringList(addressBatchData.data?.info),
	};

	return {
		addressInfo: addressInfo as IAddressInfoData,
		addressScore: addressBatchData.data?.score,
		dataLoading: addressBatchData.isLoading,
	};
};

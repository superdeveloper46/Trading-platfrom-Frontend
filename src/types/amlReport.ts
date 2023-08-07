export interface IFundSourceType {
	type?: string;
	name: string;
	score: number;
	id: string;
	default?: boolean;
}

export interface IDepthValue {
	minimum: number;
	maximum: number;
}

export interface IScoreDataSource {
	address: string | null;
	amount: number;
	depth: number | IDepthValue;
	directTx: string;
	funds: IFundSourceType;
	listType: string;
	owner: string;
	share: number;
	tx_hash: string | null;
	type: string;
	typeData: IFundSourceType;
	totalAmount?: number;
	cluster?: number;
	emptyOwner?: boolean;
}

export interface IScoreDataSourceVisual extends IScoreDataSourceExt {
	key?: string;
	tooltip: string;
	pieValue: number;
	value: number;
	itemStyle: {
		color: string;
	};
}

export interface IScoreDataSourceExt extends IScoreDataSource {
	depthSortValue: number | null;
}

export interface ITransactionScoreData {
	depth: number;
	progress: number;
	sources: IScoreDataSource[];
	totalAmount: number;
	totalFunds: number;
	totalFundsDefault: number;
	totalFundsSensitive: number;
}

//-------------------------------------------------------------

export interface IAddressData {
	address: string;
	amountReceived: number;
	amountSent: number;
	balance: number;
	block_hash: string;
	lastSeen: number;
	txCount: number;
	txReceivedCount: number;
	txSentCount: number;
	firstSeen: number;
	owner: string;
	type: IFundSourceType[];
	tags: IFundSourceType[];
	riskScore: number;
}

export interface ITransactionInfoClusterDataParams {
	address: string;
	owner: string;
	tags: IFundSourceType[];
	type: string;
	cluster: number | null;
	addressCount: number;
}

export interface ITransactionInfoClusterData {
	params: ITransactionInfoClusterDataParams;
	type: IFundSourceType[];
	tags: IFundSourceType[];
	riskScore: number;
}

export interface IAddress {
	address: string;
	addressData: IAddressData;
	amount: number;
	cluster: number | null;
	clusterData: ITransactionInfoClusterData;
	prev_out_index: number;
	prev_tx_hash: string[];
	next_tx_hash: string[];
}

export interface ITransactionInfoError {
	message: string;
	messageCode: number;
	messageType: string;
}

export interface ITransactionInfoData {
	tx_hash: string;
	inputsCount: number;
	outputsCount: number;
	blockHeight: number;
	timestamp: number;
	inputs: IAddress[];
	outputs: IAddress[];
	totalInputs: number;
	inputsAmount: number;
	totalOutputs: number;
	outputsAmount: number;
	inMonitoring?: boolean;
}

//--------------------------------------------------

export interface IReportDescriptor {
	address: string;
	created_at: string;
	id: number;
	report_type: number;
}

export interface IReportDescriptorError {
	data: any;
	message: string;
	status: number;
}

export interface IReportPriceData {
	title: string;
	description: string;
	currency_id: string;
	price: number;
	demo: string[];
}

//--------------------------------------------------

export interface IAddressInfoClusterData {
	owner: string;
	address: string;
	cluster?: number;
	meta: any[];
	clusterSize: number;
	conflict: boolean;
	id?: string;
	addressCount?: number;
	tags?: IFundSourceType[];
	type?: IFundSourceType;
	description?: string;
	updatedAt?: string;
}

export interface IAddressInfoData {
	address: string;
	amountReceived: number;
	amountSent: number;
	balance: number;
	block_hash: string;
	lastSeen: number;
	txCount: number;
	txReceivedCount: number;
	txSentCount: number;
	firstSeen: number;
	inMonitoring?: boolean;
	conflict: boolean;
	meta: any[];
	tags?: IFundSourceType[];

	cluster?: number;
	description?: string;
	owner?: string;
	type: IFundSourceType;
	clusterData: IAddressInfoClusterData;

	assumedMeta: IFundSourceType[];
}

//-------------------------------------------

export interface ITransactionAMLInfoData {
	messages: string[];
}

export interface IAddressScoreData {
	depth: number;
	progress: number;
	sources: IScoreDataSource[];
	totalAmount: number;
	totalFunds: number;
	totalFundsDefault: number;
	totalFundsSensitive: number;
}

export enum ResourceTypeEnum {
	ETH = "eth",
	HASH = "hash",
	ADDRESS = "address",
}

export enum ContentEnum {
	REPORT = "report",
	COMPLETED_REPORTS = "completed-reports",
}

export enum RequestTypeEnum {
	REPORT_TYPE_ADDRESS = 1,
	REPORT_TYPE_TRANSACTION = 2,
}

export enum SourcesTypeEnum {
	RISKY = "risky",
	KNOWN = "known",
	UNKNOWN = "unknown",
}

export enum NavSourcesEnum {
	ADDRESS_INFORMATION = "address-information",
	SOURCES_OF_FUNDS = "source-of-funds",
	RISKY_SOURCES = "risky-sources",
	UNKNOWN_SOURCES = "unknown-sources",
	KNOWN_SOURCES = "known-sources",
}

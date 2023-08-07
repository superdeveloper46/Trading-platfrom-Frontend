import {
	IAddressInfoData,
	IScoreDataSourceExt,
	IFundSourceType,
	IDepthValue,
	IScoreDataSourceVisual,
	IScoreDataSource,
} from "types/amlReport";
import { validate } from "bitcoin-address-validation";
import { riskScoreList } from "./riskScoreList";

export const formatter = (
	sources: IScoreDataSourceExt[],
	prop: "type" | "owner",
): IScoreDataSourceExt[] => {
	const groupedMap: Record<string, IScoreDataSourceExt> = {};

	for (let s = 0; s < sources.length; s++) {
		const source = sources[s];

		const key: string = prop === "type" ? source.funds.type || source.funds.name : source.owner;

		if (!Object.prototype.hasOwnProperty.call(groupedMap, key)) {
			groupedMap[key] = {
				...source,
			};
		} else {
			groupedMap[key].share += source.share;
			groupedMap[key].amount += source.amount;
		}
	}

	const grouped = Object.values(groupedMap);

	for (let g = grouped.length; g--; ) {
		const source = grouped[g];
		source.share = roundShare(source.share);
	}

	return grouped;
};

export const roundShare = (share: number) => Math.trunc(share * 10000) / 10000;

export const formatShare = (share: number) =>
	`${share < 0.0001 ? "< 0.01" : (share * 100).toFixed(2)}%`;

export const formatterDepthSortValue = (value: number | IDepthValue): number | null => {
	if (typeof value === "number") {
		return value;
	}

	if (value && value.minimum && value.maximum) {
		return value.minimum;
	}
	return null;
};

export const formattingScoringList = (data?: IAddressInfoData): IFundSourceType[] => {
	let scoringList: IFundSourceType[] = [];

	if (data?.tags) {
		scoringList = [...data.tags];
	}

	if (data?.clusterData?.tags) {
		scoringList = [...scoringList, ...data.clusterData.tags];
	}

	if (data?.type) {
		scoringList = [...scoringList, data.type];
	}

	if (data?.clusterData?.type) {
		scoringList = [...scoringList, data.clusterData.type];
	}

	scoringList = scoringList.filter((v, i, a) => a.findIndex((t) => t.name === v.name) === i);

	scoringList.sort((a, b) => (a.score < b.score ? 1 : -1));

	return scoringList;
};

export const addressIsOwnerByHighRisk = (
	addressInfo: IAddressInfoData | undefined,
	riskPoint: number,
): boolean =>
	!!addressInfo?.tags?.find((tag) => tag.score >= riskPoint) ||
	!!addressInfo?.clusterData?.tags?.find((tag) => tag.score >= riskPoint) ||
	(addressInfo?.type?.score || 0) >= riskPoint ||
	(addressInfo?.clusterData?.type?.score || 0) >= riskPoint;

export const hasDirectlyMixing = (addressInfo: IAddressInfoData | undefined): boolean =>
	addressInfo?.type?.name === "mixing" ||
	addressInfo?.clusterData?.type?.name === "mixing" ||
	!!addressInfo?.tags?.find((tag) => tag.name === "coin join participant") ||
	!!addressInfo?.clusterData?.tags?.find((tag) => tag.name === "coin join participant");

export const hasTagMoreRiskPoint = (
	addressInfo: IAddressInfoData | undefined,
	riskPoint: number,
): boolean =>
	!!addressInfo?.tags?.find((tag) => tag.score >= riskPoint) ||
	!!addressInfo?.clusterData?.tags?.find((tag) => tag.score >= riskPoint);

export const addressAreUnidentified = (sources: IScoreDataSourceExt[]) => {
	const sum = sources.reduce((acc, { share }) => acc + share, 0);

	return sum * 100 >= 75;
};

export const capitalizeFirstLetter = (val: string) =>
	val ? val.charAt(0).toUpperCase() + val.slice(1) : "";

export const trancateString = (val: string, count = 4) => {
	if (!val) return "";
	if (val.length <= count * 2) return val;

	return `${val.substr(0, count)}...${val.substr(val.length - count)}`;
};

export const toComaSeparate = (val: string | number) => {
	const parts = String(val).split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
};

const formattedAmount = (fAmount: number, fDel: number, fixedVal: number) =>
	(fAmount / fDel).toFixed(fixedVal);

export const formatBtcAmount = (
	amount: number,
	withBtc = true,
	searchType = "",
	hasContracts = "",
) => {
	let contract = "";
	let del = 100000000;
	// let isNeedSubDel = false
	// const subDel = 1000000

	if (searchType === "eth") {
		del = 1;

		// Contract
		if (hasContracts) {
			contract = hasContracts;
		} else {
			contract = "ETH";
		}
	}

	if (!searchType) contract = "BTC";

	return amount
		? `${
				searchType === "eth" ? formattedAmount(amount, del, 12) : formattedAmount(amount, del, 8)
		  } ${withBtc ? `${contract}` : ""}`
		: searchType === "eth"
		? ""
		: "0";
};

export const formatFunds = (fund: number, withPercent = true) => {
	const formatted = Math.ceil(fund);

	if (withPercent) {
		return formatted === 0 ? "< 0.01%" : `${formatted}%`;
	}
	return formatted === 0 ? "< 0.01" : formatted;
};

export const getOwnerByType = (data: IScoreDataSourceExt) => {
	const name = data?.typeData?.name.toLowerCase();

	switch (name) {
		case "unidentified service / exchange":
			return {
				owner: data.cluster?.toString() || data.owner,
				value: "",
				isLink: false,
			};
		case "small transactions":
			return {
				owner: "Multiple",
				value: "",
				isLink: false,
			};
		case "unknown single wallet service":
		case "unknown wallet / otc / service":
			return data.address
				? {
						owner: trancateString(data.address, 8),
						value: data.address,
						isLink: true,
				  }
				: {
						owner: data.owner,
						value: "",
						isLink: false,
				  };
		case "maximum depth reached":
			return {
				owner: "--",
				value: "",
				isLink: false,
			};
		default:
			return {
				owner: data.owner || "--",
				value: "",
				isLink: false,
			};
	}
};

export const checkMultiple = (val: any) => val === null;

export const ownerLabelFormatter = (addressData?: IAddressInfoData) => {
	if (addressData?.owner || addressData?.clusterData?.owner) {
		if (addressData.owner === addressData.clusterData.owner) {
			return addressData.owner;
		}

		if (addressData.owner && addressData.clusterData.owner) {
			return `${addressData.owner}, ${addressData.clusterData.owner}`;
		}

		if (addressData.clusterData.owner) {
			return addressData.clusterData.owner;
		}

		if (addressData.owner) {
			return addressData.owner;
		}
	}

	return "Not identified";
};

export const hex2rgba = (hex: string, alpha = 1) => {
	const [r, g, b] = (hex.match(/\w\w/g) || []).map((x) => parseInt(x, 16));
	return `rgba(${r},${g},${b},${alpha})`;
};

export const isValidEthAddress = (address: string) => /^0x[0-9a-fA-F]{40}$/.test(address);

export const isValidEthHash = (hash: string) => /^0x[0-9a-fA-F]{64}$/.test(hash);

export const isValidTxHash = (hash: string) => /^[a-f0-9]{64}$/.test(hash);

export const isValidAddress = (address: string) => validate(address);

export const findColorByTypeScore = (val?: number) => {
	if (val !== 0 && (!val || val < 0)) {
		return riskScoreList[0];
	}
	if (val >= 0 && val <= 10) {
		return riskScoreList[1];
	}
	if (val > 10 && val <= 20) {
		return riskScoreList[2];
	}
	if (val > 20 && val <= 30) {
		return riskScoreList[3];
	}
	if (val > 30 && val <= 40) {
		return riskScoreList[4];
	}
	if (val > 40 && val <= 50) {
		return riskScoreList[5];
	}
	if (val > 50 && val <= 60) {
		return riskScoreList[6];
	}
	if (val > 60 && val <= 70) {
		return riskScoreList[7];
	}
	if (val > 70 && val <= 80) {
		return riskScoreList[8];
	}
	if (val > 80 && val <= 90) {
		return riskScoreList[9];
	}
	if (val > 90) {
		return riskScoreList[10];
	}
	return riskScoreList[0];
};

export const findMinMaxFields = (value: number | IDepthValue): string => {
	if (typeof value === "number") {
		return value.toString();
	}

	if (value && value.minimum && value.maximum) {
		if (value.minimum === value.maximum) {
			return value.minimum.toString();
		}
		return `${value.minimum} - ${value.maximum}`;
	}
	return "";
};

export const formatAndMapVisualData = (scoreSources?: IScoreDataSource[]) => {
	const sources: IScoreDataSourceExt[] =
		scoreSources?.map((source) => ({
			...source,
			depthSortValue: formatterDepthSortValue(source.depth),
		})) || [];

	const riskySources: IScoreDataSourceExt[] = sources.filter(
		(source) => source.listType === "Risky sources",
	);
	const unknownSources: IScoreDataSourceExt[] = sources.filter(
		(source) => source.listType === "Unknown sources",
	);
	const knownSources: IScoreDataSourceExt[] = sources.filter(
		(source) => source.listType === "Known sources",
	);

	const groupedSourcesByType = formatter(sources, "type");
	let riskPercent = 0;

	groupedSourcesByType.forEach((item) => {
		if (item.funds.score >= 55) {
			riskPercent += item.share;
		}
	});

	const allDataSource: IScoreDataSourceVisual[] = groupedSourcesByType
		.map((item) => ({
			...item,
			funds: {
				...item.funds,
				default: Boolean(item.funds.default),
			},
			key: item.funds.type,
			tooltip: `${item.type} ${formatShare(roundShare(item.share))}`,
			pieValue: item.share,
			value: item.share,
			itemStyle: {
				color: item.funds.default
					? findColorByTypeScore(-1)
					: findColorByTypeScore(item.funds.score),
			},
		}))
		.sort((a, b) => (a.share < b.share ? 1 : -1));

	const groupedSourcesByOwner = formatter(sources, "owner");

	const allDataSourceByOwner: IScoreDataSourceVisual[] = groupedSourcesByOwner
		.map((item) => ({
			...item,
			funds: {
				...item.funds,
				default: Boolean(item.funds.default),
			},
			key: item.owner,
			tooltip: `${item.owner} ${formatShare(item.share)}`,
			pieValue: item.share,
			value: item.share,
			itemStyle: {
				color: item.funds.default
					? findColorByTypeScore(-1)
					: findColorByTypeScore(item.funds.score),
			},
		}))
		.sort((a, b) => (a.share < b.share ? 1 : -1));

	return {
		riskySources,
		unknownSources,
		knownSources,
		allDataSource,
		allDataSourceByOwner,
		riskPercent,
	};
};

import { IHeaderColumn } from "components/UI/Table/Table";

export const ApiKeysColumns: IHeaderColumn[] = [
	{
		label: "Name (Label)",
	},
	{
		label: "API Key",
	},
	{
		label: "IP restriction",
	},
	{
		label: "Pairs",
	},
	{
		label: "Created At",
	},
	{
		label: "Used At",
	},
	{
		align: "center",
	},
	{
		label: "Action",
		align: "right",
	},
];

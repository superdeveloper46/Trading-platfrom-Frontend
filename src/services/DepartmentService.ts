import ApiClient from "helpers/ApiClient";

const DepartmentService = {
	getDepartmentInfo: (): Promise<any> => ApiClient.get("web/company/department"),
};

export default DepartmentService;

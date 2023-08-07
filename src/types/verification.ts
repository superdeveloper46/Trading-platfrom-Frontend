export enum StatusEnum {
	NOT_STARTED = 0,
	DRAFT = 1,
	SUBMITTED = 2,
	MODERATION = 3,
	APPROVED = 4,
	REJECTED = 5,
	CANCELLED = 6,
	REVOKED = 7,
}

export enum AddressDocumentTypeEnum {}

export enum GenderEnum {
	MALE = 1,
	FEMALE = 2,
}

export interface IFile {
	file: File | null;
	preview: string | ArrayBuffer | null;
}

export interface IPersonFillBody {
	name?: string;
	second_name?: string;
	middle_name?: string;
	birthday?: string; // "YYYY-MM-DD";
	contact_phone_number?: string;
	identity_document_type?: number;
	identity_front_document?: string;
	identity_back_document?: string;
	issuing_country?: string;
	document_number?: string;
	expire_date?: string; // "YYYY-MM-DD";
	selfie?: string;
	gender?: number; // "1" | "2"
	non_expiring_document?: boolean;
}

export interface IStatus {
	key: number;
	label: string;
}

export interface IStateType {
	status: IStatus;
	can_edit: boolean;
	can_submit: boolean;
	can_restart: boolean;
	comment: string;
}

export interface ILimit {
	quota: string;
	currency: string;
}

export interface IVerificationState {
	approved: IStateType;
	latest: IStateType;
	limit?: ILimit;
}

export interface IPersonFill {
	status?: IStatus;
	can_edit?: boolean;
	can_submit?: boolean;
	can_restart?: boolean;
	comment?: string;
	name: string;
	second_name: string;
	middle_name: string;
	birthday: string;
	contact_phone_number: string;
	identity_document_type: number;
	identity_front_document: string;
	identity_back_document: string;
	issuing_country: string;
	document_number: string;
	expire_date: string;
	selfie: string;
	gender: number;
}

export interface IPersonFillBodyUpdate {
	name?: string;
	second_name?: string;
	middle_name?: string;
	birthday?: string; // "YYYY-MM-DD";
	contact_phone_number?: string;
	identity_document_type?: string;
	identity_front_document?: string;
	identity_back_document?: string;
	issuing_country?: string;
	document_number?: string;
	expire_date?: string; // "YYYY-MM-DD";
	selfie?: string;
	gender?: number; // "1" | "2"
	non_expiring_document?: boolean;
}

export interface IAddressFillBody {
	address: string;
	citizenship: string;
	region: string;
	document_type: number;
	document: string;
	city: string;
	country: string;
	postal_code: string;
}

export interface IAddressFill {
	status?: IStatus;
	can_edit?: boolean;
	can_submit?: boolean;
	can_restart?: boolean;
	comment?: string;
	address?: string;
	citizenship?: string;
	region?: string;
	document_type?: string;
	city?: string;
	country?: string;
	postal_code?: string;
	document?: string;
}

export interface IAddressFillBodyUpdate {
	address?: string;
	citizenship?: string;
	region?: string;
	document_type?: string; // "10" | "20"
	document?: string;
	city?: string;
	country?: string;
	postal_code?: string;
}

export interface IFinanceFillBody {
	kyc_agreement: string;
	document_type: number;
	document: string;
}

export interface IFinanceFillBodyUpdate {
	kyc_agreement?: string;
	document_type?: number;
	document?: string;
}

export interface IFinanceFill {
	status: IStatus;
	can_edit: boolean;
	can_submit: boolean;
	can_restart: boolean;
	comment: string;
	kyc_agreement: string;
	document_type: number;
	document: string;
}

export enum LevelEnum {
	Personal = "personal",
	Address = "address",
	Finance = "finance",
}

export enum VariantEnum {
	Document = "document",
	Selfie = "selfie",
}

export enum VariantDocumentsEnum {
	Selfie = "selfie",
	KycAgreement = "kyc_agreement",
	IdentityFront = "identity_front_document",
	IdentityBack = "identity_back_document",
	Document = "document",
}

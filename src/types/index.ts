type PaySource = 'online' | 'offline' | string;
export type Сategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'кнопка'
	| 'дополнительное'
	| 'другое';

export interface ICardItem {
	id: string;
	description?: string;
	image?: string;
	title: string;
	category?: Сategory;
	price?: number | null;
	button?: string;
}

export interface IAppState {
	catalog: ICardItem[];
	basket: ICardItem[];
	preview: string | null;
	order: IOrder | null;
}
export interface IPaymentForm {
	payment: PaySource;
	address: string;
}

export interface IContactsForm {
	email: string;
	phone: string;
}
export interface IOrder extends IContactsForm, IPaymentForm {
	items: string[];
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;
export interface IOrderResult {
	id: string;
    total: number;
}

export interface ISuccess {
	total?: number;
	onClick: () => void;
}

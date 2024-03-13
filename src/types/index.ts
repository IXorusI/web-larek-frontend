type PaySource = 'online' | 'offline';
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
// export interface ICardList {
//     total: number;
// 	items: ICardItem[];
// }

//export type Icard = ICardItem  & ICardList;

export interface IAppState {
	//    catalog: Icard[];
	catalog: ICardItem[];
	basket: string[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
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

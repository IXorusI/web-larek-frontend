export type pay_source = 'онлайн' | 'При получении' | string
export type category = 'софт-скил'|'хард-скил'|'кнопка'|'дополнительное'|'другое'

export interface ICardItem {
    id: string,
    description?: string,
    image?: string,
    title: string,
    category?: category,
    price?: number | null,
    button?: string
}
export interface IcardList {
    total: number;
	items: ICardItem[];
}

export type Icard = ICardItem  & IcardList;

export interface Ipay {
    pay_source: pay_source,
    addres: string
}

export interface IAppState {
    catalog: Icard[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}
export interface IOrderForm {
    email: string;
    phone: string;
}
export interface IOrder extends IOrderForm {
    items: string[]
    payment: pay_source
    address: string
    sum: number
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;
export interface IOrderResult {
    id: string;
}

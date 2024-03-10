export type pay_source = 'онлайн' | 'При получении'
export type category = 'софт-скил'|'хард-скил'|'кнопка'|'дополнительное'|'другое'
export interface IBucked {
    items: object[],
    summ: number
}
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

export type Iall = ICardItem & IBucked & IcardList;

export interface Ipay {
    pay_source: pay_source,
    addres: string
}

export type IBasketItem = Pick<Iall, 'id' | 'title' | 'price'>
export interface IAppState {
    catalog: Iall[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}
export interface IOrderForm {
    email: string;
    phone: string;
    address: string;
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

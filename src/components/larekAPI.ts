import { Api, ApiListResponse } from './base/api';
import { IOrder, IOrderResult, ICardItem } from '../types/index';

export interface ILarekApi {
	getCardList: () => Promise<ICardItem[]>;
}

export class larekApi extends Api implements ILarekApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getCardList(): Promise<ICardItem[]> {
		return this.get('/product').then((data: ApiListResponse<ICardItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderProducts(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}

import { Api, ApiListResponse, ApiPostMethods } from './base/api';
import { ICardItem, Iall } from '/dev/web-larek-frontend/web-larek-frontend/src/types/index';



export interface IlarekApi {
    getCardList: () => Promise<ICardItem[]>;
}


export class larekApi extends Api implements IlarekApi {
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
}
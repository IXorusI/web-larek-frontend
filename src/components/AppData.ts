import { Model } from './base/Model';
import {
	FormErrors,
	IAppState,
	ICardItem,
	IOrder,
	Сategory,
} from '../types';

export type CatalogChangeEvent = {
	catalog: CardItem[];
};

export class CardItem extends Model<ICardItem> {
	id: string;
	description?: string;
	image?: string;
	title: string;
	category: Сategory;
	price: number | null;
}

export class AppState extends Model<IAppState> {
	basket: ICardItem[] = [];
	catalog: ICardItem[] = [];
	cardSum: number = 0;
	order: IOrder = {
		email: '',
		phone: '',
		payment: '',
		address: '',
		total: 0,
		items: [],
	};
	preview: string | null;
	formErrors: FormErrors = {};

	setCatalog(items: ICardItem[]) {
		this.catalog = items.map((item) => new CardItem(item, this.events));
		this.emitChanges('cards:changed', { catalog: this.catalog });
	}

	setPreview(item: ICardItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setButtonText(item: ICardItem) {
		if (this.order.items.some((id) => id === item.id)) {
			return 'Убрать';
		} else return 'Купить';
	}

	getCardsInOrder(): ICardItem[] {
		const array: ICardItem[] = [];
		this.order.items.forEach((id) => {
			array.push(this.catalog.find((item) => item.id === id));
		});
		return array;
	}

	getBasketItemIndex(item: ICardItem): number {
		return this.order.items.indexOf(item.id) + 1;
	}

	toggleCardOrder(item: ICardItem) {
		if (!this.order.items.some((id) => id === item.id)) {
			this.order.items = [...this.order.items, item.id];
			this.emitChanges('basket:changed');
		} else {
			this.deleteCardFromOrder(item);
		}
	}

	sendCardsFromOrder() {
		this.basket.forEach(
			(item) => (this.order.items = [...this.order.items, item.id])
		);
		this.order.total = this.getTotal();
	}

	deleteCardFromOrder(item: ICardItem) {
		if (this.order.items.some((id) => id === item.id)) {
			this.order.items = this.order.items.filter((id) => item.id !== id);
			this.emitChanges('basket:changed');
		}
		return;
	}

	getTotal() {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес доставки';
		}

		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setOrderPayment(value: string) {
		if (this.order.payment !== value) this.order.payment = value;
	}

	setOrderAddress(value: string) {
		this.order.address = value;
	}

	setOrderField(
		field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>,
		value: string
	) {
		this.order[field] = value;
		this.validateOrder();
	}

	clearBasket() {
		this.order = {
			email: '',
			phone: '',
			payment: '',
			address: '',
			total: 0,
			items: [],
		};
		this.basket = [];
		this.emitChanges('basket:changed');
	}
}

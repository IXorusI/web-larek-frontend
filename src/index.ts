import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import { Basket } from './components/basket';
import { larekApi } from './components/larekAPI';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { IOrder, ICardItem } from './types';
import { Page } from './components/Page';
import { Modal } from './components/modal';
import { ContactsForm } from './components/ContactsForm';
import { PaymentForm } from './components/PaymentForm';
import { Success } from './components/Success';
import { Card, BasketItem } from './components/Card';

const api = new larekApi(CDN_URL, API_URL);
const events = new EventEmitter();

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const paymentForm = new PaymentForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);


// Изменились элементы каталога
events.on<CatalogChangeEvent>('cards:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

// Отправить в превью карточку
events.on('card:select', (item: ICardItem) => {
	appData.setPreview(item);
});

// Изменен открытый выбранный лот
events.on('preview:changed', (item: ICardItem) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:toBasket', item);
			events.emit('preview:changed', item);
		},
	});
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
			button: appData.setButtonText(item),
		}),
	});
});

events.on('basket:changed', () => {
	page.counter = appData.getCardsInOrder().length;
	basket.items = appData.getCardsInOrder().map((item) => {
		const basketItem = new BasketItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('card:fromBasket', item);
			},
		});

		basketItem.index = appData.getBasketItemIndex(item);

		return basketItem.render({
			title: item.title,
			price: item.price,
		});
	});
	basket.total = appData.getTotal();
});

events.on('card:toBasket', (item: ICardItem) => {
	appData.toggleCardOrder(item);
});

events.on('card:fromBasket', (item: ICardItem) => {
	appData.deleteCardFromOrder(item);
});

// Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Открыть форму заказа
events.on('order:open', () => {
	modal.render({
		content: paymentForm.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Переключение вида оплаты товара
events.on(
	'order:change payment',
	(data: { payment: string; button: HTMLElement }) => {
		appData.setOrderPayment(data.payment);
		paymentForm.togglePayment(data.button);
		appData.validateOrder();
	}
);

// Открытие формы контактов заказа
events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменение поля инпут
events.on(
	/^order\..*:change/,
	(data: {
		field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>;
		value: string;
	}) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Отправлена форма заказа
events.on('contacts:submit', () => {
	appData.sendCardsFromOrder();
	api
		.orderProducts(appData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});
			appData.clearBasket();
		})
		.catch((err) => {
			console.error(err);
		});
});

// Изменилось состояние валидации
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { address, payment, phone, email } = errors;
	paymentForm.valid = !payment && !address;
	paymentForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	contactsForm.valid = !phone && !email;
	contactsForm.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем карточки с сервера
api
	.getCardList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

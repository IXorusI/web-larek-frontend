import './scss/styles.scss';
import { EventEmitter } from "./components/base/events";
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from "./utils/constants";
import { Basket, BasketModel, BasketView, BasketItemView } from "./components/basket";
import { larekApi } from "./components/larekAPI";
import { AppState, CatalogChangeEvent, CardItem } from './components/AppData';
import { ICardItem } from './types';
import { Page } from "./components/Page";
import { Modal } from "./components/modal";
import { Order } from "./components/Order";
import { Card, BasketItem } from "./components/Card";
import { Api } from "./components/base/api";

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
const order = new Order(cloneTemplate(orderTemplate), events);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

console.log(api)
const test = api.getCardList()
console.log(test)

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
	
//    page.counter = appData.getClosedLots().length;
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
		content: order.render({
			valid: false,
			errors: [],
		}),
	});
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
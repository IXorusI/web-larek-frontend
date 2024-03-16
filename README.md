# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/common/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание работы 
Получаем от сервера массив карточек, записываем его в каталог, который отображается на титульной странице. 
Кликая по карточке открывается модальное окно с подробной информацией и кнопкой "Купить"
При нажатии на кнопку "Купить" Товар попадает в корзину, а значение кнопки меняется на "Убрать"
При нажатии на изображении корзины, открывается модальное окно с отображением списка товаров, суммой их стоимости и кнопуой "Оформить"
Нажимая "Оформить" мы попадаем в форму заполнения способа оплаты, и адреса доставки, кнопка "Далее" деактивированна пока не заполнено поле адреса и не выбран тип оплаты
Далее, на следующем модельном окне, аналогично заполняются email и телефон заказчика
После всего, при заполнении всех данных, появляется окно с суммой заказа и оповещением о заказе


## Описание типов

Тип PaySource
Описывает возможные варианты оплаты товара
type PaySource = 'online' | 'offline';

Тип Сategory
Учитывает разнычные категории, в которых может находиться товар
type Сategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'кнопка'
	| 'дополнительное'
	| 'другое';

Тип FormErrors
Содержит ошибки заполнения полей заказа
type FormErrors = Partial<Record<keyof IOrder, string>>;

Интерфейс ICardItem
Описывает типы для потей карточки товара
interface ICardItem {
	id: string;
	description?: string;
	image?: string;
	title: string;
	category?: Сategory;
	price?: number | null;
	button?: string;
}

Интерфейс IAppState
Описывает типы для класса хранения данных
interface IAppState {
	catalog: ICardItem[];
	basket: string[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
}

Интерфейс IPaymentForm
Описывает форму выбора типа оплаты и адреса доставки
interface IPaymentForm {
	payment: PaySource;
	address: string;
}

Интерфейс IContactsForm
Описывает форму заполнения личных данных (телефон и email)
interface IContactsForm {
	email: string;
	phone: string;
}

Интерфейс IOrder, расширяет интерфейсы IPaymentForm и IContactsForm
В дополнении к типам расширяемых интерфейсов, описывает массив товаров и сумму заказа 
interface IOrder extends IContactsForm, IPaymentForm {
	items: string[];
	total: number;
}

Интерфейс IOrderResult
Содержит тимы id заказа и его суммы
interface IOrderResult {
	id: string;
    total: number;
}

Интерфейс ISuccess
Описывает форму окна подтверждения заказа и кнопку этого поля
interface ISuccess {
	total?: number;
	onClick: () => void;
}


## Описание базовых классов

Класс Api
    Принимает в конструктор адрес сервера для обращений и данные инициализации запроса (Content-Type)
    Реализовывает методы:
    - handleResponse - для проверки ответа от методов get и post
    - get - для получения от сервера, принимающий параметр uri
    - post - для отправки данных на сервер, принимающий uri ссылку, объект и метод запроса

Абстрактный класс Component<T>
    Принимает в конструктор HTML элементы
    Имеет методы:
    - toggleClass - добавляет или удаляет класс переданному элементу, принимает html элемент, класс который необходимо добавить или удалить, 
        и булевое значение (не обязательно) для указания действия
    - setText - принимает элемент html и значение, которое будет записано в этот элемент при помощи функции textContent
    - setDisabled - принимает элемент и булевое значение активности, активирует или деактивирует переданный элемент
    - setHidden - Убирает отображение элемента (путём добавления элементу свойства display со значением 'none')
    - setVisible - возвращает отображение элемента (удаляет у элемента свойство display)
    - setImage - принимает элемент, ссылку(src) и необязательный альтернативный вариант описания(alt), присваевает переданные значения элементу
    - render - принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент


Класс EventEmitter, имплементирует интерфейс IEvents
    Имеет методы:
    - on - установить обработчик события
    - off - снять обработчика с события
    - emit - инициировать событие с данными
    - onAll - слушать все события
    - offAll - сбросить все обработчики

Абстрактный класс Model
    Принимает в конструктор объект и событие
    Имеет метод:
    - emitChanges - оповещает о том что событие с заданным объектом произошло


## Описание дочерних классов

Класс Page, расширяет абстрактный класс Component
    Содержит в себе элементы страницы: корзина, счётчик корзины, каталог товаров, обёртку для блокировки фона страницы
    Имеет сеттеры на счётчик корзины и каталог элементов получаемых с сервера
    Так же имеет метод блокировки фона страницы (для модальных окон)

Класс LarekApi, расширяет базовый класс Api
    принимает на конструктор ссылку на расположение CDN_URL и базовую ссылку сервера API_URL
    Имеет метод :
    - getCardList - получает от сервера массив объектов(товаров) и возвращает массив объектов с заданными изображениями

Класс AppState, расширяет класс Model
    Хранит данные о состоянии корзины, каталога товаров, суммы заказа, состоянии полей данных заказа, и ошибках выполнения модуля
    Имеет методы:
    - setCatalog - добавляет в массив каталога корточку товара
    - setPreview - задаёт параметру preview id переданной карточки
    - setButtonText - переключает текст кнопки в карточке, для добавления и удаления из корзины
    - getCardsInOrder - возвращает массив объектов в заказе
    - getBasketItemIndex - возвращает индекс объекта в корзине
    - toggleCardOrder - добавляет или удаляет объект в корзину
    - deleteCardFromOrder - удаляет объект из корзины
    - getTotal - возвращает сумму цен товаров в корзине
    - validateOrder - отображает ошибку о незаполненных полях
    - setOrderField - устанавливает значения ключам заказа address, phone и email
    - setOrderPayment - устанавливающий выбранный способ оплаты заказа
    - setOrderAddress - устанавливающий значение адрес доставки заказа

Класс Basket, расширяет класс Component
    Содержит информацию для отображения корзины, принимает шаблон значения в соответствующие поля
    имеет методы:
    - items - отображает объекты записанные в корзину списком, активирует и деактивирует кнопку заказа
    - total - отображает сумму цен объектов в корзине

Класс Card, расширяет класс Component
    Принимает в конструктор шаблон карточки, записывает в поля шаблони значения при помощи сеттеров и геттеров

Класс Form, расширяет абстрактный класс Component
    Содерит информацию о типе кнопки сабмит, и о полях отображения ошибок валидации инпутов. 
    Принимает в конструктор контейнер, находит в нём HTML элементы кнопки сабмита и полей для отображения ошибок, задаёт ис слушатель событий
    Имеет сеттеры:
    - valid - для отключения кнопки сабмита
    - errors - для присвоения значения ошибки соответствующему HTML элементу
    Имеет методы:
    - onInputChange - создающий событие при изменении инпута
    - render - для отображения значение ошибок заполнения форм

Класс Modal, расширяет абстрактный класс Component
    Принимает контейнер и событие в конструктор, Записывает значения кнопки закрытия и контента модального окна в соответствующие элементы
    Имеет методы:
    - open - открывает модальное окно (путём добавления ему класса "modal_active")
    - close - закрывает модальное окно (удаляет вышеупомянутый класс)
    - render - отрисовывает содержимое окна

Класс Success, расширяет абстрактный класс Component
    Хранит данные о HTML элементах - кнопка закрытия и описание. Принимает в конструктор контейнер и событие, записывает значения кнопки закрытия и контента модального окна в соответствующие элементы.
    Задаёт отслеживание клика по модальному кнопке закрытия
    Имеет сеттер:
    - total - для отображения суммы списанных синапсов

Класс PaymentForm, расширяет класс Form
    Содержит данные о кнопках выбора способа оплаты, устанавливает на них обработчики клика. Содержит сеттер для установки значения полю адреса доставки заказа. 
    Имеет методы:
    - togglePayment - для переключения класса нажатой кнопки
    - cancelPayment - для сброса состояние всех кнопок

Класс ContactsForm, расширяет класс Form
    Принимает в конструктор контейнер и событие
    При помощи сеттеров записывает значение phone и email из полей ввода
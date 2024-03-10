import {Component} from "./base/Component";
import {ICardItem, category} from "../types";
import {bem, createElement, ensureElement} from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICardItem> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _category: HTMLSpanElement;
	protected _price: HTMLSpanElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._image = container.querySelector(`.card__image`);
		this._button = container.querySelector(`.card__button`);
		this._category = container.querySelector(`.card__category`);
		this._price = ensureElement<HTMLSpanElement>(`.card__price`, container);
		this._description = container.querySelector(`.card__text`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	get description(): string {
		return this._description.textContent || '';
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set price(value: string) {
		if (value) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, `Бесценно`);
			this.setDisabled(this._button, true);
		}
	}

	get price(): string {
		return this._price.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

    set button(value: string) {
		this.setText(this._button, value);
	}
}

export class BasketItem extends Card {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _deleteButton: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);

		this._index = ensureElement<HTMLElement>(
			'.basket__item-index',
			this.container
		);
		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		this._deleteButton = ensureElement<HTMLElement>(
			'.basket__item-delete',
			this.container
		);
	}

	set index(index: number) {
		this.setText(this._index, index);
	}

}



// export type CatalogItemStatus = {
//     status: LotStatus,
//     label: string
// };




// export class Auction extends Component<AuctionStatus> {
//     protected _time: HTMLElement;
//     protected _label: HTMLElement;
//     protected _button: HTMLButtonElement;
//     protected _input: HTMLInputElement;
//     protected _history: HTMLElement;
//     protected _bids: HTMLElement
//     protected _form: HTMLFormElement;

//     constructor(container: HTMLElement, actions?: IAuctionActions) {
//         super(container);

//         this._time = ensureElement<HTMLElement>(`.lot__auction-timer`, container);
//         this._label = ensureElement<HTMLElement>(`.lot__auction-text`, container);
//         this._button = ensureElement<HTMLButtonElement>(`.button`, container);
//         this._input = ensureElement<HTMLInputElement>(`.form__input`, container);
//         this._bids = ensureElement<HTMLElement>(`.lot__history-bids`, container);
//         this._history = ensureElement<HTMLElement>('.lot__history', container);
//         this._form = ensureElement<HTMLFormElement>(`.lot__bid`, container);

//         this._form.addEventListener('submit', (event) => {
//             event.preventDefault();
//             actions?.onSubmit?.(parseInt(this._input.value));
//             return false;
//         });
//     }

//     set time(value: string) {
//         this.setText(this._time, value);
//     }
//     set label(value: string) {
//         this.setText(this._label, value);
//     }
//     set nextBid(value: number) {
//         this._input.value = String(value);
//     }
//     set history(value: number[]) {
//         this._bids.replaceChildren(...value.map(item => createElement<HTMLUListElement>('li', {
//             className: 'lot__history-item',
//             textContent: formatNumber(item)
//         })));
//     }

//     set status(value: LotStatus) {
//         if (value !== 'active') {
//             this.setHidden(this._history);
//             this.setHidden(this._form);
//         } else {
//             this.setVisible(this._history);
//             this.setVisible(this._form);
//         }
//     }

//     focus() {
//         this._input.focus();
//     }
// }

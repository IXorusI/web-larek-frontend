import { Component } from './base/Component';
import { cloneTemplate, createElement, ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

const events = new EventEmitter();

// interface IBasketModel {
//     items: Map<string, number>;
//     add(id: string): void;
//     remove(id: string): void;
// }

interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}
		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.setDisabled(this._button, false);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setDisabled(this._button, true);
		}
	}

	set total(val: number) {
		this.setText(this._total, `${val} синапсов`);
	}

	// set selected(items: string[]) {
	// 	if (items.length) {
	// 		this.setDisabled(this._button, false);
	// 	} else {
	// 		this.setDisabled(this._button, true);
	// 	}
	// }
}

// interface IView {
//     render(data?: object): HTMLElement;
// }

// interface IViewConstructor {
//     new (container: HTMLElement, events?: IEventEmitter): IView
// }

// export class BasketModel implements IBasketModel {
//     constructor(protected events: IEventEmitter) {}

//     items: Map<string, number> = new Map()

//     add(id: string): void {
//         if (!this.items.has(id)) this.items.set(id, 0);
//         this.items.set(id, this.items.get(id)! + 1)
//         this._changed()
//     }
//     remove(id: string): void {
//         if (!this.items.has(id)) return;
//         if (this.items.get(id)! > 1){
//             this.items.set(id, this.items.get(id)! - 1);
//             if (this.items.get(id) === 0) this.items.delete(id)
//         }
//         this._changed()
//     }

//     protected _changed() {
//         this.events.emit('basket:change', {items: Array.from(this.items.keys())})
//     }
// }

// export class BasketView implements IView {
//     constructor(protected container: HTMLElement){}
//     render(data: {items: HTMLElement[]}){
//         if (data){
//             this.container.replaceChildren(...data.items)
//         }
//         return this.container
//     }
// }

// export class BasketItemView implements IView {
//     protected title: HTMLSpanElement;
//     protected addButton: HTMLButtonElement;
//     protected removeButton: HTMLButtonElement;

//     protected id: string | null;

//     constructor(protected container: HTMLElement, protected events: IEventEmitter){
//         this.title = container.querySelector('.basket-item_title') as HTMLSpanElement;
//         this.addButton = container.querySelector('.basket-item_add') as HTMLButtonElement;
//         this.removeButton = container.querySelector('.basket-item_remove') as HTMLButtonElement;

//         this.addButton.addEventListener('click', ()=>{
//             this.events.emit('ui:basket-add', {id: this.id})
//         })
//         this.removeButton.addEventListener('click', ()=>{
//             this.events.emit('ui:basket-remove', {id: this.id})
//         })
//     }

//     render(data: {id: string, title: string}){
//         if (data){
//             this.id = data.id;
//             this.title.textContent = data.title;
//         }
//         return this.container
//     }
// }

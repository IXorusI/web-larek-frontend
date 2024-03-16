import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { ISuccess } from '../types';


export class Success extends Component<ISuccess> {
    protected _description: HTMLParagraphElement;
	protected _close: HTMLElement;

	constructor(container: HTMLElement, events: ISuccess) {
		super(container);

        this._description = ensureElement<HTMLParagraphElement>(`.order-success__description`, container);
		this._close = ensureElement<HTMLElement>('.order-success__close',this.container);

		if (events?.onClick) {
			this._close.addEventListener('click', events.onClick);
		}
	}

    set total(value: string) {
        this.setText(this._description, `Списано ${value} синапсов`);
    }
}
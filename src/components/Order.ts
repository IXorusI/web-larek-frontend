import { Form } from './Form';
import { IContactsForm } from '../types';
import { EventEmitter, IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Order extends Form<IContactsForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}

import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/constants';

export class BasketView extends Component<unknown> {
  private listEl: HTMLUListElement;
  private totalEl: HTMLElement;
  private checkoutBtn: HTMLButtonElement;
  private events: IEvents;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template.content.firstElementChild!.cloneNode(true) as HTMLElement);
    this.events = events;
    this.listEl = this.container.querySelector('.basket__list') as HTMLUListElement;
    this.totalEl = this.container.querySelector('.basket__price') as HTMLElement;
    this.checkoutBtn = this.container.querySelector('.basket__button') as HTMLButtonElement;
    this.checkoutBtn.addEventListener('click', () => this.events.emit(AppEvents.CheckoutClicked));
  }

  setItemNodes(nodes: HTMLElement[]) {
    this.listEl.replaceChildren(...nodes);
  }

  setEmptyState() {
    this.listEl.replaceChildren(document.createTextNode('Корзина пуста'));
    this.setCheckoutEnabled(false);
    this.setTotal(0);
  }

  setTotal(total: number) {
    this.totalEl.textContent = `${total} синапсов`;
  }

  setCheckoutEnabled(enabled: boolean) {
    this.checkoutBtn.disabled = !enabled;
  }
}



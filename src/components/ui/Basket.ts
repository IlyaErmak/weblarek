import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/constants';
import { BasketCard } from './Card';

export class BasketView extends Component<unknown> {
  private listEl: HTMLUListElement;
  private totalEl: HTMLElement;
  private checkoutBtn: HTMLButtonElement;
  private itemTemplate: HTMLTemplateElement;
  private events: IEvents;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template.content.firstElementChild!.cloneNode(true) as HTMLElement);
    this.events = events;
    this.listEl = this.container.querySelector('.basket__list') as HTMLUListElement;
    this.totalEl = this.container.querySelector('.basket__price') as HTMLElement;
    this.checkoutBtn = this.container.querySelector('.basket__button') as HTMLButtonElement;
    this.itemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
    this.checkoutBtn.addEventListener('click', () => this.events.emit(AppEvents.CheckoutClicked));
  }

  setItems(items: IProduct[]) {
    if (items.length === 0) {
      this.listEl.replaceChildren(document.createTextNode('Корзина пуста'));
      this.checkoutBtn.disabled = true;
      this.totalEl.textContent = '0 синапсов';
      return;
    }
    this.checkoutBtn.disabled = false;
    const nodes = items.map((p, index) => {
      const card = new BasketCard(this.itemTemplate, this.events);
      card.setProduct(p);
      return card.render({ id: p.id, title: p.title, price: p.price, index: index + 1 });
    });
    this.listEl.replaceChildren(...nodes);
  }

  setTotal(total: number) {
    this.totalEl.textContent = `${total} синапсов`;
  }
}



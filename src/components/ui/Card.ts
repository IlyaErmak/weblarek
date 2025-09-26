import { Component } from '../base/Component';
import { categoryMap, CDN_URL, AppEvents } from '../../utils/constants';
import { IEvents } from '../base/Events';

export type CardMode = 'catalog' | 'preview' | 'basket';

export interface BaseCardState {
  id: string;
  title: string;
  image?: string;
  category?: string;
  price?: number | null;
}

export abstract class BaseCard<TState extends BaseCardState> extends Component<TState> {
  protected events: IEvents;
  protected productId?: string;

  protected constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
  }

  protected setCategory(element: HTMLElement | null, category?: string) {
    if (!element) return;
    // remove previous category classes using classList
    const toRemove: string[] = [];
    element.classList.forEach((c) => {
      if (c.startsWith('card__category_')) toRemove.push(c);
    });
    toRemove.forEach((c) => element.classList.remove(c));
    if (category && categoryMap[category as keyof typeof categoryMap]) {
      element.classList.add(categoryMap[category as keyof typeof categoryMap]);
    }
  }

  protected formatPrice(price?: number | null): string {
    if (price === null || price === undefined) return 'Бесценно';
    return `${price} синапсов`;
  }
}

export class CatalogCard extends BaseCard<BaseCardState> {
  private titleEl: HTMLElement;
  private categoryEl: HTMLElement;
  private imageEl: HTMLImageElement;
  private priceEl: HTMLElement;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template.content.firstElementChild!.cloneNode(true) as HTMLElement, events);
    this.titleEl = this.container.querySelector('.card__title') as HTMLElement;
    this.categoryEl = this.container.querySelector('.card__category') as HTMLElement;
    this.imageEl = this.container.querySelector('.card__image') as HTMLImageElement;
    this.priceEl = this.container.querySelector('.card__price') as HTMLElement;

    this.container.addEventListener('click', () => {
      if (!this.productId) return;
      this.events.emit(AppEvents.CardSelected, { id: this.productId });
    });
  }

  render(data?: Partial<BaseCardState>) {
    super.render(data);
    if (data) {
      if (data.id) this.productId = data.id;
      if (data.title !== undefined) this.titleEl.textContent = String(data.title);
      const canUseCdn = CDN_URL && !String(CDN_URL).startsWith('undefined');
      if (canUseCdn && data.image) {
        this.setImage(this.imageEl, `${CDN_URL}${data.image}`, String(data.title ?? ''));
      }
      this.setCategory(this.categoryEl, data.category);
      this.priceEl.textContent = this.formatPrice(data.price);
    }
    return this.container;
  }
}

export class PreviewCard extends BaseCard<BaseCardState> {
  private titleEl: HTMLElement;
  private categoryEl: HTMLElement;
  private imageEl: HTMLImageElement;
  private textEl: HTMLElement;
  private priceEl: HTMLElement;
  private buttonEl: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template.content.firstElementChild!.cloneNode(true) as HTMLElement, events);
    this.imageEl = this.container.querySelector('.card__image') as HTMLImageElement;
    this.categoryEl = this.container.querySelector('.card__category') as HTMLElement;
    this.titleEl = this.container.querySelector('.card__title') as HTMLElement;
    this.textEl = this.container.querySelector('.card__text') as HTMLElement;
    this.priceEl = this.container.querySelector('.card__price') as HTMLElement;
    this.buttonEl = this.container.querySelector('.card__button') as HTMLButtonElement;

    this.buttonEl.addEventListener('click', () => {
      if (!this.productId) return;
      this.events.emit(AppEvents.BuyClicked, { id: this.productId });
    });
  }

  setInCart(inCart: boolean) {
    this.buttonEl.textContent = inCart ? 'Удалить из корзины' : 'В корзину';
  }

  setDisabledUnavailable(disabled: boolean) {
    this.buttonEl.disabled = disabled;
    if (disabled) this.buttonEl.textContent = 'Недоступно';
  }

  render(data?: Partial<BaseCardState & { description?: string; inCart?: boolean }>) {
    super.render(data);
    if (data) {
      if (data.id) this.productId = data.id;
      if (data.title !== undefined) this.titleEl.textContent = String(data.title);
      if (data.description !== undefined) this.textEl.textContent = String(data.description);
      const canUseCdn = CDN_URL && !String(CDN_URL).startsWith('undefined');
      if (canUseCdn && data.image) {
        this.setImage(this.imageEl, `${CDN_URL}${data.image}`, String(data.title ?? ''));
      }
      this.setCategory(this.categoryEl, data.category);
      this.priceEl.textContent = this.formatPrice(data.price);
      this.setDisabledUnavailable(data.price === null);
    }
    if (data?.inCart !== undefined) {
      this.setInCart(Boolean(data.inCart));
    }
    return this.container;
  }
}

export class BasketCard extends BaseCard<BaseCardState & { index: number }> {
  private indexEl: HTMLElement;
  private titleEl: HTMLElement;
  private priceEl: HTMLElement;
  private deleteBtn: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template.content.firstElementChild!.cloneNode(true) as HTMLElement, events);
    this.indexEl = this.container.querySelector('.basket__item-index') as HTMLElement;
    this.titleEl = this.container.querySelector('.card__title') as HTMLElement;
    this.priceEl = this.container.querySelector('.card__price') as HTMLElement;
    this.deleteBtn = this.container.querySelector('.basket__item-delete') as HTMLButtonElement;

    this.deleteBtn.addEventListener('click', () => {
      if (!this.productId) return;
      this.events.emit(AppEvents.RemoveFromCartClicked, { id: this.productId });
    });
  }

  render(data?: Partial<BaseCardState & { index: number }>) {
    super.render(data);
    if (data) {
      if (data.id) this.productId = data.id;
      this.indexEl.textContent = String((data.index ?? 0));
      if (data.title !== undefined) this.titleEl.textContent = String(data.title);
      this.priceEl.textContent = this.formatPrice(data.price);
    }
    return this.container;
  }
}



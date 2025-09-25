import { Component } from '../base/Component';
import { IProduct } from '../../types';
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
  protected product?: IProduct;

  protected constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
  }

  setProduct(product: IProduct) {
    this.product = product;
  }

  protected setCategory(element: HTMLElement | null, category?: string) {
    if (!element) return;
    element.className = element.className
      .split(' ')
      .filter((c) => !c.startsWith('card__category_'))
      .join(' ');
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
      if (!this.product) return;
      this.events.emit(AppEvents.CardSelected, { id: this.product.id });
    });
  }

  render(data?: Partial<BaseCardState>) {
    super.render(data);
    if (this.product) {
      this.titleEl.textContent = this.product.title;
      const canUseCdn = CDN_URL && !String(CDN_URL).startsWith('undefined');
      if (canUseCdn) {
        this.setImage(this.imageEl, `${CDN_URL}${this.product.image}`, this.product.title);
      }
      this.setCategory(this.categoryEl, this.product.category);
      this.priceEl.textContent = this.product.price === null ? 'Бесценно' : this.formatPrice(this.product.price);
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
      if (!this.product) return;
      this.events.emit(AppEvents.BuyClicked, { id: this.product.id });
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
    if (this.product) {
      this.titleEl.textContent = this.product.title;
      this.textEl.textContent = this.product.description;
      const canUseCdn = CDN_URL && !String(CDN_URL).startsWith('undefined');
      if (canUseCdn) {
        this.setImage(this.imageEl, `${CDN_URL}${this.product.image}`, this.product.title);
      }
      this.setCategory(this.categoryEl, this.product.category);
      this.priceEl.textContent = this.product.price === null ? 'Бесценно' : this.formatPrice(this.product.price);
      this.setDisabledUnavailable(this.product.price === null);
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
      if (!this.product) return;
      this.events.emit(AppEvents.RemoveFromCartClicked, { id: this.product.id });
    });
  }

  render(data?: Partial<BaseCardState & { index: number }>) {
    super.render(data);
    if (this.product) {
      this.indexEl.textContent = String((data?.index ?? 0));
      this.titleEl.textContent = this.product.title;
      this.priceEl.textContent = this.product.price === null ? 'Бесценно' : this.formatPrice(this.product.price);
    }
    return this.container;
  }
}



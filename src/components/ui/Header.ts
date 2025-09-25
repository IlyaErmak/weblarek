import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/constants';

export class Header extends Component<unknown> {
  private basketBtn: HTMLButtonElement;
  private counterEl: HTMLElement;
  private events: IEvents;

  constructor(root: HTMLElement, events: IEvents) {
    super(root);
    this.events = events;
    this.basketBtn = root.querySelector('.header__basket') as HTMLButtonElement;
    this.counterEl = root.querySelector('.header__basket-counter') as HTMLElement;
    this.basketBtn.addEventListener('click', () => this.events.emit(AppEvents.BasketOpenClicked));
  }

  setCount(count: number) {
    this.counterEl.textContent = String(count);
  }
}



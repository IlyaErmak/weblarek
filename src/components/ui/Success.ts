import { Component } from '../base/Component';

export class SuccessView extends Component<{ total: number }> {
  private titleEl: HTMLElement;
  private descEl: HTMLElement;
  private closeBtn: HTMLButtonElement;

  constructor(template: HTMLTemplateElement) {
    super(template.content.firstElementChild!.cloneNode(true) as HTMLElement);
    this.titleEl = this.container.querySelector('.order-success__title') as HTMLElement;
    this.descEl = this.container.querySelector('.order-success__description') as HTMLElement;
    this.closeBtn = this.container.querySelector('.order-success__close') as HTMLButtonElement;
  }

  onClose(handler: () => void) {
    this.closeBtn.addEventListener('click', handler);
  }

  setTotal(total: number) {
    this.descEl.textContent = `Списано ${total} синапсов`;
  }
}



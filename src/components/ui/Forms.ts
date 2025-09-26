import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/constants';
import { PaymentMethod } from '../../types';

abstract class BaseForm<T> extends Component<T> {
  protected events: IEvents;
  protected formEl: HTMLFormElement;
  protected errorsEl: HTMLElement;

  protected constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template.content.firstElementChild!.cloneNode(true) as HTMLElement);
    this.events = events;
    this.formEl = this.container as HTMLFormElement;
    this.errorsEl = this.container.querySelector('.form__errors') as HTMLElement;
  }

  setErrors(text: string) {
    this.errorsEl.textContent = text;
  }
}

export class OrderForm extends BaseForm<unknown> {
  private addressInput: HTMLInputElement;
  private submitBtn: HTMLButtonElement;
  private cardBtn: HTMLButtonElement;
  private cashBtn: HTMLButtonElement;
  private selected: PaymentMethod | undefined;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);
    this.addressInput = this.container.querySelector('input[name="address"]') as HTMLInputElement;
    this.submitBtn = this.container.querySelector('.order__button') as HTMLButtonElement;
    this.cardBtn = this.container.querySelector('button[name="card"]') as HTMLButtonElement;
    this.cashBtn = this.container.querySelector('button[name="cash"]') as HTMLButtonElement;

    this.cardBtn.addEventListener('click', () => this.setPayment('card'));
    this.cashBtn.addEventListener('click', () => this.setPayment('cash'));

    this.addressInput.addEventListener('input', () => this.emitChange());
    this.formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit(AppEvents.OrderNextStepClicked);
    });
  }

  private emitChange() {
    this.events.emit(AppEvents.FormChanged, { payment: this.selected, address: this.addressInput.value });
  }

  setPayment(method: PaymentMethod) {
    this.selected = method;
    this.cardBtn.classList.toggle('button_alt-active', method === 'card');
    this.cashBtn.classList.toggle('button_alt-active', method === 'cash');
    this.emitChange();
  }

  setSubmitEnabled(enabled: boolean) {
    this.submitBtn.disabled = !enabled;
  }
}

export class ContactsForm extends BaseForm<unknown> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitBtn: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);
    this.emailInput = this.container.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = this.container.querySelector('input[name="phone"]') as HTMLInputElement;
    this.submitBtn = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;

    this.emailInput.addEventListener('input', () => this.emitChange());
    this.phoneInput.addEventListener('input', () => this.emitChange());
    this.formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit(AppEvents.OrderPayClicked);
    });
  }

  private emitChange() {
    this.events.emit(AppEvents.FormChanged, { email: this.emailInput.value, phone: this.phoneInput.value });
  }

  setSubmitEnabled(enabled: boolean) {
    this.submitBtn.disabled = !enabled;
  }
}



import { PaymentMethod } from '../../types';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/constants';

export interface ICustomerData {
    payment?: PaymentMethod;
    address?: string;
    email?: string;
    phone?: string;
}

export type IOrderValidationErrors = {
    payment?: string;
    address?: string;
    email?: string;
    phone?: string;
};

export class Orders {
    private customer: ICustomerData = {};
    constructor(private readonly events?: IEvents) {}

    setPayment(method: PaymentMethod) {
        this.customer.payment = method;
        this.events?.emit(AppEvents.CustomerChanged, { ...this.customer });
    }

    setAddress(address: string) {
        this.customer.address = address;
        this.events?.emit(AppEvents.CustomerChanged, { ...this.customer });
    }

    setEmail(email: string) {
        this.customer.email = email;
        this.events?.emit(AppEvents.CustomerChanged, { ...this.customer });
    }

    setPhone(phone: string) {
        this.customer.phone = phone;
        this.events?.emit(AppEvents.CustomerChanged, { ...this.customer });
    }

    getCustomer(): ICustomerData {
        return { ...this.customer };
    }

    clear() {
        this.customer = {};
        this.events?.emit(AppEvents.CustomerChanged, { ...this.customer });
    }

    validate(): IOrderValidationErrors {
        const errors: IOrderValidationErrors = {
            payment: '',
            address: '',
            email: '',
            phone: '',
        };
        if (!this.customer.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this.customer.address || this.customer.address.trim().length === 0) {
            errors.address = 'Не указан адрес';
        }
        if (this.customer.email !== undefined && this.customer.email.trim().length === 0) {
            errors.email = 'Поле должно быть заполненным';
        }
        if (this.customer.phone !== undefined && this.customer.phone.trim().length === 0) {
            errors.phone = 'Поле должно быть заполненным';
        }
        return errors;
    }
}
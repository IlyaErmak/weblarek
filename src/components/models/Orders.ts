import { PaymentMethod } from '../../types';

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

    setPayment(method: PaymentMethod) {
        this.customer.payment = method;
    }

    setAddress(address: string) {
        this.customer.address = address;
    }

    setEmail(email: string) {
        this.customer.email = email;
    }

    setPhone(phone: string) {
        this.customer.phone = phone;
    }

    getCustomer(): ICustomerData {
        return { ...this.customer };
    }

    clear() {
        this.customer = {};
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
import { apiProducts } from './utils/data';
import { Products } from './components/models/Products';
import { Cart } from './components/models/Cart';
import { Orders } from './components/models/Orders';
import { PaymentMethod } from './types';

document.addEventListener('DOMContentLoaded', () => {
    const productsModel = new Products();
    const cart = new Cart();
    const orders = new Orders();

    productsModel.setItems(apiProducts.items);

    try {
        console.group('Тесты моделей данных');

        console.group('Products');
        console.log('Всего товаров в модели:', productsModel.getItems().length);
        const first = productsModel.getItems()[0];
        if (first) {
            console.log('getById(first.id):', productsModel.getById(first.id));
        }
        console.groupEnd();

        console.group('Cart');
        if (first) {
            cart.addItem(first);
            console.log('После addItem:', cart.getItems());
            console.log('getCount():', cart.getCount());
            console.log('getTotal():', cart.getTotal());
            console.log('hasItem(first.id):', cart.hasItem(first.id));
            cart.removeItem(first.id);
            console.log('После removeItem:', cart.getItems());
            console.log('Сумма после removeItem:', cart.getTotal());
        }
        console.groupEnd();

        console.group('Orders (данные покупателя)');
        
        const payment: PaymentMethod = 'card';
        orders.setPayment(payment);
        orders.setAddress('Москва, ул. Тестовая, д. 1');
        orders.setEmail('user@example.com');
        orders.setPhone('+7 900 000-00-00');
        console.log('getCustomer() после установки:', orders.getCustomer());

        console.log('validate() с корректными полями:', orders.validate());

        orders.setPayment('cash');
        orders.setAddress('Санкт-Петербург, Невский проспект, д. 10');
        orders.setEmail('new@example.com');
        orders.setPhone('+7 911 111-11-11');
        console.log('getCustomer() после обновления:', orders.getCustomer());
        console.log('validate() после обновления:', orders.validate());

        orders.setEmail('');
        orders.setPhone('');
        console.log('validate() с пустыми email/phone:', orders.validate());

        
        orders.clear();
        console.log('getCustomer() после clear():', orders.getCustomer());
        console.log('validate() после clear():', orders.validate());
        console.groupEnd();

        console.groupEnd();
    } catch (e) {
        console.warn('Ошибка во время тестов моделей (консольные проверки):', e);
    }
});


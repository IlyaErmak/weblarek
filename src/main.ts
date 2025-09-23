import './scss/styles.scss';

import { apiProducts } from './utils/data';
import { API_URL, CDN_URL, categoryMap } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Api } from './components/base/Api';
import { ShopApi } from './components/services/ShopApi';
import { Products } from './components/models/Products';
import { Modal } from './components/ui/Modal';
import { Cart } from './components/models/Cart';
import { IOrderRequest, PaymentMethod } from './types';

let productsModel: Products;
let modal: Modal;
let cart: Cart;

function formatPrice(value: number | null): string {
    return value === null ? 'Бесценно' : `${value} синапсов`;
}

function renderCatalog(): void {
    const gallery = ensureElement<HTMLElement>('.gallery');
    const template = ensureElement<HTMLTemplateElement>('#card-catalog');

    const fragment = document.createDocumentFragment();

    for (const product of apiProducts.items) {
        const card = cloneTemplate<HTMLButtonElement>(template);

        const title = card.querySelector<HTMLElement>('.card__title');
        const price = card.querySelector<HTMLElement>('.card__price');
        const image = card.querySelector<HTMLImageElement>('.card__image');
        const category = card.querySelector<HTMLElement>('.card__category');

        if (title) title.textContent = product.title;
        if (price) price.textContent = formatPrice(product.price);
        if (image) image.src = `${CDN_URL}${product.image}`;
        if (category) {
            category.textContent = product.category;
            const modifier = categoryMap[product.category as keyof typeof categoryMap];
            if (modifier) {
                category.classList.add(modifier);
            }
        }

        card.dataset.id = product.id;

        card.addEventListener('click', () => openPreview(product.id));

        fragment.append(card);
    }

    gallery.innerHTML = '';
    gallery.append(fragment);
}

function openPreview(productId: string) {
    const product = productsModel.getById(productId) || apiProducts.items.find(i => i.id === productId);
    if (!product) return;
    const tpl = ensureElement<HTMLTemplateElement>('#card-preview');
    const view = cloneTemplate<HTMLElement>(tpl);

    const title = view.querySelector<HTMLElement>('.card__title');
    const text = view.querySelector<HTMLElement>('.card__text');
    const price = view.querySelector<HTMLElement>('.card__price');
    const image = view.querySelector<HTMLImageElement>('.card__image');
    const btn = view.querySelector<HTMLButtonElement>('.card__button');
    const category = view.querySelector<HTMLElement>('.card__category');

    if (title) title.textContent = product.title;
    if (text) text.textContent = product.description;
    if (price) price.textContent = formatPrice(product.price);
    if (image) image.src = `${CDN_URL}${product.image}`;
    if (category) category.textContent = product.category;
    if (btn) {
        if (product.price === null) {
            btn.disabled = true;
            btn.textContent = 'Недоступно';
        } else {
            const inCart = cart.hasItem(product.id);
            btn.textContent = inCart ? 'Удалить из корзины' : 'В корзину';
            btn.addEventListener('click', () => {
                if (cart.hasItem(product.id)) {
                    cart.removeItem(product.id);
                } else {
                    cart.addItem(product);
                }
                updateBasketCounter();
                modal.close();
            });
        }
    }

    modal.open(view);
}

function updateBasketCounter() {
    const counter = document.querySelector('.header__basket-counter');
    if (counter) counter.textContent = String(cart.getCount());
}

function openBasket() {
    const tpl = ensureElement<HTMLTemplateElement>('#basket');
    const view = cloneTemplate<HTMLElement>(tpl);
    const list = view.querySelector<HTMLUListElement>('.basket__list');
    const total = view.querySelector<HTMLElement>('.basket__price');
    const btn = view.querySelector<HTMLButtonElement>('.basket__button');

    list!.innerHTML = '';
    const items = cart.getItems();
    if (items.length === 0) {
        const empty = document.createElement('li');
        empty.textContent = 'Корзина пуста';
        list!.append(empty);
        if (btn) btn.disabled = true;
    } else {
        if (btn) btn.disabled = false;
        const itemTpl = ensureElement<HTMLTemplateElement>('#card-basket');
        items.forEach((p, index) => {
            const row = cloneTemplate<HTMLElement>(itemTpl);
            const idx = row.querySelector<HTMLElement>('.basket__item-index');
            const title = row.querySelector<HTMLElement>('.card__title');
            const price = row.querySelector<HTMLElement>('.card__price');
            const del = row.querySelector<HTMLButtonElement>('.basket__item-delete');

            if (idx) idx.textContent = String(index + 1);
            if (title) title.textContent = p.title;
            if (price) price.textContent = formatPrice(p.price);
            if (del) del.addEventListener('click', () => {
                cart.removeItem(p.id);
                updateBasketCounter();
                openBasket();
            });
            list!.append(row);
        });
    }

    if (total) total.textContent = `${cart.getTotal()} синапсов`;
    if (btn) btn.addEventListener('click', () => openOrderStep1());

    modal.open(view);
}

function openOrderStep1() {
    const tpl = ensureElement<HTMLTemplateElement>('#order');
    const view = cloneTemplate<HTMLElement>(tpl);
    const form = view.querySelector<HTMLFormElement>('form[name="order"]');
    const address = view.querySelector<HTMLInputElement>('input[name="address"]');
    const nextBtn = view.querySelector<HTMLButtonElement>('.order__button');
    const errors = view.querySelector<HTMLElement>('.form__errors');
    const payCard = view.querySelector<HTMLButtonElement>('button[name="card"]');
    const payCash = view.querySelector<HTMLButtonElement>('button[name="cash"]');

    let payment: PaymentMethod | '' = '';

    function validate() {
        const addrOk = Boolean(address && address.value.trim().length > 0);
        const payOk = payment !== '';
        const ok = addrOk && payOk;
        if (nextBtn) nextBtn.disabled = !ok;
        if (errors) {
            errors.textContent = '';
            if (!addrOk) errors.textContent = 'Введите адрес доставки';
            if (!payOk) errors.textContent = (errors.textContent ? errors.textContent + '; ' : '') + 'Выберите способ оплаты';
        }
    }

    function selectPayment(method: PaymentMethod) {
        payment = method;
        payCard?.classList.toggle('button_alt', method !== 'card');
        payCash?.classList.toggle('button_alt', method !== 'cash');
        validate();
    }

    payCard?.addEventListener('click', () => selectPayment('card'));
    payCash?.addEventListener('click', () => selectPayment('cash'));
    address?.addEventListener('input', validate);

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (nextBtn && nextBtn.disabled) return;
        openOrderStep2({
            items: cart.getItems().map((p) => p.id),
            payment: payment as PaymentMethod,
            address: address?.value.trim() || '',
            email: '',
            phone: '',
            total: cart.getTotal(),
        });
    });

    nextBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        if (nextBtn.disabled) return;
        openOrderStep2({
            items: cart.getItems().map((p) => p.id),
            payment: payment as PaymentMethod,
            address: address?.value.trim() || '',
            email: '',
            phone: '',
            total: cart.getTotal(),
        });
    });

    validate();
    modal.open(view);
}

function openOrderStep2(orderDraft: IOrderRequest) {
    const tpl = ensureElement<HTMLTemplateElement>('#contacts');
    const view = cloneTemplate<HTMLElement>(tpl);
    const form = view.querySelector<HTMLFormElement>('form[name="contacts"]');
    const email = view.querySelector<HTMLInputElement>('input[name="email"]');
    const phone = view.querySelector<HTMLInputElement>('input[name="phone"]');
    const payBtn = view.querySelector<HTMLButtonElement>('button[type="submit"]');
    const errors = view.querySelector<HTMLElement>('.form__errors');

    function validate() {
        const emailOk = Boolean(email && email.value.trim().length > 0);
        const phoneOk = Boolean(phone && phone.value.trim().length > 0);
        const ok = emailOk && phoneOk;
        if (payBtn) payBtn.disabled = !ok;
        if (errors) {
            errors.textContent = '';
            if (!emailOk) errors.textContent = 'Введите email';
            if (!phoneOk) errors.textContent = (errors.textContent ? errors.textContent + '; ' : '') + 'Введите телефон';
        }
    }

    email?.addEventListener('input', validate);
    phone?.addEventListener('input', validate);

    const submitOrder = async (e: Event) => {
        e.preventDefault();
        if (payBtn && payBtn.disabled) return;
        const api = new Api(API_URL);
        const shopApi = new ShopApi(api);
        try {
            const res = await shopApi.createOrder({
                ...orderDraft,
                email: email?.value.trim() || '',
                phone: phone?.value.trim() || '',
            });
            const st = ensureElement<HTMLTemplateElement>('#success');
            const successView = cloneTemplate<HTMLElement>(st);
            const closeBtn = successView.querySelector<HTMLButtonElement>('.order-success__close');
            const sum = successView.querySelector<HTMLElement>('.order-success__description');
            if (sum) sum.textContent = `Списано ${res.total} синапсов`;
            closeBtn?.addEventListener('click', () => modal.close());
            modal.open(successView);
            cart.clearItems();
            updateBasketCounter();
        } catch (err) {
            if (errors) errors.textContent = String(err);
        }
    };

    form?.addEventListener('submit', submitOrder);
    payBtn?.addEventListener('click', submitOrder);

    validate();
    modal.open(view);
}

document.addEventListener('DOMContentLoaded', async () => {
    const api = new Api(API_URL);
    const shopApi = new ShopApi(api);

    productsModel = new Products();
    modal = new Modal();
    cart = new Cart();

    try {
        const items = await shopApi.getProducts();
        productsModel.setItems(items);
        console.log('Catalog from server:', productsModel.getItems());
    } catch (e) {
        console.error('Failed to fetch products, fallback to local data:', e);
        productsModel.setItems(apiProducts.items);
    }

    renderCatalog();
    updateBasketCounter();

    const basketBtn = document.querySelector<HTMLButtonElement>('.header__basket');
    basketBtn?.addEventListener('click', openBasket);

    try {
        console.group('Тесты моделей данных');

        console.group('Products');
        console.log('Всего товаров в модели:', productsModel.getItems().length);
        const first = productsModel.getItems()[0];
        if (first) {
            console.log('Товар по id через getById:', productsModel.getById(first.id));
        }
        console.groupEnd();

        console.group('Cart');
        if (first) {
            console.log('Добавляем первый товар в корзину');
            cart.addItem(first);
            console.log('Содержимое корзины после addItem:', cart.getItems());
            console.log('Общее количество через getCount():', cart.getCount());
            console.log('Сумма через getTotal():', cart.getTotal());
            console.log('Проверка hasItem():', cart.hasItem(first.id));
            console.log('Удаляем товар из корзины');
            cart.removeItem(first.id);
            console.log('Содержимое корзины после removeItem:', cart.getItems());
            console.log('Сумма после removeItem:', cart.getTotal());
        }
        console.groupEnd();

        console.group('Orders (данные покупателя)');
        console.log('Демо: устанавливаем значения и читаем обратно');
        (function() {
        })();
        console.groupEnd();

        console.groupEnd();
    } catch (e) {
        console.warn('Ошибка во время тестов моделей (консольные проверки):', e);
    }
});


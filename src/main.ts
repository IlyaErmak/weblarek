import './scss/styles.scss';
import { Products } from './components/models/Products';
import { Cart } from './components/models/Cart';
import { Orders } from './components/models/Orders';
import { PaymentMethod } from './types';
import { EventEmitter } from './components/base/Events';
import { AppEvents } from './utils/constants';
import { Api } from './components/base/Api';
import { ShopApi } from './components/services/ShopApi';
import { API_URL } from './utils/constants';
import { CatalogCard, PreviewCard, BasketCard } from './components/ui/Card';
import { Gallery } from './components/ui/Gallery';
import { Header } from './components/ui/Header';
import { BasketView } from './components/ui/Basket';
import { OrderForm, ContactsForm } from './components/ui/Forms';
import { Modal } from './components/ui/Modal';
import { SuccessView } from './components/ui/Success';

document.addEventListener('DOMContentLoaded', () => {
    const events = new EventEmitter();
    const productsModel = new Products(events);
    const cart = new Cart(events);
    const orders = new Orders(events);

    const modal = new Modal('#modal-container');
    const galleryRoot = document.querySelector('main.gallery') as HTMLElement;
    const gallery = new Gallery(galleryRoot);
    const header = new Header(document.querySelector('header.header') as HTMLElement, events);

    const tmplCatalog = document.getElementById('card-catalog') as HTMLTemplateElement;
    const tmplPreview = document.getElementById('card-preview') as HTMLTemplateElement;
    const tmplBasket = document.getElementById('basket') as HTMLTemplateElement;
    const tmplOrder = document.getElementById('order') as HTMLTemplateElement;
    const tmplContacts = document.getElementById('contacts') as HTMLTemplateElement;

    // Обработчики событий моделей
    events.on(AppEvents.CatalogChanged, () => {
        const nodes = productsModel.getItems().map((p) => {
            const card = new CatalogCard(tmplCatalog, events);
            return card.render({ id: p.id, title: p.title, price: p.price, category: p.category, image: p.image });
        });
        gallery.setItems(nodes);
    });

    events.on(AppEvents.CartChanged, () => {
        header.setCount(cart.getCount());
    });

    // Обработчики событий представления
    events.on<{ id: string }>(AppEvents.CardSelected, ({ id }) => {
        const product = productsModel.getById(id);
        if (!product) return;
        const view = new PreviewCard(tmplPreview, events);
        view.setInCart(cart.hasItem(product.id));
        modal.open(view.render({
            id: product.id,
            title: product.title,
            price: product.price,
            category: product.category,
            image: product.image,
            description: product.description
        }));
    });

    events.on<{ id: string }>(AppEvents.BuyClicked, ({ id }) => {
        const product = productsModel.getById(id);
        if (!product) return;
        if (cart.hasItem(id)) {
            cart.removeItem(id);
        } else {
            if (product.price !== null) cart.addItem(product);
        }
        modal.close();
    });

    events.on(AppEvents.BasketOpenClicked, () => {
        const basketView = new BasketView(tmplBasket, events);
        const tmplBasketItem = document.getElementById('card-basket') as HTMLTemplateElement;
        const items = cart.getItems();
        if (items.length === 0) {
            basketView.setEmptyState();
        } else {
            const nodes = items.map((p, index) => {
                const item = new BasketCard(tmplBasketItem, events);
                return item.render({ id: p.id, title: p.title, price: p.price, index: index + 1 });
            });
            basketView.setItemNodes(nodes);
            basketView.setCheckoutEnabled(true);
            basketView.setTotal(cart.getTotal());
        }
        modal.open(basketView.render());
    });

    events.on<{ id: string }>(AppEvents.RemoveFromCartClicked, ({ id }) => {
        cart.removeItem(id);
        const basketView = new BasketView(tmplBasket, events);
        const tmplBasketItem = document.getElementById('card-basket') as HTMLTemplateElement;
        const items = cart.getItems();
        if (items.length === 0) {
            basketView.setEmptyState();
        } else {
            const nodes = items.map((p, index) => {
                const item = new BasketCard(tmplBasketItem, events);
                return item.render({ id: p.id, title: p.title, price: p.price, index: index + 1 });
            });
            basketView.setItemNodes(nodes);
            basketView.setCheckoutEnabled(true);
            basketView.setTotal(cart.getTotal());
        }
        modal.open(basketView.render());
    });

    // Оформление заказа
    events.on(AppEvents.CheckoutClicked, () => {
        const form = new OrderForm(tmplOrder, events);
        modal.open(form.render());
    });

    events.on<{ payment?: PaymentMethod; address?: string }>(AppEvents.FormChanged, (data) => {
        if (data.payment) orders.setPayment(data.payment);
        if (data.address !== undefined) orders.setAddress(data.address);
        const errors = orders.validate();
        const isValid = !errors.payment && !errors.address;
        const form = document.querySelector('form[name="order"]');
        if (form) {
            const view = new OrderForm(tmplOrder, events);
            view.setSubmitEnabled(isValid);
            view.setErrors([errors.payment, errors.address].filter(Boolean).join(' '));
        }
    });

    events.on(AppEvents.OrderNextStepClicked, () => {
        const form = new ContactsForm(tmplContacts, events);
        modal.open(form.render());
    });

    events.on<{ email?: string; phone?: string }>(AppEvents.FormChanged, (data) => {
        if (data.email !== undefined) orders.setEmail(data.email);
        if (data.phone !== undefined) orders.setPhone(data.phone);
        const errors = orders.validate();
        const isValid = !errors.email && !errors.phone && !!orders.getCustomer().payment && !!orders.getCustomer().address;
        const form = document.querySelector('form[name="contacts"]');
        if (form) {
            const view = new ContactsForm(tmplContacts, events);
            view.setSubmitEnabled(isValid);
            view.setErrors([errors.email, errors.phone].filter(Boolean).join(' '));
        }
    });

    events.on(AppEvents.OrderPayClicked, () => {
        const total = cart.getTotal();
        const successTmpl = document.getElementById('success') as HTMLTemplateElement;
        const successView = new SuccessView(successTmpl);
        successView.setTotal(total);
        successView.onClose(() => modal.close());
        modal.open(successView.render());
        cart.clearItems();
        orders.clear();
    });

    // Загрузка каталога через API (fallback: локальные данные)
    const api = new Api(API_URL);
    const shop = new ShopApi(api);
    shop.getProducts()
        .then((items) => productsModel.setItems(items))
        .catch(() => import('./utils/data').then(m => productsModel.setItems(m.apiProducts.items)));
});


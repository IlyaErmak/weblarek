/* Константа для получения полного пути для сервера. Для выполнения запроса 
необходимо к API_URL добавить только ендпоинт. */
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`; 

/* Константа для формирования полного пути к изображениям карточек. 
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

/* Константа соответствий категорий товара модификаторам, используемым для отображения фона категории. */
export const categoryMap = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};

export const settings = {

};

<<<<<<< HEAD
// Глобальные события приложения
export const AppEvents = {
  // Модели
  CatalogChanged: 'catalog:changed',
  CartChanged: 'cart:changed',
  CustomerChanged: 'customer:changed',

  // Представление
  CardSelected: 'card:selected',
  BuyClicked: 'card:buy',
  RemoveFromCartClicked: 'cart:item:remove',
  BasketOpenClicked: 'basket:open',
  CheckoutClicked: 'checkout:open',
  OrderNextStepClicked: 'order:next',
  OrderPayClicked: 'order:pay',
  FormChanged: 'form:changed',
} as const;

export type AppEventName = typeof AppEvents[keyof typeof AppEvents];

=======
>>>>>>> e0c366586eeef8d9d2e41cb1a8457f7b22bd5749

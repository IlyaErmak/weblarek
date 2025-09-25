export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
}

export interface IApiProductsResponse {
    total: number;
    items: IProduct[];
}

export type PaymentMethod = 'card' | 'cash';

export interface IOrderRequest {
    items: string[];
    payment: PaymentMethod;
    email: string;
    phone: string;
    address: string;
    total: number;
}

export interface IOrderResponse {
    id: string;
    total: number;
}

export type IOrder = IOrderRequest;

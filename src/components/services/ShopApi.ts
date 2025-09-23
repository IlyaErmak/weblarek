import { IApi, IApiProductsResponse, IOrderRequest, IOrderResponse, IProduct } from '../../types';

export class ShopApi {
    constructor(private readonly api: IApi) {}

    async getProducts(): Promise<IProduct[]> {
        const data = await this.api.get<IApiProductsResponse>('/product/');
        return data.items;
    }

    createOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', order);
    }
}



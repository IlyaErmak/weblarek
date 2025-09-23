import { IProduct } from '../../types';

export class Products {
    private items: IProduct[] = [];

    setItems(items: IProduct[]): void {
        this.items = items;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getById(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }
}
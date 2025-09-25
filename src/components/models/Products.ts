import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/constants';

export class Products {
    private items: IProduct[] = [];
    constructor(private readonly events?: IEvents) {}

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events?.emit(AppEvents.CatalogChanged);
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getById(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }
}
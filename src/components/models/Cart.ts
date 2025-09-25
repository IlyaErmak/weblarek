import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/constants';

export class Cart {
  private items: IProduct[] = [];
  constructor(private readonly events?: IEvents) {}

  addItem(item: IProduct) {
    if (!this.items.find((i) => i.id === item.id)) {
      this.items.push(item);
      this.events?.emit(AppEvents.CartChanged);
    }
  }

  removeItem(id: string) {
    this.items = this.items.filter((i) => i.id !== id);
    this.events?.emit(AppEvents.CartChanged);
  }

  hasItem(id: string): boolean {
    return this.items.some((i) => i.id === id);
  }

  getCount(): number {
    return this.items.length;
  }

  getTotal(): number {
    return this.items.reduce((sum, p) => sum + (p.price ?? 0), 0);
  }

  getItems(): IProduct[] {
    return this.items;
  }

  clearItems() {
    this.items = [];
    this.events?.emit(AppEvents.CartChanged);
  }
}



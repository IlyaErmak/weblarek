import { IProduct } from '../../types';

export class Cart {
  private items: IProduct[] = [];

  addItem(item: IProduct) {
    if (!this.items.find((i) => i.id === item.id)) {
      this.items.push(item);
    }
  }

  removeItem(id: string) {
    this.items = this.items.filter((i) => i.id !== id);
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
  }
}



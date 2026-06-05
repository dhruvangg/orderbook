export type Unit = 'kg' | 'g' | 'ltr' | 'ml' | 'pcs' | 'pack' | 'dozen';

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  unit: Unit;
}

export interface PricedItem extends OrderItem {
  price: number;
}

export interface OrderPayload {
  customerPhone: string;
  items: {
    name: string;
    qty: number;
    unit: string;
  }[];
}

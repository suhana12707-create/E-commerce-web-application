export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  badge: string | null;
  is_featured: boolean;
  in_stock: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'confirmed' | 'packing' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  shipping_address: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export type ProductType = 'All'| 'Books' | 'Electronics' | 'Clothing';

export type Product = {
  id: number;
  name: string;
  type: ProductType;
  price: number;
};

export type Products = Product[];

export type ProductId = Product['id'];
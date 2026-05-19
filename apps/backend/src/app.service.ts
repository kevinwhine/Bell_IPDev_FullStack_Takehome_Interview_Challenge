import { NotFoundException, ConflictException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import productsJson from './data/products.json';
import type { ProductId, Products } from './types/product.tyes';


@Injectable()
export class AppService {
  // All PRoducts available in the store.
  private products: Products = productsJson as Products;
  // The user's wishlist items unique identifiers.
  private readonly wishlist = new Set<ProductId>();

  getProducts(): Products {
    return this.products;
  }


  getProductsInWishlist(): Products {
    return this.products.filter(p => this.wishlist.has(p.id));
  }


  getStoreName(): { name: string } {
    return { name: 'The Tech Library' };
  }


  addToWishlist(productId: ProductId): void {

    const exists = this.products.some(p => p.id === productId);
    if (!exists) {
      throw new NotFoundException('Product not found');
    }
    if (this.wishlist.has(productId)) {
      throw new ConflictException('Product already in wishlist');
    }
    this.wishlist.add(productId);
  }


  removeFromWishlist(productId: ProductId): void {
    if (!this.wishlist.has(productId)) {
      throw new NotFoundException('Product not in wishlist');
    }
    this.wishlist.delete(productId);
  }
}

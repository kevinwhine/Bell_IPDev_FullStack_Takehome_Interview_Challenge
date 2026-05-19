import { Controller, Get, Post, Delete, Param, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
import { type ProductId } from './types/product.tyes';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('store-name')
  getStoreName(): { name: string } {
    return this.appService.getStoreName();
  }


@Get('products')
  getProducts() {
    return this.appService.getProducts();
  }

  @Get('wishlist')
  getWishlist() {
    return this.appService.getProductsInWishlist();
  }

  @Post('wishlist/:id')
  addToWishlist(@Param('id') id: string) {

    const productId: ProductId = parseInt(id, 10) as ProductId;
    if (isNaN(productId)) {
      throw new BadRequestException('Invalid product ID');
    }
    this.appService.addToWishlist(productId);
    return { success: true };
  }

  @Delete('wishlist/:id')
  removeFromWishlist(@Param('id') id: string) {

    const productId: ProductId = parseInt(id, 10) as ProductId;
    if (isNaN(productId)) {
      throw new BadRequestException('Invalid product ID');
    }
    this.appService.removeFromWishlist(productId);
    return { success: true };
  }
}

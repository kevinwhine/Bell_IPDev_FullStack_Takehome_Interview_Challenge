import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { describe, it, expect, beforeEach } from 'vitest';
import { BadRequestException } from '@nestjs/common';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService

  beforeEach(async () => {
  const mockService = {
    getStoreName: vi.fn().mockReturnValue({ name: 'The Tech Library' }),
    getProducts: vi.fn().mockReturnValue([
      { id: 1, name: 'Book A', type: 'Books', price: 10 },
    ]),
    getProductsInWishlist: vi.fn().mockReturnValue([1]),
    addToWishlist: vi.fn(),
  };
  
  
  const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{
        provide: AppService,
        useValue: mockService
      }],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('getStoreName', () => {
    it('should return the store name', () => {
      const result = controller.getStoreName();
      expect(result).toEqual({ name: 'The Tech Library' });
    });
  });


  describe('getProducts', () => {
    it('should return the product list', () => {
      const result = controller.getProducts();
      expect(result).toEqual([
        { id: 1, name: 'Book A', type: 'Books', price: 10 },
      ]);
      expect(service.getProducts).toHaveBeenCalled();
    });
  });


  describe('getWishlist', () => {
    it('should return wishlist items', () => {
      const result = controller.getWishlist();
      expect(result).toEqual([1]);
      expect(service.getProductsInWishlist).toHaveBeenCalled();
    });
  });


  describe('addToWishlist', () => {
    it('should add a valid product ID to the wishlist', () => {
      const result = controller.addToWishlist('1');
      expect(service.addToWishlist).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true });
    });

    it('should throw BadRequestException for invalid ID', () => {
      expect(() => controller.addToWishlist('abc')).toThrow(BadRequestException);
    });
  });
});

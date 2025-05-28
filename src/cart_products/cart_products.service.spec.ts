import { Test, TestingModule } from '@nestjs/testing';
import { CartProductsService } from './cart_products.service';

describe('CartProductsService', () => {
  let service: CartProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartProductsService],
    }).compile();

    service = module.get<CartProductsService>(CartProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

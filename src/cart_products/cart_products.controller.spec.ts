/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CartProductsController } from './cart_products.controller';
import { CartProductsService } from './cart_products.service';
import { CreateCartProductDto } from './dto/create-cart_product.dto';
import { UpdateCartProductDto } from './dto/update-cart_product.dto';

describe('CartProductsController', () => {
  let controller: CartProductsController;
  let service: CartProductsService;

  const mockCartProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartProductsController],
      providers: [
        {
          provide: CartProductsService,
          useValue: mockCartProductsService,
        },
      ],
    }).compile();

    controller = module.get<CartProductsController>(CartProductsController);
    service = module.get<CartProductsService>(CartProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call service.create with correct dto', async () => {
      const dto: CreateCartProductDto = {
        cartId: 1,
        productId: 10,
        quantity: 2,
      };
      const created = { id: 1, ...dto };

      mockCartProductsService.create.mockResolvedValue(created);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('should return all cart products', async () => {
      const items = [
        { id: 1, productId: 1, quantity: 2 },
        { id: 2, productId: 3, quantity: 1 },
      ];
      mockCartProductsService.findAll.mockResolvedValue(items);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(items);
    });
  });

  describe('findOne', () => {
    it('should return one cart product by id', async () => {
      const item = { id: 1, productId: 1, quantity: 2 };
      mockCartProductsService.findOne.mockResolvedValue(item);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(item);
    });
  });

  describe('update', () => {
    it('should update a cart product by id', async () => {
      const dto: UpdateCartProductDto = { quantity: 5 };
      const updated = { id: 1, productId: 1, quantity: 5 };

      mockCartProductsService.update.mockResolvedValue(updated);

      const result = await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove a cart product by id', async () => {
      const deleted = { message: 'Item deleted' };
      mockCartProductsService.remove.mockResolvedValue(deleted);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleted);
    });
  });
});

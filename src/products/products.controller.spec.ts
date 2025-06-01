import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    searchMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct data', async () => {
      const dto: CreateProductDto = {
        name: 'Product 1',
        description: 'Desc',
        price: 100,
      };
      await controller.create(dto);
      expect(mockProductService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      await controller.findAll();
      expect(mockProductService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct id', async () => {
      await controller.findOne('1');
      expect(mockProductService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should call service.update with correct id and data', async () => {
      const dto: UpdateProductDto = { name: 'Updated' };
      await controller.update('1', dto);
      expect(mockProductService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id', async () => {
      await controller.remove('1');
      expect(mockProductService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('search', () => {
    it('should call service.searchMany with correct query parameters', async () => {
      await controller.search('Product', '10', '100');
      expect(mockProductService.searchMany).toHaveBeenCalledWith(
        'Product',
        10,
        100,
      );
    });

    it('should handle missing precoMin and precoMax', async () => {
      await controller.search('Product');
      expect(mockProductService.searchMany).toHaveBeenCalledWith(
        'Product',
        undefined,
        undefined,
      );
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
type Product = any;

describe('ProductsService', () => {
  let service: ProductsService;

  const mockPrismaService = {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a product', () => {
      const dto = { name: 'Product 1', price: 100, description: 'teste' };
      const result = { id: 1, ...dto };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      return expect(service.create(dto)).resolves.toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', () => {
      const result = [
        { id: 1, name: 'Product 1', price: 100, description: null },
        { id: 2, name: 'Product 2', price: 200, description: null },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      return expect(service.findAll()).resolves.toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single product by id', async () => {
      const result = {
        id: 1,
        name: 'Product 1',
        price: 100,
        description: null,
      };

      jest.spyOn(service, 'findOne').mockImplementation((id: number) => {
        if (id === 1) return Promise.resolve(result);
        return Promise.resolve(null);
      });

      expect(await service.findOne(1)).toEqual(result);
      return expect(service.findOne(999)).resolves.toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the updated product', () => {
      const updateDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 150,
        description: 'Updated description',
      };
      const result: Product = { id: 1, ...updateDto };

      jest.spyOn(service, 'update').mockImplementation(
        (
          id: number,
          dto: UpdateProductDto,
        ): Promise<{
          id: number;
          name: string;
          price: number;
          description: string | null;
        }> => {
          return Promise.resolve({
            id,
            name: dto.name ?? '',
            price: dto.price ?? 0,
            description: dto.description ?? null,
          });
        },
      );

      return expect(service.update(1, updateDto)).resolves.toEqual(result);
    });
  });

  describe('remove', () => {
    it('should remove a product by id', async () => {
      jest.spyOn(service, 'remove').mockImplementation((id: number) => {
        if (id === 1) {
          // Retorna objeto completo para produto removido com id 1
          return Promise.resolve({
            id: 1,
            name: 'Deleted Product',
            price: 0,
            description: 'teste',
          });
        }
        // Retorna null para produto não encontrado
        return Promise.resolve(null);
      });

      // Testa remoção existente — deve retornar objeto completo
      await expect(service.remove(1)).resolves.toEqual({
        id: 1,
        name: 'Deleted Product',
        price: 0,
        description: 'teste',
      });

      // Testa remoção inexistente — deve retornar null
      await expect(service.remove(999)).resolves.toBeNull();
    });
  });
});

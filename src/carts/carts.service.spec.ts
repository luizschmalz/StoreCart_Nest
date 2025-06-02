/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './carts.service';
import { PrismaService } from 'src/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let prisma: PrismaService;

  const mockPrisma = {
    cart: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    cartProduct: {
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a cart', async () => {
      const dto = { userId: 1 };
      const result = { id: 1, userId: 1 };

      mockPrisma.cart.create.mockResolvedValue(result);

      expect(await service.create(dto)).toEqual(result);
      expect(prisma.cart.create).toHaveBeenCalledWith({
        data: { userId: dto.userId },
      });
    });
  });

  describe('findAll', () => {
    it('should return all carts with products and product info', async () => {
      const result = [{ id: 1, userId: 1, products: [] }];

      mockPrisma.cart.findMany.mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
      expect(prisma.cart.findMany).toHaveBeenCalledWith({
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return one cart by id including products and product info', async () => {
      const result = { id: 1, userId: 1, products: [] };

      mockPrisma.cart.findUnique.mockResolvedValue(result);

      expect(await service.findOne(1)).toEqual(result);
      expect(prisma.cart.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });
    });
  });

  describe('update', () => {
    it('should calculate total and return success message when concluded', async () => {
      mockPrisma.cart.update.mockResolvedValue({});
      mockPrisma.cart.findUnique.mockResolvedValue({
        id: 1,
        products: [
          { quantity: 2, product: { price: 10 } },
          { quantity: 1, product: { price: 5.5 } },
        ],
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await service.update(1, { status: 'concluido' });

      expect(result).toEqual({
        message: 'Compra concluída com sucesso!',
        total: 25.5,
        cartId: 1,
      });
      expect(prisma.cart.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundException if cart not found on concluido', async () => {
      mockPrisma.cart.update.mockResolvedValue({});
      mockPrisma.cart.findUnique.mockResolvedValue(null);

      await expect(service.update(1, { status: 'concluido' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete cart products and then the cart', async () => {
      const result = { id: 1, userId: 1 };

      mockPrisma.cartProduct.deleteMany.mockResolvedValue({});
      mockPrisma.cart.delete.mockResolvedValue(result);

      expect(await service.remove(1)).toEqual(result);
      expect(prisma.cartProduct.deleteMany).toHaveBeenCalledWith({
        where: { cartId: 1 },
      });
      expect(prisma.cart.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});

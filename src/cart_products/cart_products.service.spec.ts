/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { CartProductsService } from './cart_products.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

describe('CartProductsService', () => {
  let service: CartProductsService;

  let mockPrisma: any;

  beforeEach(async () => {
    mockPrisma = {
      cart: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
      cartProduct: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    } as unknown as PrismaService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartProductsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CartProductsService>(CartProductsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a cart product if cart is not concluded', async () => {
      const dto = { cartId: 1, productId: 2, quantity: 3 };
      const cartProduct = { id: 1, ...dto };

      mockPrisma.cart.findUnique.mockResolvedValue({ status: 'pendente' });
      mockPrisma.cartProduct.create.mockResolvedValue(cartProduct);

      const result = await service.create(dto);
      expect(result).toEqual(cartProduct);
    });

    it('should throw ForbiddenException if cart is concluded', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ status: 'concluido' });

      await expect(
        service.create({ cartId: 1, productId: 2, quantity: 3 }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('should return all cart products', async () => {
      const list = [{ id: 1 }, { id: 2 }] as any;
      mockPrisma.cartProduct.findMany.mockResolvedValue(list);

      const result = await service.findAll();
      expect(result).toEqual(list);
    });
  });

  describe('findOne', () => {
    it('should return a cart product by id', async () => {
      const cartProduct = { id: 1 } as any;
      mockPrisma.cartProduct.findUnique.mockResolvedValue(cartProduct);

      const result = await service.findOne(1);
      expect(result).toEqual(cartProduct);
    });
  });

  describe('update', () => {
    it('should update the cart product if cart is not concluded', async () => {
      const id = 1;
      const dto = { quantity: 5 };
      const updated = { id, quantity: 5 };

      mockPrisma.cartProduct.findUnique.mockResolvedValue({ cartId: 10 });
      mockPrisma.cart.findUnique.mockResolvedValue({ status: 'aberto' });
      mockPrisma.cartProduct.update.mockResolvedValue(updated);

      const result = await service.update(id, dto);
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException if cart product does not exist', async () => {
      mockPrisma.cartProduct.findUnique.mockResolvedValue(null);

      await expect(service.update(1, { quantity: 3 })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if cart is concluded', async () => {
      mockPrisma.cartProduct.findUnique.mockResolvedValue({ cartId: 10 });
      mockPrisma.cart.findUnique.mockResolvedValue({ status: 'concluido' });

      await expect(service.update(1, { quantity: 3 })).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('remove', () => {
    it('should delete the cart product if cart is not concluded', async () => {
      const id = 1;
      const deleted = { id };

      mockPrisma.cartProduct.findUnique.mockResolvedValue({ cartId: 10 });
      mockPrisma.cart.findUnique.mockResolvedValue({ status: 'aberto' });
      mockPrisma.cartProduct.delete.mockResolvedValue(deleted);

      const result = await service.remove(id);
      expect(result).toEqual(deleted);
    });

    it('should throw NotFoundException if cart product does not exist', async () => {
      mockPrisma.cartProduct.findUnique.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if cart is concluded', async () => {
      mockPrisma.cartProduct.findUnique.mockResolvedValue({ cartId: 10 });
      mockPrisma.cart.findUnique.mockResolvedValue({ status: 'concluido' });

      await expect(service.remove(1)).rejects.toThrow(ForbiddenException);
    });
  });
});

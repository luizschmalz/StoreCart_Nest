import { Test, TestingModule } from '@nestjs/testing';
import { CartsController } from './carts.controller';
import { CartService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
type Cart = {
  id: number;
  userId: number;
  products?: {
    quantity: number;
    product: {
      name: string;
      price: number;
    };
  }[];
};

describe('CartsController', () => {
  let controller: CartsController;

  const mockCartService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    }).compile();

    controller = module.get<CartsController>(CartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a cart with given userId', async () => {
      const dto: CreateCartDto = { userId: 10 };
      const result = { id: 1, userId: 10 };

      mockCartService.create.mockResolvedValue(result);

      const response = (await controller.create(dto)) as Cart;
      expect(response).toEqual(result);
      expect(mockCartService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all carts with products and product info', async () => {
      const result = [
        {
          id: 1,
          userId: 10,
          products: [{ quantity: 2, product: { name: 'Item A', price: 15 } }],
        },
      ];
      mockCartService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockCartService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one cart by id including products and product info', async () => {
      const result = {
        id: 2,
        userId: 99,
        products: [],
      };

      mockCartService.findOne.mockResolvedValue(result);

      const response = (await controller.findOne('2')) as Cart;
      expect(response).toEqual(result);
      expect(mockCartService.findOne).toHaveBeenCalledWith(2);
    });
  });

  describe('update', () => {
    it('should update cart status and return total if status is concluido', async () => {
      const dto: UpdateCartDto = { status: 'concluido' };
      const result = {
        message: 'Compra concluída com sucesso!',
        total: 30.5,
        cartId: 1,
      };

      mockCartService.update.mockResolvedValue(result);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const response = await controller.update('1', dto);
      expect(response).toEqual(result);
      expect(mockCartService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should delete the cart and return it', async () => {
      const deletedCart = { id: 1, userId: 10 };
      mockCartService.remove.mockResolvedValue(deletedCart);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const response = await controller.remove('1');
      expect(response).toEqual(deletedCart);
      expect(mockCartService.remove).toHaveBeenCalledWith(1);
    });
  });
});

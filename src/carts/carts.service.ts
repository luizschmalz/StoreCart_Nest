import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
type Cart = any;
import { UpdateCartDto } from './dto/update-cart.dto';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCartDto): Promise<Cart> {
    return this.prisma.cart.create({
      data: {
        userId: dto.userId,
      },
    });
  }

  async findAll(): Promise<Cart[]> {
    return this.prisma.cart.findMany({
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<Cart> {
    return this.prisma.cart.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async update(id: number, updateCartDto: UpdateCartDto): Promise<any> {
    // Atualiza apenas o status, se fornecido
    if (updateCartDto.status) {
      await this.prisma.cart.update({
        where: { id },
        data: { status: updateCartDto.status },
      });

      // Se o status for concluído, calcula o total e retorna
      if (updateCartDto.status === 'concluido') {
        const cart = await this.prisma.cart.findUnique({
          where: { id },
          include: {
            products: {
              include: {
                product: true,
              },
            },
          },
        });

        if (!cart) {
          throw new NotFoundException(`Carrinho com id ${id} não encontrado`);
        }

        const total = cart.products.reduce(
          (
            acc: number,
            item: { quantity: number; product: { price: number } },
          ) => {
            return parseFloat(
              (acc + item.quantity * item.product.price).toFixed(2),
            );
          },
          0,
        );

        return {
          message: 'Compra concluída com sucesso!',
          total,
          cartId: cart.id,
        };
      }
    }

    // Caso só tenha atualizado o status (sem ser concluído)
    return { message: 'Status do carrinho atualizado com sucesso.' };
  }

  async remove(id: number): Promise<Cart> {
    await this.prisma.cartProduct.deleteMany({
      where: { cartId: id },
    });

    return this.prisma.cart.delete({
      where: { id },
    });
  }
}

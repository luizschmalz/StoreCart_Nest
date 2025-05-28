import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Cart } from '@prisma/client';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Cria um carrinho vazio
  async create(): Promise<Cart> {
    return this.prisma.cart.create({
      data: {}, // sem produtos inicialmente
    });
  }

  // Busca todos os carrinhos, incluindo produtos e quantidade
  async findAll(): Promise<Cart[]> {
    return this.prisma.cart.findMany({
      include: {
        products: {
          include: {
            product: true, // dados do produto dentro do CartProduct
          },
        },
      },
    });
  }

  // Busca um carrinho pelo id, incluindo produtos
  async findOne(id: number): Promise<Cart | null> {
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

        const total = cart.products.reduce((acc, item) => {
          return acc + item.quantity * item.product.price;
        }, 0);

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

  // Remove carrinho e seus produtos relacionados em cascata
  async remove(id: number): Promise<Cart> {
    // Primeiro remove os produtos do carrinho
    await this.prisma.cartProduct.deleteMany({
      where: { cartId: id },
    });

    // Depois remove o carrinho
    return this.prisma.cart.delete({
      where: { id },
    });
  }
}

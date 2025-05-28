import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CartProduct } from '@prisma/client';
import { CreateCartProductDto } from './dto/create-cart_product.dto';
import { UpdateCartProductDto } from './dto/update-cart_product.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@Injectable()
export class CartProductsService {
  constructor(private prisma: PrismaService) {}

  private async isCartConcluded(cartId: number): Promise<boolean> {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      select: { status: true },
    });

    return cart?.status === 'concluido';
  }

  async create(
    createCartProductDto: CreateCartProductDto,
  ): Promise<CartProduct> {
    const isConcluded = await this.isCartConcluded(createCartProductDto.cartId);

    if (isConcluded) {
      throw new ForbiddenException(
        'Não é possível criar produtos em um carrinho concluído',
      );
    }

    return this.prisma.cartProduct.create({
      data: createCartProductDto,
    });
  }

  async findAll(): Promise<CartProduct[]> {
    return this.prisma.cartProduct.findMany();
  }

  async findOne(id: number): Promise<CartProduct | null> {
    return this.prisma.cartProduct.findUnique({
      where: { id },
    });
  }

  async update(
    id: number,
    updateCartProductDto: UpdateCartProductDto,
  ): Promise<CartProduct> {
    const cartProduct = await this.prisma.cartProduct.findUnique({
      where: { id },
      select: { cartId: true },
    });

    if (!cartProduct) {
      throw new NotFoundException('CartProduct not found');
    }

    const isConcluded = await this.isCartConcluded(cartProduct.cartId);

    if (isConcluded) {
      throw new ForbiddenException(
        'Não é possível alterar produtos em um carrinho concluído',
      );
    }
    const { quantity } = updateCartProductDto;

    return this.prisma.cartProduct.update({
      where: { id },
      data: {
        ...(quantity !== undefined && { quantity }),
      },
    });
  }

  async remove(id: number): Promise<CartProduct> {
    const cartProduct = await this.prisma.cartProduct.findUnique({
      where: { id },
      select: { cartId: true },
    });

    if (!cartProduct) {
      throw new NotFoundException('CartProduct not found');
    }

    const isConcluded = await this.isCartConcluded(cartProduct.cartId);

    if (isConcluded) {
      throw new ForbiddenException(
        'Não é possível excluir produtos em um carrinho concluído',
      );
    }

    return this.prisma.cartProduct.delete({
      where: { id },
    });
  }
}

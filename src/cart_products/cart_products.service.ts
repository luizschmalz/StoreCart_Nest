import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CartProduct } from '@prisma/client';
import { CreateCartProductDto } from './dto/create-cart_product.dto';
import { UpdateCartProductDto } from './dto/update-cart_product.dto';

@Injectable()
export class CartProductsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCartProductDto: CreateCartProductDto,
  ): Promise<CartProduct> {
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
    return this.prisma.cartProduct.update({
      where: { id },
      data: updateCartProductDto,
    });
  }

  async remove(id: number): Promise<CartProduct> {
    return this.prisma.cartProduct.delete({
      where: { id },
    });
  }
}

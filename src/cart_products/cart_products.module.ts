import { Module } from '@nestjs/common';
import { CartProductsService } from './cart_products.service';
import { CartProductsController } from './cart_products.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CartProductsController],
  providers: [CartProductsService, PrismaService],
})
export class CartProductsModule {}

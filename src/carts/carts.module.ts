import { Module } from '@nestjs/common';
import { CartService } from './carts.service';
import { CartsController } from './carts.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CartsController],
  providers: [CartService, PrismaService],
})
export class CartsModule {}

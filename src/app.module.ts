import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { CartsModule } from './carts/carts.module';
import { CartProductsModule } from './cart_products/cart_products.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProductsModule,
    CartsModule,
    CartProductsModule,
  ],
})
export class AppModule {}

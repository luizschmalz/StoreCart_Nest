import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { CartsModule } from './carts/carts.module';
import { CartProductsModule } from './cart_products/cart_products.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProductsModule,
    CartsModule,
    CartProductsModule,
    AuthModule,
  ],
})
export class AppModule {}

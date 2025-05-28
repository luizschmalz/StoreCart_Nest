import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartProductsService } from './cart_products.service';
import { CreateCartProductDto } from './dto/create-cart_product.dto';
import { UpdateCartProductDto } from './dto/update-cart_product.dto';

@Controller('cart-products')
export class CartProductsController {
  constructor(private readonly cartProductsService: CartProductsService) {}

  @Post()
  create(@Body() createCartProductDto: CreateCartProductDto) {
    return this.cartProductsService.create(createCartProductDto);
  }

  @Get()
  findAll() {
    return this.cartProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartProductsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCartProductDto: UpdateCartProductDto,
  ) {
    return this.cartProductsService.update(+id, updateCartProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.cartProductsService.remove(+id);
  }
}

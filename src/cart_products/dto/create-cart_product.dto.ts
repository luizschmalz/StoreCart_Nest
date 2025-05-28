import { IsInt, IsPositive } from 'class-validator';

export class CreateCartProductDto {
  @IsInt()
  cartId!: number;

  @IsInt()
  productId!: number;

  @IsInt()
  @IsPositive()
  quantity!: number;
}

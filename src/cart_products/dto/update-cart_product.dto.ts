import { IsInt, IsPositive, IsOptional } from 'class-validator';

export class UpdateCartProductDto {
  @IsOptional()
  @IsInt()
  cartId?: number;

  @IsOptional()
  @IsInt()
  productId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity?: number;
}

import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartProductDto {
  @ApiProperty({
    description: 'ID do carrinho',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  cartId!: number;

  @ApiProperty({
    description: 'ID do produto',
    example: 10,
  })
  @IsInt()
  @IsPositive()
  productId!: number;

  @ApiProperty({
    description: 'Quantidade do produto',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  quantity!: number;
}

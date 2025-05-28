import { IsInt, IsPositive, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCartProductDto {
  @ApiPropertyOptional({
    description: 'Quantidade do produto',
    example: 3,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity?: number;
}

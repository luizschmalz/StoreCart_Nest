import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateCartDto {
  @ApiPropertyOptional({
    description: 'Status do carrinho',
    example: 'concluido',
  })
  @IsOptional()
  status?: string;
}

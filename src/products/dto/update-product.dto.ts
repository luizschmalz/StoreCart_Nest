import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Nome do produto',
    example: 'Camisa Polo',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Descrição do produto',
    example: 'Camisa polo masculina tamanho M',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Preço do produto',
    example: 59.9,
  })
  @IsNumber()
  @IsOptional()
  price?: number;
}

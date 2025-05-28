import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Camisa Polo',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    description: 'Descrição do produto',
    example: 'Camisa polo masculina tamanho M',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Preço do produto',
    example: 59.9,
  })
  @IsNumber()
  price!: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({ example: 1, description: 'ID do usuário dono do carrinho' })
  @IsInt()
  userId!: number;
}

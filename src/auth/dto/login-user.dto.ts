import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'fulaninhodasilva' })
  @IsString()
  login!: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  password!: string;
}

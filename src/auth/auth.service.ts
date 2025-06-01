import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        password: hashedPassword,
      },
    });
    return { id: user.id, login: user.login };
  }

  async login(dto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { login: dto.login },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('login ou senha inválidos');
    }

    const payload = { sub: user.id, login: user.login };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  async findAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        createdAt: true,
      },
    });
  }

  async findUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        login: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;
  }
}

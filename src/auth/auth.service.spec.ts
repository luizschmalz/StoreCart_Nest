/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should hash password and create a new user', async () => {
      const dto = { login: 'user1', password: '123456' };
      const hashedPassword = 'hashed_password';
      jest
        .spyOn(bcrypt, 'hash')
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .mockImplementation(() => Promise.resolve('hashed_password'));
      mockPrismaService.user.create.mockResolvedValue({
        id: 1,
        login: dto.login,
        password: hashedPassword,
      });

      const result = await service.register(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { login: dto.login, password: hashedPassword },
      });
      expect(result).toEqual({ id: 1, login: dto.login });
    });
  });

  describe('login', () => {
    it('should return access_token if login succeeds', async () => {
      const dto = { login: 'user1', password: '123456' };
      const user = { id: 1, login: 'user1', password: 'hashed_password' };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      jest
        .spyOn(bcrypt, 'compare')
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .mockImplementation(() => Promise.resolve(true));
      mockJwtService.sign.mockReturnValue('jwt_token');

      const result = await service.login(dto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { login: dto.login },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, user.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        login: user.login,
      });
      expect(result).toEqual({ access_token: 'jwt_token' });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ login: 'user1', password: '123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const user = { id: 1, login: 'user1', password: 'hashed_password' };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      jest
        .spyOn(bcrypt, 'compare')
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .mockImplementation(() => Promise.resolve(false));

      await expect(
        service.login({ login: 'user1', password: 'wrongpass' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findAllUsers', () => {
    it('should return all users with selected fields', async () => {
      const users = [
        { id: 1, login: 'user1', createdAt: new Date() },
        { id: 2, login: 'user2', createdAt: new Date() },
      ];
      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await service.findAllUsers();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: { id: true, login: true, createdAt: true },
      });
      expect(result).toEqual(users);
    });
  });

  describe('findUserById', () => {
    it('should return user if found', async () => {
      const user = { id: 1, login: 'user1', createdAt: new Date() };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.findUserById(1);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { id: true, login: true, createdAt: true },
      });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findUserById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    findAllUsers: jest.fn(),
    findUserById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      // Simula o comportamento do AuthGuard
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: () => true,
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const dto: CreateUserDto = {
        login: 'test@example.com',
        password: '123456',
      };
      const result = { id: 1, ...dto };

      mockAuthService.register.mockResolvedValue(result);

      expect(await controller.register(dto)).toEqual(result);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should login a user and return token', async () => {
      const dto: LoginUserDto = {
        login: 'test@example.com',
        password: '123456',
      };
      const result = { access_token: 'jwt-token' };

      mockAuthService.login.mockResolvedValue(result);

      expect(await controller.login(dto)).toEqual(result);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const result = [
        { id: 1, login: 'User 1', createdAt: new Date() },
        { id: 2, login: 'User 2', createdAt: new Date() },
      ];

      mockAuthService.findAllUsers.mockResolvedValue(result);

      expect(await controller.findAllUsers()).toEqual(result);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findAllUsers).toHaveBeenCalled();
    });
  });

  describe('findUserById', () => {
    it('should return user by id', async () => {
      const result = { id: 1, login: 'User 1', createdAt: new Date() };

      mockAuthService.findUserById.mockResolvedValue(result);

      expect(await controller.findUserById('1')).toEqual(result);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findUserById).toHaveBeenCalledWith(1);
    });
  });
});

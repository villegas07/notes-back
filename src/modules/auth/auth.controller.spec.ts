import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from '../../common/dto/sign-up.dto';
import { SignInDto } from '../../common/dto/sign-in.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sign up', () => {
    it('should return access token', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const response = { accessToken: 'jwt_token' };
      mockAuthService.signUp.mockResolvedValue(response);

      const result = await controller.signUp(signUpDto);

      expect(result).toEqual(response);
      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
    });
  });

  describe('sign in', () => {
    it('should return access token', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = { accessToken: 'jwt_token' };
      mockAuthService.signIn.mockResolvedValue(response);

      const result = await controller.signIn(signInDto);

      expect(result).toEqual(response);
      expect(authService.signIn).toHaveBeenCalledWith(signInDto);
    });
  });
});

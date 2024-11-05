import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/users.model';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { EntityAlreadyExistsException } from '../exceptions/domain-exceptions';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword123',
  };

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    const signUpDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should successfully create a new user', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.signUp(signUpDto);

      expect(result).toEqual({ message: 'User successfully registered' });
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ 
        email: signUpDto.email 
      });
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw EntityAlreadyExistsException if user exists', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        EntityAlreadyExistsException,
      );
    });
  });

  describe('signIn', () => {
    const signInDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully sign in and return tokens', async () => {
      const tokens = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      mockJwtService.signAsync.mockResolvedValueOnce(tokens.accessToken);
      mockJwtService.signAsync.mockResolvedValueOnce(tokens.refreshToken);

      const result = await service.signIn(signInDto);

      expect(result).toEqual(tokens);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ 
        email: signInDto.email 
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshTokens', () => {
    const refreshToken = 'validRefreshToken';
    const payload = {
      id: '1',
      email: 'test@example.com',
      type: 'refresh',
    };

    it('should successfully refresh tokens', async () => {
      const newTokens = {
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      };

      mockJwtService.verifyAsync.mockResolvedValue(payload);
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValueOnce(newTokens.accessToken);
      mockJwtService.signAsync.mockResolvedValueOnce(newTokens.refreshToken);

      const result = await service.refreshTokens(refreshToken);

      expect(result).toEqual(newTokens);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refreshToken);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: payload.id });
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error());

      await expect(service.refreshTokens(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockJwtService.verifyAsync.mockResolvedValue(payload);
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.refreshTokens(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token type is not refresh', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ ...payload, type: 'access' });

      await expect(service.refreshTokens(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
}); 
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/users.model';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { EntityAlreadyExistsException } from '../exceptions/domain-exceptions';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findOneBy({ 
      email: signUpDto.email 
    });
    
    if (existingUser) {
      throw new EntityAlreadyExistsException('User', 'email', signUpDto.email);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(signUpDto.password, salt);
    
    const user = this.userRepository.create({
      ...signUpDto,
      password: hashedPassword,
    });
    
    await this.userRepository.save(user);
    
    return { message: 'User successfully registered' };
  }

  async signIn(signInDto: SignInDto): Promise<{ 
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.userRepository.findOneBy({ email: signInDto.email });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(signInDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);
    
    return tokens;
  }

  private async generateTokens(user: User) {
    const payload = { id: user.id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...payload, type: 'access' },
        {
          expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION'),
        },
      ),
      this.jwtService.signAsync(
        { ...payload, type: 'refresh' },
        {
          expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const payload =
        await this.jwtService.verifyAsync<IJwtPayload>(refreshToken);

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.userRepository.findOneBy({ id: payload.id });
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
} 
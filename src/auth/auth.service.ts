import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly validCredentials = {
    username: 'admin',
    password: 'password123',
  };

  constructor(private readonly jwtService: JwtService) {}

  async login(username: string, password: string) {
    if (
      username !== this.validCredentials.username ||
      password !== this.validCredentials.password
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      username,
      loginTime: new Date().toISOString(),
    };

    console.log('Signing with secret:', process.env.JWT_SECRET || 'your-secret-key');

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'your-secret-key',
      expiresIn: '24h',
    });

    return { access_token: token };
  }
}

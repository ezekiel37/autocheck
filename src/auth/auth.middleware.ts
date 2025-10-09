import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Skip auth for login/register routes
    if (req.path.startsWith('/auth/login') || req.path.startsWith('/auth/register')) {
      return next();
    }

    const authHeader = req.headers['authorization'];
    console.log('AUTH HEADER:', req.headers); 

    const token = this.extractToken(authHeader);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
      });

      (req as any).user = decoded; // attach decoded payload
      next();
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(authHeader?: string): string | undefined {
    if (!authHeader) return undefined;

    const [scheme, token] = authHeader.split(' ');
    return scheme === 'Bearer' && token ? token : undefined;
  }
}

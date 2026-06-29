import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private db: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'histlingo-secret-key',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.db.queryOne<{ id: string; email: string; username: string; role: string }>(
      'SELECT id, email, username, role FROM users WHERE id = ? LIMIT 1',
      [payload.sub]
    );
    if (!user) throw new UnauthorizedException();
    return { id: user.id, email: user.email, username: user.username, role: user.role };
  }
}

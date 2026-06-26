import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { AlarmesAguaPrismaService } from '../../database/alarmes-agua-prisma.service';
import { addDuration } from '../../common/utils/duration.util';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: AlarmesAguaPrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email.toLowerCase().trim(),
        deletedAt: null,
      },
    });
    if (!user || !user.active) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.issueTokens(user.id, user.email);
  }

  async refresh(refreshToken: string) {
    const record = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
    const user = await this.prisma.user.findFirst({
      where: { id: record.userId, deletedAt: null },
    });
    if (!user || !user.active) {
      await this.prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
      throw new UnauthorizedException('Usuário inválido ou inativo');
    }
    await this.prisma.refreshToken.delete({ where: { id: record.id } });
    return this.issueTokens(user.id, user.email);
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
    return { success: true };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  private async issueTokens(userId: string, email: string) {
    const refreshExpr = this.config.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN');
    const accessExpr = this.config.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN');
    const refreshTokenValue = randomBytes(48).toString('base64url');
    const expiresAt = addDuration(new Date(), refreshExpr);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId,
        expiresAt,
      },
    });

    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: accessExpr as StringValue,
      },
    );

    return {
      accessToken,
      refreshToken: refreshTokenValue,
    };
  }
}

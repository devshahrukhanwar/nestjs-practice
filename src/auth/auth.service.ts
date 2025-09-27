import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library";
import { ConfigService } from "@nestjs/config";

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  async signUp(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {...dto, password: hash },
      });

      delete user.password;

      return { message: 'User signed up successfully', data: user };
    } catch (error) {
      if ( error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
    }
  }

  async signIn(dto: AuthDto): Promise<{  message: string; access_token?: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email
        }
      });

      if (!user) {
        throw new ForbiddenException('Credentials incorrect');
      }

      const pwMatched = await argon.verify(user.password, dto.password);

      if (!pwMatched) {
        throw new ForbiddenException('Credentials incorrect');
      }

      delete user.password;

      const payload = { sub: user.id, email: user.email };
      console.log(process.env.JWT_SECRET);
      return {
        message: 'User signed in successfully',
        access_token: await this.jwtService.signAsync(payload, {
          secret: this.config.get('JWT_SECRET'),
        })
      };
    } catch (error) {
      throw new ForbiddenException('Credentials incorrect');
    }
  }
}
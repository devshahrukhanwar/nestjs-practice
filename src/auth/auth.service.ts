import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library";

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

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

  async signIn(dto: AuthDto) {
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

      // delete user.password;

      return { message: 'User signed in successfully', data: user };
    } catch (error) {
      throw new ForbiddenException('Credentials incorrect');
    }
  }
}
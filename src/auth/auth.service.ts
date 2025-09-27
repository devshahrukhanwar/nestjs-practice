import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientInitializationError, PrismaClientKnownRequestError } from "generated/prisma/runtime/library";

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

  signIn(dto: AuthDto) {
    return { message: 'User signed in successfully', data: dto };
  }
}
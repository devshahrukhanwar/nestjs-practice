import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from './strategy';

@Module({
  imports: [JwtModule.register({
    global: true,
    signOptions: { expiresIn: '1d' },
    secret: process.env.JWT_SECRET,
  })],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
})
export class AuthModule {}

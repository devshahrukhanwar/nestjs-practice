import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

  @Get('me')
  getMe(
    @GetUser() user,
    @GetUser('email') email: string,
  ) {
    return { message: 'User profile', data: user };
  }
}

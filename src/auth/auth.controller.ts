import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Request,
    UseGuards,
  } from '@nestjs/common';
  import { UserService } from 'src/user/user.service';
  import { AuthService } from './auth.service';
  import { CreateUserDto } from './dto/create-user.dto';

  import { ResetUserPasswordDto } from './dto/reset-user-password.dto';
  import { JwtAuthGuard } from './jwt-auth.guard';
  import { RequestWithUser } from './jwt.strategy';
import { LoginUserDto } from './dto/login-user.dto';
  
  @Controller('auth')
  export class AuthController {
    constructor(
      private readonly authService: AuthService,
      private readonly userService: UserService,
    ) {}
  
    @Post('login')
    async login(@Body() authBody: LoginUserDto) {
      return await this.authService.login({
        authBody,
      });
    }
    @Post('register')
    async register(@Body() registerBody: CreateUserDto) {
      return await this.authService.register({
        registerBody,
      });
    }
  
    @Post('request-reset-password')
    async resetUserPasswordRequest(@Body('email') email: string) {
      return await this.authService.resetUserPasswordRequest({email});
    }
  
    @Post('reset-password')
    async resetUserPassword(@Body() resetPasswordDto: ResetUserPasswordDto) {
      return await this.authService.resetUserPassword(
        resetPasswordDto,
      );
    }
    @Get('verify-reset-password-token')
    async verifyResetPasswordToken(@Query('token') token: string) {
      return await this.authService.verifyResetPasswordToken(
        token,
      );
    }
  
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAuthenticatedUser(@Request() request: RequestWithUser) {
      return await this.userService.getUser(request.user.userId);
    }
    @UseGuards(JwtAuthGuard)

  @UseGuards(JwtAuthGuard)
  @Post('enable-2fa')
  async enable2FA(@Request() request: RequestWithUser) {
    const userId = request.user.userId;
    return await this.authService.enable2FA(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-2fa')
  async verify2FA(@Body() body: { token: string }, @Request() request: RequestWithUser) {
  const userId = request.user.userId;
  return await this.authService.verify2FA(userId, body.token);
}

  }
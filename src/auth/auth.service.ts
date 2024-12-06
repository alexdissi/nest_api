import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { AuthRepository } from './auth.repository';
import { MailerService } from 'src/mailer.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetUserPasswordDto } from './dto/reset-user-password.dto';
import { UserPayload } from './jwt.strategy';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async login({ authBody }: { authBody: LoginUserDto }) {
    const { email, password } = authBody;
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new HttpException("User does not exist.", HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await this.isPasswordValid(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid password.', HttpStatus.UNAUTHORIZED);
    }

    await this.authRepository.updateUserLastLogin(user.id);

    return this.authenticateUser({ userId: user.id });
  }

  async register({ registerBody }: { registerBody: CreateUserDto }) {
    const { email, firstName, lastName, password, passwordConfirm } = registerBody;
    const name = `${firstName} ${lastName}`;
    const profilePictureUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}${lastName}`;
  
    if (password !== passwordConfirm) {
      throw new HttpException('Passwords do not match.', HttpStatus.BAD_REQUEST);
    }
  
    const existingUser = await this.authRepository.findUserByEmail(email);
  
    if (existingUser) {
      throw new HttpException('User already exists.', HttpStatus.BAD_REQUEST);
    }
  
    const hashedPassword = await this.hashPassword(password);
  
    const createdUser = await this.authRepository.createUser({
      email,
      password: hashedPassword,
      name,
      profilePictureUrl,
    });
  
    await this.mailerService.sendCreatedAccountEmail({
      firstName: name,
      recipient: email,
    });
  
    return {
      message: 'Account successfully created.',
      user: {
        email: createdUser.email,
      },
    };
  }

  async verifyResetPasswordToken(token: string) {
    const user = await this.authRepository.findUserByResetToken(token);

    if (!user) {
      throw new HttpException('The reset token is incorrect.', HttpStatus.NOT_FOUND);
    }

    if (!user.isResettingPassword) {
      throw new HttpException(
        "No password reset request is in progress.",
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      status: HttpStatus.OK,
      message: 'The reset token is valid.',
    };
  }

  async resetUserPasswordRequest({ email }: { email: string }) {
    const user = await this.authRepository.findUserByEmail(email);

    const resetToken = randomBytes(32).toString('hex');
    await this.authRepository.updateUserResetStatus(user.id, true, resetToken);

    await this.mailerService.sendRequestedPasswordEmail({
      firstName: user.name,
      recipient: user.email,
      token: resetToken,
    });

    return {
      error: false,
      message: 'If the email exists in our system, you will receive password reset instructions.',
    };
  }

  async resetUserPassword(resetPasswordDto: ResetUserPasswordDto) {
    const { password, token } = resetPasswordDto;

    const user = await this.authRepository.findUserByResetToken(token);

    if (!user) {
      throw new HttpException("User does not exist.", HttpStatus.NOT_FOUND);
    }

    if (!user.isResettingPassword) {
      throw new HttpException(
        "No password reset request is in progress.",
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.hashPassword(password);

    await this.authRepository.updateUserPassword(user.id, hashedPassword);

    return {
      error: false,
      message: 'Your password has been successfully changed.',
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  private async isPasswordValid(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  private authenticateUser(payload: UserPayload) {
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  
  async enable2FA(userId: string) {
    const AppName = process.env.APP_NAME;
    const secret = speakeasy.generateSecret({ name: `${AppName}(${userId})` });
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    await this.authRepository.save2FASecret(userId, secret.base32);

    return { qrCodeUrl, secret: secret.base32 };
  }

  async verify2FA(userId: string, token: string) {
      const user = await this.authRepository.findUserById(userId);
      
      if (!user || !user.twoFactorSecret) {
        throw new HttpException(
          { error: true, message: '2FA secret not found' },
          HttpStatus.NOT_FOUND
        );
      }
  
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: token,
      });
  
      if (!verified) {
        throw new HttpException(
          { error: true, message: 'Invalid 2FA token' },
          HttpStatus.UNAUTHORIZED
        );
      }
  
      return { error: false, message: '2FA verification successful' };
    } 
}

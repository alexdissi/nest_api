import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(page: number, limit: number) {
        return this.prisma.user.findMany({
            skip: (page - 1) * limit,
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
    }

    async findUserById(userId: string) {
        return this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                profilePictureUrl: true,
                role: true,
                status: true,
                twoFactorSecret: true,
                is2faEnabled: true,
            },
        });
    }
    
    async updateUser(userId: string, data: any) {
        return this.prisma.user.update({
          where: { id: userId },
          data: data,
        });
      }

      async findUsersByName(name: string, page: number, limit: number) {
        return this.prisma.user.findMany({
          where: {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          },
          skip: (page - 1) * limit,
          take: limit,
          select: {
            id: true,
            name: true,
            email: true,
          },
        });
      }

      async findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
          where: { email },
        });
      }
    
      async findUserByResetToken(token: string) {
        return this.prisma.user.findUnique({
          where: { resetPasswordToken: token },
        });
      }
    
      async createUser(data: { email: string; password: string; name: string; profilePictureUrl: string }) {
        return this.prisma.user.create({
          data: {
            email: data.email,
            password: data.password,
            name: data.name,
            profilePictureUrl: data.profilePictureUrl,
            createdAt: new Date(),
          },
        });
      }
    
      async updateUserResetStatus(userId: string, isResettingPassword: boolean, resetPasswordToken?: string) {
        return this.prisma.user.update({
          where: { id: userId },
          data: { isResettingPassword, resetPasswordToken,dateResetPassword: new Date() },
        });
      }
    
      async updateUserPassword(userId: string, hashedPassword: string) {
        return this.prisma.user.update({
          where: { id: userId },
          data: { password: hashedPassword, isResettingPassword: false, dateResetPassword: new Date() },
        });
      }
    
      async save2FASecret(userId: string, twoFactorSecret: string) {
        return this.prisma.user.update({
          where: { id: userId },
          data: { twoFactorSecret, is2faEnabled: true },
        });
      }
    
      async disable2FA(userId: string) {
        return this.prisma.user.update({
          where: { id: userId },
          data: { twoFactorSecret: null, is2faEnabled: false, twoFactorBackupCodes: [] },
        });
      }
      
      async updateUserLastLogin(userId: string) {
        return this.prisma.user.update({
          where: { id: userId },
          data: { lastLogin: new Date() },
        });
      }
}

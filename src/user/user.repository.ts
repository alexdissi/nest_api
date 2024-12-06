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
}

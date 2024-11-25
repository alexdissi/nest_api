import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getUsers(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        const users = await this.userRepository.findAll(page, limit);
        const formattedUsersData = users.map((user) => {
          return {
            ...user,
            createdAt: user.createdAt.toLocaleDateString('fr-FR'),
        };
        });
        return formattedUsersData;
      }

    async getUser(userId: string) {
        return this.userRepository.findUserById(userId);
    }
}

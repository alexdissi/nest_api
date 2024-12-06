import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AdminGuard } from 'src/auth/admin.guard';
import { RequestWithUser } from 'src/auth/jwt.strategy';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    @Get()
    @UseGuards(AdminGuard)
    getUsers(@Query() paginationDto: PaginationDto) {
      return this.userService.getUsers(paginationDto);
    }

    @Get('/me')
    async getUser(@Req() req: RequestWithUser) {
      if (!req.user || !req.user.userId) {
        throw new Error("The user is not authenticated");
      }

      const userId = req.user.userId;      
      return this.userService.getUser(userId);
    }

    @Get('/search-users')
    async getResearch(@Query() paginationDto: PaginationDto, @Query('name') name: string) {
        return this.userService.researchUsers(paginationDto, name);
    }
    
}

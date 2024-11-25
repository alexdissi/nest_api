import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard'; 
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminGuard extends JwtAuthGuard implements CanActivate {
  constructor(
    private userService: UserService, 
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId; 

    const user = await this.userService.getUser(userId);

    if (user.role !== 'ADMIN') {
        throw new HttpException(
            {
              statusCode: HttpStatus.FORBIDDEN,
              message: 'Access denied. Admins only.',
            },
            HttpStatus.FORBIDDEN,
          );
    }

    return true;
  }
}

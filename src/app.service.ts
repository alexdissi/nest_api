import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getUsers(): any[] {
    return [
      { id: 1, name: 'John' },
      { id: 2, name: 'Doe' },
    ];
}
}
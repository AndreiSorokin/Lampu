/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private firebaseAdmin: FirebaseAdminService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (process.env.NODE_ENV === 'development') {
      request.user = {
        id: '15788cc0-49f3-49b1-ad8d-c6bfc5a9cf9d',
        // id: '4eb3a8a7-8701-4bd1-814d-8c6b55172b85',
        email: 'kenici780@gmail.com',
        // email: 'aa@aa.aa',
        role: 'admin',
        // role: 'user',
        firebaseUid: '8IR3bhlCAaZORwKla16oEcF8GmB2',
        // firebaseUid: 'wJpTB1IQqZe6MgLC0wuTJJ83TPf1',
      };
      return true;
    }
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }

    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await this.firebaseAdmin.verifyIdToken(token);
      const user = await this.usersService.findByFirebaseUid(decodedToken.uid);

      if (!user) throw new UnauthorizedException('User not found');

      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired Firebase token');
    }
  }
}

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

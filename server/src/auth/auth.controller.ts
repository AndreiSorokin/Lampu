import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private firebaseAdmin: FirebaseAdminService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('verify-token')
  async verifyToken(@Body() body: { token: string }) {
    const decoded = await this.firebaseAdmin.verifyIdToken(body.token);

    // Optional: find/create user in your DB using Firebase uid or email
    let user = await this.usersService.findByFirebaseUid(decoded.uid);
    if (!user) {
      user = await this.usersService.createFromFirebase(decoded);
    }

    console.log("user: ", user);

    return {
      message: 'Token is valid',
      uid: decoded.uid,
      email: decoded.email,
      user,
    };
  }
}

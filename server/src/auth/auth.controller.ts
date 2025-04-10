import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('verify-token')
  async verifyToken(@Body() body: { token: string }) {
    const decoded = await this.firebaseAdmin.verifyIdToken(body.token);

    // Optional: find/create user in your DB using Firebase uid or email
    // let user = await this.usersService.findByFirebaseUid(decoded.uid);
    // if (!user) {
    //   user = await this.usersService.createFromFirebase(decoded);
    // }

    return {
      message: 'Token is valid',
      uid: decoded.uid,
      email: decoded.email,
      user,
    };
  }
}

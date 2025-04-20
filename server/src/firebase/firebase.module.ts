import { forwardRef, Module } from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import { FirebaseAuthGuard } from './firebase-auth-guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [FirebaseAdminService, FirebaseAuthGuard],
  exports: [FirebaseAdminService, FirebaseAuthGuard],
})
export class FirebaseModule {}

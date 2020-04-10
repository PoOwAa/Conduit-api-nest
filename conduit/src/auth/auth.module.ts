import { forwardRef, Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfigService } from '../config/app/appConfig.service';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JWTService } from './jwt.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Global()
@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: async (appConfig: AppConfigService) => ({
        secret: appConfig.jwtSecret,
        signOptions: { expiresIn: 86600 },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JWTService],
  exports: [AuthService, JWTService],
})
export class AuthModule {}

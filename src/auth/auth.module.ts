import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthsController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants/jwt.constants';

@Module({
    imports: [UsersModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1d' },
          }),
    ],
    providers: [AuthService],
    controllers: [AuthsController]
})
export class AuthModule{}
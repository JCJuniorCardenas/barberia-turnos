import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

export const AuthGuard = PassportAuthGuard('jwt');

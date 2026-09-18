import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: { rol?: string } }>();
    if (request.user?.rol !== 'admin') throw new ForbiddenException('Se requiere rol de administrador');
    return true;
  }
}
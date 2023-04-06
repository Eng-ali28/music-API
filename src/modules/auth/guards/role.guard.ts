import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Observable } from 'rxjs';
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let roles: Role[] = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) return true;
    const user = context.switchToHttp().getRequest().user;
    if (roles.includes(user.role)) return true;
    return false;
  }
}

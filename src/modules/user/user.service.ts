import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import PrismaService from 'prisma/prisma.service';
import UserLoginDto from './dto/userlogin.dto';
import * as bcrypt from 'bcryptjs';
@Injectable()
export default class UserService {
  constructor(private prisma: PrismaService) {}
  async findByEmail(email: string) {
    const findUser = await this.prisma.user.findUnique({ where: { email } });

    return findUser;
  }
  async findByUsername(username: string) {
    const findUser = await this.prisma.user.findUnique({ where: { username } });

    return findUser;
  }
  async validateUserPassword(userLogin: UserLoginDto): Promise<boolean> {
    const user = await this.findByEmail(userLogin.email);
    const isValid = await bcrypt.compare(userLogin.password, user.password);
    if (!isValid) {
      throw new ForbiddenException('password is incorrect');
    }
    return true;
  }
  async validateAdminPassword(userLogin: UserLoginDto): Promise<boolean> {
    const user = await this.findByEmail(userLogin.email);
    const checkAdmin = (): Boolean => user.role == 'ADMIN';
    if (!checkAdmin)
      throw new ForbiddenException('this route is forbidden to you.');
    const isValid = await bcrypt.compare(userLogin.password, user.password);
    if (!isValid) {
      throw new ForbiddenException('password is incorrect');
    }
    return true;
  }
  async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationExpires: Date | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UsersRepository {
  constructor(private prismaService: PrismaService) {}

  async create(input: CreateUserInput): Promise<User> {
    return this.prismaService.user.create({
      data: {
        email: input.email,
        password: input.password,
        firstName: input.firstName,
        lastName: input.lastName,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, input: Partial<CreateUserInput>): Promise<User> {
    return this.prismaService.user.update({
      where: { id },
      data: input,
    });
  }

  async delete(id: string): Promise<User> {
    return this.prismaService.user.delete({
      where: { id },
    });
  }
}

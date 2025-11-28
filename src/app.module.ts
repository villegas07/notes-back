import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { NotesModule } from './modules/notes/notes.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [AuthModule, UsersModule, NotesModule, CategoriesModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}

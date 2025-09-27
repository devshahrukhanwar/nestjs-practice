import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { User, Bookmark, Category } from './entities';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('DATABASE_HOST'),
    //     port: parseInt(configService.get('DATABASE_PORT'), 10),
    //     username: configService.get('DATABASE_USER'),
    //     password: configService.get('DATABASE_PASSWORD'),
    //     database: configService.get('DATABASE_NAME'),
    //     entities: [User, Bookmark, Category],
    //     synchronize: configService.get('NODE_ENV') === 'development',
    //     logging: configService.get('LOG_LEVEL') === 'debug',
    //   }),
    //   inject: [ConfigService],
    // }),
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
  ],
})
export class AppModule {}

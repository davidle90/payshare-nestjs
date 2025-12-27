import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../config/database.config'
import { User } from '../modules/users/entities/user.entity';
import { Role } from '../modules/acl/roles/role.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const db = configService.get<TypeOrmModuleOptions>('database');
        if (!db) throw new Error('Database config not found!');
        return {
          ...db,
          entities: [User, Role],
        };
      },
    }),
  ],
})
export class DatabaseModule {}

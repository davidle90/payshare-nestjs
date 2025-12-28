import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../config/database.config'
import { join } from 'path';

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
          // Use a glob pattern to automatically include all entities
          entities: [
            join(__dirname, '..', '**', '*.entity.{ts,js}'),  // Adjust the glob pattern to match your file structure
          ],
          synchronize: true,  // This can be false in production
        };
      },
    }),
  ],
})
export class DatabaseModule {}

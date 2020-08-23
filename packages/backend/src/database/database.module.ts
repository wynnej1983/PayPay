import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE_NAME'),
        entities: [__dirname + '/../**/*.entity{.js, .ts}'],
        // We are using migrations, synchronize should be set to false.
        synchronize: true,
        // Run migrations automatically,
        // you can disable this if you prefer running migration manually.
        migrationsRun: true,
        logging: true,
        logger: 'file',
        // Allow both start:prod and start:dev to use migrations
        // __dirname is either dist or src folder, meaning either
        // the compiled js in prod or the ts in dev.
        migrations: [__dirname + '/../migrations/**/*{.js, .ts}'],
        cli: {
          // Location of migration should be inside src folder
          // to be compiled into dist/ folder.
          migrationsDir: 'src/migrations',
        },
      }),
    }),
  ],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { SensorsModule } from './modules/sensors/sensors.module';
import { LogsModule } from './modules/logs/logs.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: true, allowUnknown: true },
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    SensorsModule,
    LogsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

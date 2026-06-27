import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { SensorsModule } from '../sensors/sensors.module';

@Module({
  imports: [SensorsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

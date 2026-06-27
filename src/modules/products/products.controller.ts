import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SensorsService } from '../sensors/sensors.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly sensorsService: SensorsService,
  ) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':productId/sensors')
  findSensors(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.sensorsService.findByProduct(productId);
  }

  @Get(':productId')
  findOne(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.productsService.findOne(productId);
  }

  @Put(':productId')
  update(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(productId, dto);
  }

  @Delete(':productId')
  remove(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.productsService.remove(productId);
  }
}

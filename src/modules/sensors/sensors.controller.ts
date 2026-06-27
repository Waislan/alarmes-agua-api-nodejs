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
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { SensorsService } from './sensors.service';

@Controller('sensors')
@UseGuards(JwtAuthGuard)
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Post()
  create(@Body() dto: CreateSensorDto) {
    return this.sensorsService.create(dto);
  }

  @Get()
  findAll() {
    return this.sensorsService.findAll();
  }

  @Get(':sensorId')
  findOne(@Param('sensorId', ParseUUIDPipe) sensorId: string) {
    return this.sensorsService.findOne(sensorId);
  }

  @Put(':sensorId')
  update(
    @Param('sensorId', ParseUUIDPipe) sensorId: string,
    @Body() dto: UpdateSensorDto,
  ) {
    return this.sensorsService.update(sensorId, dto);
  }

  @Delete(':sensorId')
  remove(@Param('sensorId', ParseUUIDPipe) sensorId: string) {
    return this.sensorsService.remove(sensorId);
  }
}

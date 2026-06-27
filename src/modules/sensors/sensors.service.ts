import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/alarmes-agua-client';
import { AlarmesAguaPrismaService } from '../../database/alarmes-agua-prisma.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';

const sensorSelect = {
  id: true,
  productId: true,
  name: true,
  algorithm: true,
  resolution: true,
  frequency: true,
  unit: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      logs: { where: { deletedAt: null } },
    },
  },
} satisfies Prisma.SensorSelect;

@Injectable()
export class SensorsService {
  constructor(private readonly prisma: AlarmesAguaPrismaService) {}

  async create(dto: CreateSensorDto) {
    await this.ensureActiveProduct(dto.productId);
    const name = dto.name.trim();
    await this.ensureNameAvailable(dto.productId, name);

    try {
      return await this.prisma.sensor.create({
        data: {
          productId: dto.productId,
          name,
          algorithm: dto.algorithm.trim(),
          resolution: dto.resolution,
          frequency: dto.frequency.trim(),
          unit: dto.unit.trim(),
        },
        select: sensorSelect,
      });
    } catch (error) {
      this.handleUniqueNameError(error);
      throw error;
    }
  }

  async findAll() {
    return this.prisma.sensor.findMany({
      where: { deletedAt: null },
      select: sensorSelect,
      orderBy: [{ productId: 'asc' }, { name: 'asc' }],
    });
  }

  async findByProduct(productId: string) {
    await this.ensureActiveProduct(productId);
    return this.prisma.sensor.findMany({
      where: { productId, deletedAt: null },
      select: sensorSelect,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(sensorId: string) {
    const sensor = await this.findActiveSensor(sensorId);
    if (!sensor) {
      throw new NotFoundException('Sensor não encontrado');
    }
    return sensor;
  }

  async update(sensorId: string, dto: UpdateSensorDto) {
    const current = await this.findOne(sensorId);
    const productId = dto.productId ?? current.productId;

    if (dto.productId !== undefined) {
      await this.ensureActiveProduct(productId);
    }

    if (dto.name !== undefined || dto.productId !== undefined) {
      const name = (dto.name ?? current.name).trim();
      await this.ensureNameAvailable(productId, name, sensorId);
    }

    try {
      return await this.prisma.sensor.update({
        where: { id: sensorId },
        data: {
          ...(dto.productId !== undefined && { productId: dto.productId }),
          ...(dto.name !== undefined && { name: dto.name.trim() }),
          ...(dto.algorithm !== undefined && {
            algorithm: dto.algorithm.trim(),
          }),
          ...(dto.resolution !== undefined && { resolution: dto.resolution }),
          ...(dto.frequency !== undefined && {
            frequency: dto.frequency.trim(),
          }),
          ...(dto.unit !== undefined && { unit: dto.unit.trim() }),
        },
        select: sensorSelect,
      });
    } catch (error) {
      this.handleUniqueNameError(error);
      throw error;
    }
  }

  async remove(sensorId: string) {
    await this.findOne(sensorId);
    const deletedAt = new Date();

    await this.prisma.$transaction([
      this.prisma.log.updateMany({
        where: { sensorId, deletedAt: null },
        data: { deletedAt },
      }),
      this.prisma.sensor.update({
        where: { id: sensorId },
        data: { deletedAt },
      }),
    ]);

    return { success: true };
  }

  private async findActiveSensor(sensorId: string) {
    return this.prisma.sensor.findFirst({
      where: { id: sensorId, deletedAt: null },
      select: sensorSelect,
    });
  }

  private async ensureActiveProduct(productId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, deletedAt: null },
      select: { id: true },
    });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
  }

  private async ensureNameAvailable(
    productId: string,
    name: string,
    excludeSensorId?: string,
  ) {
    const existing = await this.prisma.sensor.findFirst({
      where: {
        productId,
        name,
        deletedAt: null,
        ...(excludeSensorId && { id: { not: excludeSensorId } }),
      },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException(
        'Sensor com este nome já cadastrado para o produto',
      );
    }
  }

  private handleUniqueNameError(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'Sensor com este nome já cadastrado para o produto',
      );
    }
  }
}

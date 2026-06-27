import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/alarmes-agua-client';
import { AlarmesAguaPrismaService } from '../../database/alarmes-agua-prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const productSelect = {
  id: true,
  name: true,
  style: true,
  resume: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProductSelect;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: AlarmesAguaPrismaService) {}

  async create(dto: CreateProductDto) {
    const style = dto.style.trim();
    await this.ensureStyleAvailable(style);

    try {
      return await this.prisma.product.create({
        data: {
          name: dto.name.trim(),
          style,
          resume: dto.resume?.trim() ?? null,
        },
        select: productSelect,
      });
    } catch (error) {
      this.handleUniqueStyleError(error);
      throw error;
    }
  }

  async findAll() {
    return this.prisma.product.findMany({
      where: { deletedAt: null },
      select: productSelect,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(productId: string) {
    const product = await this.findActiveProduct(productId);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    return product;
  }

  async update(productId: string, dto: UpdateProductDto) {
    await this.findOne(productId);

    if (dto.style !== undefined) {
      const style = dto.style.trim();
      await this.ensureStyleAvailable(style, productId);
    }

    try {
      return await this.prisma.product.update({
        where: { id: productId },
        data: {
          ...(dto.name !== undefined && { name: dto.name.trim() }),
          ...(dto.style !== undefined && { style: dto.style.trim() }),
          ...(dto.resume !== undefined && {
            resume: dto.resume.trim() || null,
          }),
        },
        select: productSelect,
      });
    } catch (error) {
      this.handleUniqueStyleError(error);
      throw error;
    }
  }

  async remove(productId: string) {
    await this.findOne(productId);
    const deletedAt = new Date();

    await this.prisma.$transaction([
      this.prisma.log.updateMany({
        where: { productId, deletedAt: null },
        data: { deletedAt },
      }),
      this.prisma.sensor.updateMany({
        where: { productId, deletedAt: null },
        data: { deletedAt },
      }),
      this.prisma.product.update({
        where: { id: productId },
        data: { deletedAt },
      }),
    ]);

    return { success: true };
  }

  private async findActiveProduct(productId: string) {
    return this.prisma.product.findFirst({
      where: { id: productId, deletedAt: null },
      select: productSelect,
    });
  }

  private async ensureStyleAvailable(style: string, excludeId?: string) {
    const existing = await this.prisma.product.findFirst({
      where: {
        style,
        deletedAt: null,
        ...(excludeId && { id: { not: excludeId } }),
      },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('Style já cadastrado');
    }
  }

  private handleUniqueStyleError(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Style já cadastrado');
    }
  }
}

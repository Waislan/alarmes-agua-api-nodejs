import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSensorDto {
  @IsUUID()
  productId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  algorithm!: string;

  @IsInt()
  @Min(1)
  resolution!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  frequency!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  unit!: string;
}

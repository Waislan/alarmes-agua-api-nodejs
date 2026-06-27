import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  style?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  resume?: string;
}

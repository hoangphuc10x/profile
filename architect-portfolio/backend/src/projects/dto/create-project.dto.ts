import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  title: string;

  @IsString()
  description: string;

  @IsOptional() @IsNumber() area?: number;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsInt() year?: number;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsBoolean() published?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  customerName: string;

  @IsString()
  @Matches(/^[0-9+\-\s()]{8,20}$/, { message: 'Số điện thoại không hợp lệ' })
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNumber()
  areaRequest?: number;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  budgetRange?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;

  // Slug của KTS nhận yêu cầu (vd: 'tung', 'hung'). Có thể bỏ trống → inquiry chung.
  @IsOptional()
  @IsString()
  architectSlug?: string;
}

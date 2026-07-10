import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsNumber,
  IsEnum,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { MovieType } from '../../../common/enums/movie-type.enum';
import { MovieStatus } from '../../../common/enums/movie-status.enum';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  posterUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  bannerUrl?: string;

  @IsEnum(MovieType)
  @IsNotEmpty()
  type: MovieType;

  @IsEnum(MovieStatus)
  @IsOptional()
  status?: MovieStatus;

  @IsInt()
  @IsOptional()
  releaseYear?: number;

  // ✅ THÊM 3 TRƯỜNG NÀY
  @IsInt()
  @IsOptional()
  totalEpisodes?: number;

  @IsNumber()
  @IsOptional()
  avgRating?: number;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}

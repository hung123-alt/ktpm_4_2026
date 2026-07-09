import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { RandomMovieFilterDto } from './dto/random-movie-filter.dto';
import { FilterMovieDto } from './dto/filter-movie.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  findAll(@Query('keyword') keyword?: string) {
    return this.moviesService.findAll(keyword);
  }

  // SỬA Ở ĐÂY: Route theo slug đã được đổi thành /movies/slug/:slug
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.moviesService.findBySlug(slug);
  }

  // Các route TĨNH (random, filter) đặt TRƯỚC @Get(':id')
  @Get('random')
  getRandomOne() {
    return this.moviesService.getRandomOne();
  }

  @Get('random/advanced')
  getRandomAdvanced(@Query() filters: RandomMovieFilterDto) {
    return this.moviesService.getRandomAdvanced(filters);
  }

  @Get('filter')
  filterMovies(@Query() filters: FilterMovieDto) {
    return this.moviesService.filterMovies(filters);
  }

  // Route động tìm theo ID đặt cuối cùng
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }
}

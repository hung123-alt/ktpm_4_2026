import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Movie } from '../movies/movies.entity'; // ✅ Import class Movie (viết hoa)

@Entity('favorites')
export class Favorite {
  // Khóa chính kép (user_id + movie_id) - khớp schema, KHÔNG có cột id
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'movie_id' })
  movieId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // ✅ Khai báo quan hệ đúng chuẩn
  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;
}

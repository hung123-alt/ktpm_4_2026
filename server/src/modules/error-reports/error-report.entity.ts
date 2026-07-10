import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ErrorType } from '../../common/enums/error-type.enum';
import { ReportStatus } from '../../common/enums/report-status.enum';
import { User } from '../users/user.entity';
import { Movie } from '../movies/movies.entity';

@Entity('error_reports')
export class ErrorReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'movie_id' })
  movieId: number;

  @Column({ name: 'episode_id', nullable: true })
  episodeId: number;

  @Column({ name: 'error_type', type: 'enum', enum: ErrorType })
  errorType: ErrorType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus;

  // Schema có admin_note (ghi chú của admin khi xử lý)
  @Column({ name: 'admin_note', type: 'text', nullable: true })
  adminNote: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;
}

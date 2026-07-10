import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import sanitizeHtml from 'sanitize-html';
import { CommentEntity } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  // Tạo bình luận (user đã đăng nhập)
  async create(userId: number, dto: CreateCommentDto): Promise<CommentEntity> {
    const comment = new CommentEntity();
    comment.userId = userId;
    comment.movieId = dto.movieId;

    // CHỐNG XSS
    comment.content = sanitizeHtml(dto.content, {
      allowedTags: [],
      allowedAttributes: {},
    });

    if (dto.parentId) {
      comment.parentId = dto.parentId;
    }
    return this.commentRepository.save(comment);
  }

  // ✅ SỬA LẠI: Lấy tất cả bình luận cho Admin
  async findAll() {
    return this.commentRepository.find({
      relations: { user: true, movie: true },
      order: { createdAt: 'DESC' },
    });
  }

  // Lấy bình luận của 1 phim (chỉ hiện cái chưa bị ẩn)
  async findByMovie(movieId: number): Promise<CommentEntity[]> {
    return this.commentRepository.find({
      where: { movieId, isHidden: false },
      relations: { user: true, movie: true },
      order: { createdAt: 'DESC' },
    });
  }

  // ✅ SỬA LẠI: Xóa bình luận (cho phép Admin xóa mọi bình luận)
  async remove(
    id: number,
    userId: number,
    role: string,
  ): Promise<{ message: string }> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Không tìm thấy bình luận #${id}`);
    }

    // Nếu KHÔNG PHẢI ADMIN và KHÔNG PHẢI người viết -> Cấm
    if (role !== 'admin' && comment.userId !== userId) {
      throw new ForbiddenException('Bạn chỉ có thể xóa bình luận của mình');
    }

    await this.commentRepository.remove(comment);
    return { message: 'Đã xóa bình luận' };
  }

  // Admin ẩn/hiện bình luận
  async toggleHide(id: number): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Không tìm thấy bình luận #${id}`);
    }
    comment.isHidden = !comment.isHidden;
    return this.commentRepository.save(comment);
  }
}

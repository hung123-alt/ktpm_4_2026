import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import compression from 'compression';
import { AppModule } from './app.module';
import * as dns from 'dns'; // ✅ THÊM DÒNG IMPORT NÀY

// ✅ THÊM DÒNG NÀY ĐỂ ÉP NODE.JS DÙNG IPV4 TRƯỚC KHI KHỞI ĐỘNG APP
dns.setDefaultResultOrder('ipv4first');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  // ① COMPRESSION - nén response (gzip)
  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 8000;
  await app.listen(port, '0.0.0.0');

  // ② LOGGER - in khi server khởi động
  logger.log(`🚀 Server đang chạy tại http://localhost:${port}/api`);
}
void bootstrap();

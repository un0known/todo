import { setServers } from 'node:dns/promises';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

setServers(['1.1.1.1', '8.8.8.8']);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrls = (
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ).split(",").map((url)=> url.trim());

  app.enableCors({
    origin: frontendUrls,
    methods:['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();

import { setServers } from 'node:dns/promises';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

setServers(['1.1.1.1', '8.8.8.8']);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000'
  })
  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();

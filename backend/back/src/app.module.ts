import { Module } from '@nestjs/common';
// import { AppController } from './app.controller.js';
// import { AppService } from './app.service.js';
import { TodoModule } from './todo/todo.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env', 'atlas-credentials.env'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');

        if (!uri) {
          throw new Error(
            'MONGODB_URI is missing. Configure .env or atlas-credentials.env.',
          );
        }

        return { uri };
      },
    }),
    TodoModule
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ListService } from './list.service.js';
import { ListController } from './list.controller.js';

@Module({
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}

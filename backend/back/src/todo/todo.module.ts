import { Module } from '@nestjs/common';
import { TodoService } from './todo.service.js';
import { TodoController } from './todo.controller.js';
import { Todo, TodoSchema } from './schemas/todo.schema.js';
import { MongooseModule } from '@nestjs/mongoose';
import { DbConnect } from '../dbConnect.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
      name: Todo.name,
      schema: TodoSchema,
    },
    ])
  ],
  controllers: [TodoController],
  providers: [TodoService, DbConnect],
})
export class TodoModule {}

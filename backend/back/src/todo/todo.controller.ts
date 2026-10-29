import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { TodoService } from './todo.service.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
// import type { Todo } from './entities/todo.entity.js';
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // CREATE
  @Post()
  create(@Body() createTodoDto: CreateTodoDto){
    return this.todoService.create(createTodoDto);
  }

  // READ ALL
  @Get()
  findAll(){
    return this.todoService.findAll();
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
  return this.todoService.findOne(id);
}

  // REPLACE ENTIRE TODO
  @Put(':id')
  replace(
    @Param('id') id: string,
  @Body() createTodoDto: CreateTodoDto,
) {
  return this.todoService.replace(id, createTodoDto);
}


  // UPDATE SPECIFIC FIELDS
  @Patch(':id')
  update(
  @Param('id') id: string,
  @Body() updateTodoDto: UpdateTodoDto,
) {
  return this.todoService.update(id, updateTodoDto);
}

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
  return this.todoService.remove(id);
}
}
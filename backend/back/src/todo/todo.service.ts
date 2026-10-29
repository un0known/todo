import {
  Injectable,
  NotFoundException,
  BadRequestException,
  OnModuleInit,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Todo } from './schemas/todo.schema.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { DbConnect } from '../dbConnect.js';

@Injectable()
export class TodoService implements OnModuleInit {
  constructor(
    @InjectModel(Todo.name)
    private readonly todoModel: Model<Todo>,
    private readonly dbConnect: DbConnect,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.dbConnect.check();
  }

  async create(createTodoDto: CreateTodoDto) {
    const title = createTodoDto.title?.trim();

    if (!title) {
      throw new BadRequestException('Todo title is required');
    }

    const todo = await this.todoModel.create({
      title,
      completed: createTodoDto.completed ?? false,
    });

    return todo;
  }

  async findAll() {
    return this.todoModel.find().sort({ createdAt: -1}).exec();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid Todo ID');
    }

    const todo = await this.todoModel.findById(id).exec();

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  async replace(id: string, createTodoDto: CreateTodoDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid Todo ID');
    }

    const title = createTodoDto.title?.trim();

    if (!title) {
      throw new BadRequestException('Todo title is required');
    }

    const todo = await this.todoModel
      .findByIdAndUpdate(
        id,
        {
          title,
          completed: createTodoDto.completed ?? false,
        },
        { new: true, runValidators: true },
      )
      .exec();

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid Todo ID');
    }

    if (
      updateTodoDto.title !== undefined &&
      !updateTodoDto.title.trim()
    ) {
      throw new BadRequestException('Todo title cannot be empty');
    }

    const updateData: Record<string, unknown> = {};

    if (updateTodoDto.title !== undefined) {
      updateData.title = updateTodoDto.title.trim();
    }

    if (updateTodoDto.completed !== undefined) {
      updateData.completed = updateTodoDto.completed;
    }

    const todo = await this.todoModel
      .findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  async remove(id: string) {

    console.log("id", id)

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid Todo ID');
    }

    const todo = await this.todoModel.findByIdAndDelete(id).exec();

    console.log("tjojdlk", todo)

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return {
      message: 'Todo deleted successfully',
      id: todo._id.toString(),
    };
  }
}
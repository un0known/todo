import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { DbConnect } from '../dbConnect.js';
import { Todo } from './schemas/todo.schema.js';
import { TodoService } from './todo.service.js';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: getModelToken(Todo.name), useValue: {} },
        { provide: DbConnect, useValue: { check: vi.fn() } },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

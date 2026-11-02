import { PartialType } from '@nestjs/mapped-types';
import { CreateListDto } from './create-list.dto.js';

export class UpdateListDto extends PartialType(CreateListDto) {}

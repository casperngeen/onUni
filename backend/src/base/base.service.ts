import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/modules/logger/logger.service';
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  Repository,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export default class BaseService<T> {
  protected readonly loggerService: LoggerService;
  constructor(private readonly repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      this.error('Error finding all', error);
    }
  }

  async find(t: FindManyOptions<T>) {
    try {
      return await this.repository.find(t);
    } catch (error) {
      this.error(`Error finding match by ${t}`, error);
    }
  }

  async findOne(t: Partial<T>): Promise<T> {
    try {
      return await this.repository.findOne(t);
    } catch (error) {
      this.error(`Error finding item ${t}`, error);
    }
  }

  async insert(t: DeepPartial<T>): Promise<T> {
    try {
      return await this.repository.save(t);
    } catch (error) {
      this.error(`Error inserting item ${t}`, error);
    }
  }

  async update(
    id: number,
    t: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    try {
      return await this.repository.update(id, t);
    } catch (error) {
      this.error(`Error updating item ${t} with id ${id}`, error);
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      this.error(`Error deleting item with id ${id}`, error);
    }
  }

  log(message: string) {
    this.loggerService.log(message);
  }

  error(message: string, trace: string) {
    this.loggerService.error(message, trace);
  }

  warn(message: string) {
    this.loggerService.warn(message);
  }

  debug(message: string) {
    this.loggerService.debug(message);
  }
}

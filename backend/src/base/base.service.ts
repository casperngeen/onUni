import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/modules/logger/logger.service';
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  Repository,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { DatabaseException } from './base.exception';

@Injectable()
export default class BaseService<T> {
  private readonly loggerService: LoggerService;
  constructor(
    private readonly repository: Repository<T>,
    loggerService: LoggerService,
  ) {
    this.loggerService = loggerService;
  }

  async findAll(): Promise<T[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      this.error('Error finding all', error);
      throw new DatabaseException();
    }
  }

  async find(t: FindManyOptions<T>) {
    try {
      return await this.repository.find(t);
    } catch (error) {
      this.error(`Error finding match by ${JSON.stringify(t)}`, error);
      throw new DatabaseException();
    }
  }

  async findOne(t: FindOneOptions<T>): Promise<T> {
    try {
      return await this.repository.findOne(t);
    } catch (error) {
      this.error(`Error finding item matching ${JSON.stringify(t)}`, error);
      throw new DatabaseException();
    }
  }

  async upsert(t: DeepPartial<T>): Promise<T> {
    try {
      return await this.repository.save(t);
    } catch (error) {
      this.error(`Error upserting item ${JSON.stringify(t)}`, error);
      throw new DatabaseException();
    }
  }

  async update(
    id: number,
    t: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    try {
      return await this.repository.update(id, t);
    } catch (error) {
      this.error(
        `Error updating item ${JSON.stringify(t)} with id ${id}`,
        error,
      );
      throw new DatabaseException();
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      this.error(`Error deleting item with id ${id}`, error);
      throw new DatabaseException();
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

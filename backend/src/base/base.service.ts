import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/modules/logger/logger.service';
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { DatabaseException } from './base.exception';
import * as StackTrace from 'stacktrace-js';
import * as path from 'path';

@Injectable()
export default class BaseService<T> {
  private readonly loggerService: LoggerService;
  protected context: string;
  constructor(
    private readonly repository: Repository<T>,
    loggerService: LoggerService,
  ) {
    this.loggerService = loggerService;
    this.context = StackTrace.getSync().map((frame) =>
      path.basename(frame.fileName),
    )[0];
  }

  async findAll(): Promise<T[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      this.error('Error finding all', this.context, this.getTrace());
      throw new DatabaseException();
    }
  }

  async find(t: FindManyOptions<T>) {
    try {
      return await this.repository.find(t);
    } catch (error) {
      this.error(
        `Error finding match by ${JSON.stringify(t)}`,
        this.context,
        this.getTrace(),
      );
      throw new DatabaseException();
    }
  }

  async findOne(t: FindOneOptions<T>): Promise<T> {
    try {
      return await this.repository.findOne(t);
    } catch (error) {
      this.error(
        `Error finding item matching ${JSON.stringify(t)}`,
        this.context,
        this.getTrace(),
      );
      throw new DatabaseException();
    }
  }

  async save(t: DeepPartial<T>): Promise<T> {
    try {
      return await this.repository.save(t);
    } catch (error) {
      this.error(
        `Error saving item ${JSON.stringify(t)}`,
        this.context,
        this.getTrace(),
      );
      throw new DatabaseException();
    }
  }

  async insert(t: QueryDeepPartialEntity<T>): Promise<InsertResult> {
    try {
      return await this.repository.insert(t);
    } catch (error) {
      this.error(
        `Error inserting item ${JSON.stringify(t)}`,
        this.context,
        this.getTrace(),
      );
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
        this.context,
        this.getTrace(),
      );
      throw new DatabaseException();
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      this.error(
        `Error deleting item with id ${id}`,
        this.context,
        this.getTrace(),
      );
      console.log(error);
      throw new DatabaseException();
    }
  }

  protected getTrace(): string {
    const trace = StackTrace.getSync();
    return trace.map((frame) => frame.toString()).join('\n');
  }

  log(message: string, context: string) {
    this.loggerService.log(message, context);
  }

  error(message: string, context: string, trace: string) {
    this.loggerService.error(message, context, trace);
  }

  warn(message: string, context: string) {
    this.loggerService.warn(message, context);
  }

  debug(message: string, context: string) {
    this.loggerService.debug(message, context);
  }
}

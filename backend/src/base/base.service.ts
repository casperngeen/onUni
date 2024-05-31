import { Injectable } from '@nestjs/common';
import { DeepPartial, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export default class BaseService<T> {
  constructor(private readonly repository: Repository<T>) {}

  findAll(): Promise<T[]> {
    return this.repository.find();
  }

  findOne(t: Partial<T>): Promise<T> {
    return this.repository.findOne(t);
  }

  insert(t: DeepPartial<T>): Promise<T> {
    return this.repository.save(t);
  }

  update(id: number, t: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
    return this.repository.update(id, t);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  getId(t: T): Promise<number> {
    return this.repository.getId(t);
  }
}

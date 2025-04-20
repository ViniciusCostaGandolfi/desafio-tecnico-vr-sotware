export interface BusinessValidator<T> {
    validate(dto: T): Promise<void>;
  }
import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';

export class EntityNotFoundException extends CustomException {
  constructor(entity: string, id?: string) {
    super(
      `${entity}${id ? ` with id ${id}` : ''} not found`,
      HttpStatus.NOT_FOUND,
    );
  }
}

export class EntityAlreadyExistsException extends CustomException {
  constructor(entity: string, field: string, value: string) {
    super(
      `${entity} with ${field} '${value}' already exists`,
      HttpStatus.CONFLICT,
    );
  }
}

export class InvalidCredentialsException extends CustomException {
  constructor() {
    super('Invalid credentials provided', HttpStatus.UNAUTHORIZED);
  }
}

export class ValidationFailedException extends CustomException {
  constructor(errors: string[]) {
    super(
      'Validation failed: ' + errors.join(', '),
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
} 
/**
 * Domain-level exceptions
 * Business logic errors that are framework agnostic
 */

export class DomainError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string = 'DOMAIN_ERROR'
  ) {
    super(message);
    this.name = 'DomainError';
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(entityName: string, id: string | number) {
    super(
      `${entityName} with ID ${id} not found`,
      'ENTITY_NOT_FOUND'
    );
    this.name = 'EntityNotFoundError';
    Object.setPrototypeOf(this, EntityNotFoundError.prototype);
  }
}

export class InvalidEntityError extends DomainError {
  constructor(entityName: string, reason: string) {
    super(
      `Invalid ${entityName}: ${reason}`,
      'INVALID_ENTITY'
    );
    this.name = 'InvalidEntityError';
    Object.setPrototypeOf(this, InvalidEntityError.prototype);
  }
}

export class DuplicateEntityError extends DomainError {
  constructor(entityName: string, field: string, value: string) {
    super(
      `${entityName} with ${field} "${value}" already exists`,
      'DUPLICATE_ENTITY'
    );
    this.name = 'DuplicateEntityError';
    Object.setPrototypeOf(this, DuplicateEntityError.prototype);
  }
}

export class BusinessRuleViolationError extends DomainError {
  constructor(message: string) {
    super(message, 'BUSINESS_RULE_VIOLATION');
    this.name = 'BusinessRuleViolationError';
    Object.setPrototypeOf(this, BusinessRuleViolationError.prototype);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string = 'Forbidden access') {
    super(message, 'FORBIDDEN');
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class InvalidOperationError extends DomainError {
  constructor(message: string) {
    super(message, 'INVALID_OPERATION');
    this.name = 'InvalidOperationError';
    Object.setPrototypeOf(this, InvalidOperationError.prototype);
  }
}

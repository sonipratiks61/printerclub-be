import { ValidationError } from '@nestjs/common';

// Function to recursively collect all constraints from nested validation errors
export function getAllConstraints(
  errors: ValidationError[],
): Record<string, any> {
  const constraints: Record<string, any> = {};

  for (const error of errors) {
    if (error.constraints) {
      // Copy constraints to the newly created property
      for (const key of Object.keys(error.constraints)) {
        if (!constraints[error.property]) {
          constraints[error.property] = [];
        }
        constraints[error.property].push(error.constraints[key]);
      }
    }

    if (error.children && error.children.length > 0) {
      // Recursively collect constraints from child errors
      const childConstraints = getAllConstraints(error.children);
      // Merge childConstraints directly into constraints[error.property]
      if (!constraints[error.property]) {
        constraints[error.property] = [];
      }
      constraints[error.property].push(childConstraints);
    }
  }

  return constraints;
}

// Function to generate custom validation error response
export function getCustomValidationError(
  errors: ValidationError[],
): Record<string, any> {
  const constraints = getAllConstraints(errors);

  const formattedErrors: Record<string, any> = {};
  for (const key of Object.keys(constraints)) {
    // Flatten array of constraints to remove nesting
    formattedErrors[key] = constraints[key].flat();
  }

  return {
    errors: formattedErrors,
    success: false,
  };
}

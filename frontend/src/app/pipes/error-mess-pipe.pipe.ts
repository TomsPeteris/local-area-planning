import { Pipe, PipeTransform } from "@angular/core";
import { ValidationErrors } from "@angular/forms";

export const ERROR_MESSAGES: Record<string, Record<string, string>> = {
  title: {
    required: "Title is required.",
    minlength: "Title must be at least 7 characters long.",
  },
  description: {
    required: "Description is required.",
    minlength: "Description must be at least 15 characters long.",
  },
  goal: {
    required: "Goal is required.",
    minlength: "Goal must be at least 7 characters long.",
  },
  phoneNumber: {
    required: "Phone number is required.",
    pattern:
      'Phone number must be between 10 and 15 digits and may start with a "+"',
  },
  date: {
    required: "Date is required.",
  },
};

@Pipe({
  name: "errorMessages",
})
export class ErrorMessagesPipe implements PipeTransform {
  transform(
    errors: ValidationErrors | null,
    fieldName: keyof typeof ERROR_MESSAGES
  ): string | null {
    if (!errors) {
      return null;
    }
    const fieldErrors = ERROR_MESSAGES[fieldName];
    if (!fieldErrors) {
      return null;
    }

    for (const errorKey in errors) {
      if (fieldErrors[errorKey as keyof typeof fieldErrors]) {
        return fieldErrors[errorKey as keyof typeof fieldErrors];
      }
    }

    return null;
  }
}

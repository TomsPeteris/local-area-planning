import { Pipe, PipeTransform } from "@angular/core";
import { ValidationErrors } from "@angular/forms";

export const ERROR_MESSAGES: Record<
  string,
  string | { message: string; minLenghtValue?: number }
> = {
  required: "Value is required.",
  minlength: {
    message: "Value must be at least {{minLenghtValue}} characters long.",
    minLenghtValue: 7,
  },
  pattern:
    'Phone number must be between 10 and 15 digits and may start with a "+"',
};

@Pipe({
  name: "errorMessages",
})
export class ErrorMessagesPipe implements PipeTransform {
  transform(errors: ValidationErrors | null): string | null {
    if (!errors) {
      return null;
    }
    for (const errorKey in errors) {
      const errorMessage = ERROR_MESSAGES[errorKey];

      if (errorMessage) {
        if (typeof errorMessage === "object") {
          let message = errorMessage.message;

          message = message.replace(
            new RegExp(`{{minLenghtValue}}`, "g"),
            errors["minlength"].requiredLength.toString()
          );
          return message;
        }
        return errorMessage;
      }
    }
    return null;
  }
}

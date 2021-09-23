import { failure } from "io-ts/lib/PathReporter";
import { ValidationError } from "io-ts";

export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, string> {
  return obj.hasOwnProperty(prop);
}

/**
 * Transform ValidationError[] into more readable format
 * @param xs Validation errors after decode method
 */
export const validationErrorsToString = (xs: ValidationError[]) =>
  failure(xs).reduce((acc, errStr) => `${acc} - ${errStr}\n`, "");

import { ValidationError } from 'io-ts'
import { failure } from 'io-ts/lib/PathReporter'

import { CurriedFunction2, CurriedFunction3 } from './types'

export function hasOwnProperty<X extends object, Y extends PropertyKey>(
	obj: X,
	prop: Y
): obj is X & Record<Y, string> {
	return Object.prototype.hasOwnProperty.call(obj, prop)
}

/**
 * Transform ValidationError[] into more readable format
 * @param xs Validation errors after decode method
 */
export const validationErrorsToString = (xs: ValidationError[]) =>
	failure(xs).reduce((acc, errStr) => `${acc} - ${errStr}\n`, '')

export function curry2<T1, T2, R>(
	fn: (a: T1, b: T2) => R
): CurriedFunction2<T1, T2, R> {
	return function (a: T1, b?: T2) {
		switch (arguments.length) {
			case 1:
				return function (b: T2) {
					return fn(a, b)
				}
			default:
				return fn(a, b as T2)
		}
	} as CurriedFunction2<T1, T2, R>
}

export function curry3<T1, T2, T3, R>(
	fn: (a: T1, b: T2, c: T3) => R
): CurriedFunction3<T1, T2, T3, R> {
	return function (a: T1, b?: T2, c?: T3) {
		switch (arguments.length) {
			case 1:
				return curry2((b: T2, c: T3) => fn(a, b, c))
			case 2:
				return function (c: T3) {
					return fn(a, b as T2, c)
				}
			default:
				return fn(a, b as T2, c as T3)
		}
	} as CurriedFunction3<T1, T2, T3, R>
}

import { Either, Left } from '@/types'

export const right = <A>(x: A) => ({ right: x } as Either<never, A>)
export const left = <E>(x: E) => ({ left: x } as Either<E, never>)
export const isLeft = <E, A>(e: Either<E, A>): e is Left<E> =>
	Object.prototype.hasOwnProperty.call(e, 'left')

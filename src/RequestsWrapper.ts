import { Either, left, mapLeft, right } from 'fp-ts/lib/Either'
import * as t from 'io-ts'

import { adminAPIEndpoint, loginAPIEndpoint } from './config'
import { CourseGradesC, FileLinksC, ICourseGrades, IFileLinks } from './types'
import { validationErrorsToString } from './utils'

interface StatusResponse {
	status: string
	message: string
}

class RequestsWrapper {
	async _fetch<A>(
		url: string,
		method: 'get' | 'post',
		validator: t.Decoder<unknown, A>
	): Promise<Either<string, A>> {
		const res = await fetch(url, { method, credentials: 'include' })

		if (!res.ok) {
			console.log(res.status)
			return res.status < 500
				? left(await res.text())
				: left('Unknown server error, probably some parameters not found')
		}

		try {
			const val = await (res.headers
				.get('Content-Type')
				?.indexOf('application/json') !== -1
				? res.json()
				: res.text())
			return mapLeft<t.ValidationError[], string>(validationErrorsToString)(
				validator.decode(val)
			)
		} catch (err) {
			return left((err as Error).toString())
		}
	}

	async getStudents(
		course: string
	): Promise<Either<string, { students: string[] }>> {
		return this._fetch(
			`${adminAPIEndpoint}/courses/get_students/${course}/`,
			'get',
			t.type({ students: t.array(t.string) })
		)
	}

	private _grades = (url: string): Promise<Either<string, ICourseGrades[]>> =>
		this._fetch(url, 'get', t.array(CourseGradesC))

	gradesForStudent = (
		username: string,
		courseName: string
	): Promise<Either<string, ICourseGrades[]>> =>
		this._grades(
			`${adminAPIEndpoint}/students/get_grades/${username}/${courseName}/`
		)

	gradesForCourse = (
		courseName: string
	): Promise<Either<string, ICourseGrades[]>> =>
		this._grades(`${adminAPIEndpoint}/courses/get_grades/${courseName}/`)

	async getCourses(
		username: string
	): Promise<Either<string, { courses: string[] }>> {
		const CoursesListC = t.type({
			courses: t.array(t.string)
		})

		return this._fetch(
			`${adminAPIEndpoint}/students/get_courses/${username}/`,
			'get',
			CoursesListC
		)
	}

	fileLinks(
		username: string,
		course: string
	): Promise<Either<string, IFileLinks>> {
		// return new Promise((r) =>
		// 	r(
		// 		right({
		// 			course_id: 'dfafdafdasdsadgas',
		// 			username: 'kek',
		// 			links: ['kek.com', 'kek.com', 'kek.com', 'kek.com']
		// 		})
		// 	)
		// )
		return this._fetch(
			`${adminAPIEndpoint}/courses/docs_loader/${course}/${username}/`,
			'get',
			FileLinksC
		)
	}

	async addStudent(
		username: string,
		courseName: string
	): Promise<Either<string, StatusResponse>> {
		const form = new FormData()
		form.append('username', username)
		form.append('course_name', courseName)
		return await fetch(
			`${adminAPIEndpoint}/students/add_student/${username}/${courseName}/`,
			{
				method: 'post'
			}
		)
			.then(async (res) => {
				if (res.ok) {
					return right(await res.json())
				}
				if (res.status < 500) {
					return left(await res.text())
				}
				return left('Unknown server error')
			})
			.catch((err: Error) => left(err.toString()))
	}

	async removeStudent(
		username: string,
		courseName: string
	): Promise<Either<string, StatusResponse>> {
		const form = new FormData()
		form.append('username', username)
		form.append('course_name', courseName)
		return await fetch(
			`${adminAPIEndpoint}/students/remove_student/${username}/${courseName}/`,
			{
				method: 'post'
			}
		)
			.then(async (res) => {
				if (res.ok) {
					return right(await res.json())
				}
				return left(await res.text())
			})
			.catch((err: Error) => left(err.toString()))
	}

	async isAuthenticated(): Promise<boolean> {
		const isInEdx = await fetch(`${loginAPIEndpoint}/account/settings`, {
			credentials: 'include',
			redirect: 'error'
		})
			.then(() => true /* no redirects */)
			.catch(() => false)

		return isInEdx
	}
}

const requestsWrapper = new RequestsWrapper()

export default requestsWrapper

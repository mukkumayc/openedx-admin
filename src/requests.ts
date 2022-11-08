import { Either, left, mapLeft, right } from 'fp-ts/lib/Either'
import * as t from 'io-ts'

import { adminRoomAPIUrl, edxUrl } from './config'
import { CourseGradesC, FileLinksC, ICourseGrades, IFileLinks } from './types'
import { validationErrorsToString } from './utils'

interface StatusResponse {
	status: string
	message: string
}

async function _fetch<A>(
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

async function getStudents(
	course: string
): Promise<Either<string, { students: string[] }>> {
	return _fetch(
		`${adminRoomAPIUrl}/courses/get_students/${course}/`,
		'get',
		t.type({ students: t.array(t.string) })
	)
}

const _grades = (url: string): Promise<Either<string, ICourseGrades[]>> =>
	_fetch(url, 'get', t.array(CourseGradesC))

const gradesForStudent = (
	username: string,
	courseName: string
): Promise<Either<string, ICourseGrades[]>> =>
	_grades(`${adminRoomAPIUrl}/students/get_grades/${username}/${courseName}/`)

const gradesForCourse = (
	courseName: string
): Promise<Either<string, ICourseGrades[]>> =>
	_grades(`${adminRoomAPIUrl}/courses/get_grades/${courseName}/`)

async function getCourses(
	username: string
): Promise<Either<string, { courses: string[] }>> {
	const CoursesListC = t.type({
		courses: t.array(t.string)
	})

	return _fetch(
		`${adminRoomAPIUrl}/students/get_courses/${username}/`,
		'get',
		CoursesListC
	)
}

function fileLinks(
	username: string,
	course: string
): Promise<Either<string, IFileLinks>> {
	return _fetch(
		`${adminRoomAPIUrl}/courses/docs_loader/${course}/${username}/`,
		'get',
		FileLinksC
	)
}
async function addStudent(
	username: string,
	courseName: string
): Promise<Either<string, StatusResponse>> {
	const form = new FormData()
	form.append('username', username)
	form.append('course_name', courseName)
	return await fetch(
		`${adminRoomAPIUrl}/students/add_student/${username}/${courseName}/`,
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

async function removeStudent(
	username: string,
	courseName: string
): Promise<Either<string, StatusResponse>> {
	const form = new FormData()
	form.append('username', username)
	form.append('course_name', courseName)
	return await fetch(
		`${adminRoomAPIUrl}/students/remove_student/${username}/${courseName}/`,
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

async function isAuthenticated() {
	const isInEdx = await fetch(`${edxUrl}/account/settings`, {
		credentials: 'include',
		redirect: 'error'
	})
		.then(() => true /* no redirects */)
		.catch(() => false)

	return isInEdx
}

export {
	getStudents,
	gradesForStudent,
	gradesForCourse,
	getCourses,
	fileLinks,
	addStudent,
	removeStudent,
	isAuthenticated
}

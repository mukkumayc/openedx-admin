import { Either, left, right } from "fp-ts/lib/Either";
import * as t from "io-ts";
import { CourseGradesC, ICourseGrades } from "./types";

class RequestsWrapper {
  readonly serverUrl =
    "http://vmi625775.contaboserver.net:18000/admin_room/api/v1";

  async getStudents(course: string): Promise<Either<Error, string[]>> {
    return await fetch(`${this.serverUrl}/courses/get_students/${course}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((txt) => left(new Error(txt)));
        } else {
          return res.json().then((json) => {
            const decoded = t.type({ students: t.string }).decode(json);
            // if response json has structure {students: string}
            if (decoded._tag === "Right") {
              const studentsString = decoded.right.students;
              if (studentsString === "no students") {
                return right([]);
              }
              try {
                const decodedStudents = t
                  .array(t.string)
                  .decode(JSON.parse(studentsString.replaceAll("'", '"')));
                // if students in response json have structure string[]
                if (decodedStudents._tag === "Right") {
                  return decodedStudents;
                } else {
                  // if students in response json not string[]
                  return left(
                    new Error("Decode error, students field has wrong format")
                  );
                }
              } catch (err) {
                // JSON.parse thrown error
                return left(
                  new Error(`JSON parse error, string: '${studentsString}'`)
                );
              }
              // if response json isn't {students: string[]}
            } else {
              console.log(decoded.left);
              return left(
                new Error("Decode error, response json has wrong format")
              );
            }
          });
        }
      })
      .catch((err) => left(err));
  }

  private _getGrades = (url: string): Promise<Either<Error, ICourseGrades[]>> =>
    fetch(url, {
      credentials: "include",
    })
      .then(async (res) => {
        if (res.ok) {
          try {
            const json = await res.json();
            const decoded = t.array(CourseGradesC).decode(json);
            if (decoded._tag === "Right") {
              return decoded;
            } else {
              return left(new Error(`Decode error`));
            }
          } catch (err) {
            return left(
              new Error(`JSON parse error, response body: '${res.body}'`)
            );
          }
        } else {
          return res
            .text()
            .then((txt) => ({ _tag: "Left" as const, left: new Error(txt) }));
        }
      })
      .catch((err) => left(new Error(err.toString())));

  getGradesForStudent = (
    username: string,
    courseName: string
  ): Promise<Either<Error, ICourseGrades[]>> =>
    this._getGrades(
      `${this.serverUrl}/students/get_grades/${username}/${courseName}`
    );

  getGradesForCourse = (
    courseName: string
  ): Promise<Either<Error, ICourseGrades[]>> =>
    this._getGrades(`${this.serverUrl}/courses/get_grades/${courseName}`);

  async getCourses(username: string): Promise<Either<Error, string[]>> {
    return await fetch(`${this.serverUrl}/students/get_courses/${username}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          return res
            .text()
            .then((txt) => ({ _tag: "Left" as const, left: new Error(txt) }));
        } else {
          return res.json().then((json) => {
            const decoded = t.type({ students: t.string }).decode(json);
            // if response json has structure {students: string}
            if (decoded._tag === "Right") {
              const studentsString = decoded.right.students;
              if (studentsString === "no students") {
                return right([]);
              }
              try {
                const decodedStudents = t
                  .array(t.string)
                  .decode(JSON.parse(studentsString.replaceAll("'", '"')));
                // if students in response json have structure string[]
                if (decodedStudents._tag === "Right") {
                  return decodedStudents;
                } else {
                  // if students in response json not string[]
                  return left(
                    new Error("Decode error, students field has wrong format")
                  );
                }
              } catch (err) {
                // JSON.parse thrown error
                return left(
                  new Error(`JSON parse error, string: '${studentsString}'`)
                );
              }
              // if response json isn't {students: string[]}
            } else {
              console.log(decoded.left);
              return left(
                new Error("Decode error, response json has wrong format")
              );
            }
          });
        }
      })
      .catch((err) => left(err));
  }

  async addStudent(
    username: string,
    courseName: string
  ): Promise<Either<Error, string>> {
    const form = new FormData();
    form.append("username", username);
    form.append("course_name", courseName);
    return await fetch(`${this.serverUrl}/students/add_student`, {
      method: "post",
      credentials: "include",
      body: form,
    })
      .then(async (res) => {
        const txt = await res.text();
        return res.ok ? right(txt) : left(new Error(txt));
      })
      .catch((err) => left(new Error(err.toString())));
  }

  async deleteStudent(
    username: string,
    courseName: string
  ): Promise<Either<Error, string>> {
    const form = new FormData();
    form.append("username", username);
    form.append("course_name", courseName);
    return await fetch(`${this.serverUrl}/students/remove_student`, {
      method: "post",
      credentials: "include",
      body: form,
    })
      .then(async (res) => {
        const txt = await res.text();
        return res.ok ? right(txt) : left(new Error(txt));
      })
      .catch((err) => left(new Error(err.toString())));
  }
}

const requestsWrapper = new RequestsWrapper();

export default requestsWrapper;

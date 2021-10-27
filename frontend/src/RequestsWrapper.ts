import { mapLeft, fold, Either, left, right } from "fp-ts/lib/Either";
import * as t from "io-ts";
import { CourseGradesC, IFileLinks, ICourseGrades } from "./types";
import { hasOwnProperty, validationErrorsToString } from "./utils";

class RequestsWrapper {
  readonly serverUrl =
    "http://vmi625775.contaboserver.net:18000/admin_room/api/v1";

  async _fetch<A>(
    url: string,
    method: "get" | "post",
    validator: t.Decoder<unknown, A>
  ): Promise<Either<string, A>> {
    const res = await fetch(url, { method, credentials: "include" });

    if (!res.ok) {
      return left(await res.text());
    }

    try {
      const val = await (res.headers.get("Content-Type") === "application/json"
        ? res.json()
        : res.text());
      return mapLeft<t.ValidationError[], string>(validationErrorsToString)(
        validator.decode(val)
      );
    } catch (err) {
      return left((err as Error).toString());
    }
  }

  async getStudents(course: string): Promise<Either<string, string[]>> {
    const validate = (u: any): t.Validation<string[]> => {
      if (hasOwnProperty(u, "students") && typeof u.students === "string") {
        try {
          return t.array(t.string).decode(u.students);
        } catch (err) {
          return left([]);
        }
      }
      return left([]);
    };
    const StudentsListC: t.Type<string[]> = new t.Type(
      "StudentsList",
      (u): u is string[] =>
        fold(
          () => false,
          () => true
        )(validate(u)),
      validate,
      (a) => a
    );

    return this._fetch(
      `${this.serverUrl}/courses/get_students/${course}`,
      "get",
      StudentsListC
    );
  }

  private _grades = (url: string): Promise<Either<string, ICourseGrades[]>> =>
    this._fetch(url, "get", t.array(CourseGradesC));

  gradesForStudent = (
    username: string,
    courseName: string
  ): Promise<Either<string, ICourseGrades[]>> =>
    this._grades(
      `${this.serverUrl}/students/get_grades/${username}/${courseName}`
    );

  gradesForCourse = (
    courseName: string
  ): Promise<Either<string, ICourseGrades[]>> =>
    this._grades(`${this.serverUrl}/courses/get_grades/${courseName}`);

  async getCourses(username: string): Promise<Either<string, string[]>> {
    const validate = (u: any): t.Validation<string[]> => {
      if (hasOwnProperty(u, "courses") && typeof u.courses === "string") {
        try {
          return t.array(t.string).decode(u.courses);
        } catch (err) {
          return left([]);
        }
      }
      return left([]);
    };
    const CoursesListC: t.Type<string[]> = new t.Type(
      "CoursesList",
      (u): u is string[] =>
        fold(
          () => false,
          () => true
        )(validate(u)),
      validate,
      (a) => a
    );

    return this._fetch(
      `${this.serverUrl}/students/get_courses/${username}`,
      "get",
      CoursesListC
    );
  }

  fileLinks(
    username: string,
    course: string
  ): Promise<Either<string, IFileLinks>> {
    return new Promise((r) =>
      r(
        right({
          course_id: "dfafdafdasdsadgas",
          username: "kek",
          links: ["kek.com", "kek.com", "kek.com", "kek.com"],
        })
      )
    );
    // return this._fetch(
    //   `${this.serverUrl}/courses/docs_loader/${username}/${course}`,
    //   "get",
    //   FileLinksC
    // );
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

  async isAuthenticated(): Promise<boolean> {
    const isAdmin = await fetch(
      "http://vmi625775.contaboserver.net:18000/admin/",
      {
        credentials: "include",
      }
    ).then((res) => new URL(res.url).pathname === "/admin/" /* no redirects */);
    if (!isAdmin) {
      return false;
    }
    const isInEdx = await fetch(
      "http://vmi625775.contaboserver.net:18000/account/settings",
      {
        credentials: "include",
      }
    ).then(
      (res) =>
        new URL(res.url).pathname === "/account/settings" /* no redirects */
    );

    return isInEdx;
  }
}

const requestsWrapper = new RequestsWrapper();

export default requestsWrapper;

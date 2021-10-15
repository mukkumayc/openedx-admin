import * as t from "io-ts";
import { MessageModalProps } from "./components/MessageModal";

export interface AppProps {
  isAuthenticated: boolean;
  userHasAuthenticated(b: boolean): void;
  showMessage: CurriedFunction2<
    MessageModalProps["header"],
    MessageModalProps["body"],
    void
  >;
}

export interface ICourse {
  courseId: number;
  grades: ICourseGrades[];
}

export const CourseGradesC = t.type({
  course_id: t.string,
  email: t.string,
  user_id: t.number,
  username: t.string,
  passed: t.boolean,
  percent: t.number,
  letter_grade: t.union([t.null, t.string]),
  section_breakdown: t.array(
    t.type({
      attempted: t.boolean,
      category: t.string,
      is_graded: t.boolean,
      label: t.string,
      letter_grade: t.union([t.null, t.string]),
      module_id: t.string,
      percent: t.number,
      score_earned: t.number,
      score_possible: t.number,
      subsection_name: t.string,
    })
  ),
});

export type ICourseGrades = t.TypeOf<typeof CourseGradesC>;

export const EmailC = new t.Type<string, string, unknown>(
  "Email",
  (input: unknown): input is string =>
    typeof input === "string" &&
    /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      input
    ),
  (input, context) =>
    typeof input === "string" &&
    /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      input
    )
      ? t.success(input)
      : t.failure(input, context),
  t.identity
);

export const courseNames = [
  "Demonstration Course",
  "Xe Xe",
  "E2E Test Course",
] as const;

export const FileLinksC = t.type({
  course_id: t.string,
  username: t.string,
  links: t.array(t.string),
});

export type IFileLinks = t.TypeOf<typeof FileLinksC>;

export interface CurriedFunction2<T1, T2, R> {
  (t1: T1): (t2: T2) => R;
  (t1: T1, t2: T2): R;
}

export interface CurriedFunction3<T1, T2, T3, R> {
  (t1: T1): CurriedFunction2<T2, T3, R>;
  (t1: T1, t2: T2): (t3: T3) => R;
  (t1: T1, t2: T2, t3: T3): R;
}

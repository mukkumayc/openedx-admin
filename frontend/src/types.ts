export interface AppProps {
  isAuthenticated: boolean;
  userHasAuthenticated(b: boolean): void;
}

export interface IGrade {
  gradeName: string;
  grade: number;
}

export interface ICourse {
  courseId: number;
  grades: IGrade[];
}

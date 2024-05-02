export interface ResponseInterface {
  success: boolean;
  message: string;
}

export interface ApiResponseInterface<T> {
  success: boolean;
  message: string;
  data: T;
}

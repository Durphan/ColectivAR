export type ApiResponse<T> = {
  data: T;
  error?: string;
};

export type ErrorPayload = {
  error: string;
};

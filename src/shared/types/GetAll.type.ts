export type GetAll<T> = {
  paginate: { page: number; result: number };
  data: T | T[];
};

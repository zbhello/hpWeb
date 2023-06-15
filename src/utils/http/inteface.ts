interface IOption {
  method:
    | "get"
    | "post"
    | "put"
    | "delete"
    | "head"
    | "options"
    | "trace"
    | "copy";
  url?: string;
  params?: string;
  data?: string;
}

export type { IOption };

export declare type TMessageType = "info" | "success" | "warning" | "error" | "loading"
export interface TMessageBase {
  create: any
  destroyAll: any
  error: any
  info: any
  loading: any
  success: any
  warning: any
  [key: string]: any
}

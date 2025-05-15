import { type User as UserType } from "@wirralbears/types";

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}

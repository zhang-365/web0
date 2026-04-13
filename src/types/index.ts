export interface User {
  id: number;
  username: string;
  realName: string;
  roleId: number;
}

export interface LoginRes {
  token: string;
  user: User;
}
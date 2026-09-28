export interface IUser {
  id: number;
  name: string;
  lastname: string;
  email: string;
  verify: boolean;
  role: IRole;
}

interface IRole {
  id: number;
  name: string;
  permissions: IPermission[];
}

interface IPermission {
  id: number;
  resource: string;
  action: string;
}

//Auth

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  status: AuthStatus;
}

export interface AuthResponse {
  user: IUser;
  accessToken: string;
}

export interface CredentialsLogIn {
  email: string;
  password: string;
}

export interface CredentialsSignUp extends CredentialsLogIn {
  name: string;
  lastname: string;
}

export interface IErrorResponse {
  message?: string | string[];
}

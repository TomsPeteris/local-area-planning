export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: Omit<User, "password">;
}

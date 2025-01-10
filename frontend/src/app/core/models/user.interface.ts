export interface User {
  id: string;
  username: string;
  permissions: "resident" | "business" | "authority";
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  password?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: Omit<User, "password">;
}

export interface DecodedJwtPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "resident" | "business" | "authority";
  exp: number;
}

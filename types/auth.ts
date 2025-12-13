export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  id: number;
}

export interface User {
  id: number;
  username: string;
  roles: string[];
}
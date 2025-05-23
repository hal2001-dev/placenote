export interface User {
  id: string;
  email: string;
  nickname: string;
  created_at: string;
}

export interface UserCreateInput {
  email: string;
  password: string;
  nickname: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
} 
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export async function loginUser(_credentials: AuthCredentials): Promise<AuthResponse> {
  // TODO: implement POST ${API_BASE_URL}/auth/login
  throw new Error("Not implemented");
}

export async function registerUser(_credentials: AuthCredentials): Promise<AuthResponse> {
  // TODO: implement POST ${API_BASE_URL}/auth/register
  throw new Error("Not implemented");
}

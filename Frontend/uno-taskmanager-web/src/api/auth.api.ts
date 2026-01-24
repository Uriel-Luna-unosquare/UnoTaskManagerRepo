import httpClient from "./httpClient";

export interface LoginRequest {
  Username: string;
  Password: string;
}

export interface LoginResponse {
  token: string;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const { data: response } = await httpClient.post<LoginResponse>(
    "/auth/login",
    data
  );
  return response;
}
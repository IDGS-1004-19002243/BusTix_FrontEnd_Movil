// DTOs basados en el backend
export interface AuthResponseDto {
  token: string;
  isSuccess: boolean;
  message?: string;
  refreshToken: string;
}

export interface RefreshTokenDto {
  Email: string;
  RefreshToken: string;
}

export interface LoginDto {
  Email: string;
  Password: string;
}

export interface RegisterDto {
  EmailAddress: string;
  NombreCompleto: string;
  Password: string;
  Roles?: string[];
  TipoDocumento?: string;
  NumeroDocumento?: string;
}
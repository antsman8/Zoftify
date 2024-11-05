export interface IJwtPayload {
  id: string;
  email: string;
  type: 'access' | 'refresh';
} 
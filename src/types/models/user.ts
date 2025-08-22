export type User = {
  email: string;
  name: string;
  role: 'user' | 'admin';
  isActive: boolean;
  isEmailVerified: boolean;
};

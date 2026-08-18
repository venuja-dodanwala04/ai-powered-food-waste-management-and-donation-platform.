import { User, UserRole } from '../types';
import { apiRequest } from './apiClient';

interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  organization_name?: string;
  verification_status: 'VERIFIED' | 'PENDING';
  created_at: string;
}

interface AuthResponse {
  access_token: string;
  user: ApiUser;
}

const toUser = (user: ApiUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  role: user.role,
  branch: user.organization_name,
  verificationStatus: user.verification_status,
  createdAt: user.created_at,
});

class AuthService {
  getCurrentUser(): User | null {
    const saved = localStorage.getItem('ecokitchen_user');
    if (!saved) return null;
    try {
      return JSON.parse(saved) as User;
    } catch {
      this.logout();
      return null;
    }
  }

  private saveSession(response: AuthResponse): User {
    const user = toUser(response.user);
    localStorage.setItem('ecokitchen_token', response.access_token);
    localStorage.setItem('ecokitchen_user', JSON.stringify(user));
    return user;
  }

  async login(email: string, password: string): Promise<User> {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return this.saveSession(response);
  }

  async register(payload: { name: string; email: string; password: string; phone: string; address: string; role: UserRole; organizationName?: string }): Promise<User> {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        phone: payload.phone,
        address: payload.address,
        role: payload.role,
        organization_name: payload.organizationName,
      }),
    });
    return this.saveSession(response);
  }

  logout(): void {
    localStorage.removeItem('ecokitchen_token');
    localStorage.removeItem('ecokitchen_user');
  }
}

export const authService = new AuthService();

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  flat: string;
  role: 'Resident' | 'Committee Member' | 'Society Admin' | 'Security';
  societyName: string;
  token?: string;
}

export interface LoginRequest {
  identity: string; // Email or Mobile Number
  password: string;
  rememberMe: boolean;
}

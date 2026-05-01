const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...rest } = options;
  
  const headers = new Headers(rest.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers,
  }).catch(err => {
    console.error('Fetch error:', err);
    throw err;
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    console.error('API Error Response:', error);
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, token?: string) => 
    apiRequest<T>(endpoint, { method: 'GET', token }),
  
  post: <T>(endpoint: string, data: any, token?: string) => 
    apiRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(data), token }),
  
  put: <T>(endpoint: string, data: any, token?: string) => 
    apiRequest<T>(endpoint, { method: 'PUT', body: JSON.stringify(data), token }),
  
  delete: <T>(endpoint: string, token?: string) => 
    apiRequest<T>(endpoint, { method: 'DELETE', token }),
};

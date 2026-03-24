const API_URL = 'https://admin.wjecen.vip';

// 获取存储的 token
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// 通用请求方法
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
  
  const data = await res.json();
  
  if (!res.ok || data.code !== 200) {
    throw new Error(data.message || '请求失败');
  }
  
  return data.data;
}

// 用户相关 API
export const userApi = {
  // 发送验证码
  sendCode: (phone: string) => 
    request('/api/auth/send-code', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),
  
  // 手机号登录
  login: (phone: string, code: string) =>
    request<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    }),
  
  // 获取用户信息
  getProfile: () =>
    request<any>('/api/user/profile'),
  
  // 更新用户信息
  updateProfile: (data: { nickname?: string; avatar?: string }) =>
    request<any>('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// 充值相关 API
export const rechargeApi = {
  // 获取充值套餐
  getPackages: () =>
    request<any[]>('/api/recharge/packages'),
  
  // 创建订单
  createOrder: (packageId: string) =>
    request<any>('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ packageId }),
    }),
};

// 订单相关 API
export const orderApi = {
  // 获取订单列表
  getOrders: () =>
    request<any[]>('/api/orders'),
  
  // 获取订单详情
  getOrder: (id: string) =>
    request<any>(`/api/orders/${id}`),
};

export { API_URL };
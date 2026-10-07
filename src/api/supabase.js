// Client REST cho backend Supabase (Auth + bảng learning_progress + RPC save_learning_progress).
// Đây là ranh giới duy nhất giữa frontend và backend: UI không gọi fetch trực tiếp.
// Schema và quyền (RLS) của backend nằm ở supabase/schema.sql.
import { APP_CONFIG } from '../config.js';

const { supabaseUrl, supabaseKey } = APP_CONFIG;
export const isConfigured =
  /^https:\/\/[^/]+\.supabase\.co$/.test(supabaseUrl) && !!supabaseKey && !supabaseKey.startsWith('sb_secret_');

// Lỗi trả về có status (HTTP) và code (mã Supabase) để UI chọn lời nhắn phù hợp.
async function request(path, { method = 'GET', body, token } = {}) {
  if (!isConfigured) throw new Error('Cloud is not configured');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(supabaseUrl + path, {
      method,
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        apikey: supabaseKey,
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    });
    const result = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      const error = new Error('Request failed');
      error.status = response.status;
      error.code = result?.error_code || result?.code;
      throw error;
    }
    return result;
  } finally {
    clearTimeout(timeout);
  }
}

// Đăng nhập bằng mã một lần gửi qua email (OTP), không dùng mật khẩu.
export const authApi = {
  sendCode: (email, redirectTo) =>
    request('/auth/v1/otp' + (redirectTo ? '?redirect_to=' + encodeURIComponent(redirectTo) : ''), {
      method: 'POST',
      body: { email, create_user: true }
    }),
  verifyCode: (email, code) =>
    request('/auth/v1/verify', { method: 'POST', body: { email, token: code, type: 'email' } }),
  refresh: refreshToken =>
    request('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: refreshToken } }),
  getUser: accessToken => request('/auth/v1/user', { token: accessToken }),
  signOut: accessToken => request('/auth/v1/logout?scope=local', { method: 'POST', token: accessToken })
};

// Một hàng tiến độ cho mỗi người dùng; ghi qua RPC có so revision để phát hiện xung đột.
export const progressApi = {
  fetch: (userId, token) =>
    request('/rest/v1/learning_progress?select=payload,revision&user_id=eq.' + encodeURIComponent(userId), {
      token
    }),
  save: (payload, expectedRevision, token) =>
    request('/rest/v1/rpc/save_learning_progress', {
      method: 'POST',
      token,
      body: { p_payload: payload, p_expected_revision: expectedRevision }
    })
};

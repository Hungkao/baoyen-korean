// Cấu hình công khai từ biến môi trường Vite (.env). Chỉ Project URL và publishable/anon key;
// không bao giờ đặt service_role hoặc secret key vào frontend.
export const APP_CONFIG = Object.freeze({
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
});

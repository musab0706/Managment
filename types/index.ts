export interface User {
  id: string;
  student_id: string;
  school_email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  major: string;
  created_at: string;
}

export interface UserProfile {
  user_id: string;
  theme: 'light' | 'dark';
  notification_intensity: number; // 1-10
  sound_level: number; // 0-10, 0 = disabled
  vibration_level: number; // 1-10
  total_focus_points: number;
  total_focus_hours: number;
  total_sessions_completed: number;
  total_sessions_broken: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  color: string;
}

export interface UserSession {
  user_id: string;
  device_id: string;
  keep_logged_in: boolean;
  last_login: string;
  token: string;
}

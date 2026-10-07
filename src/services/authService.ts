export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  fullName?: string;
  createdAt?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  user: AuthUser;
}

const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};
const SUPABASE_URL = (env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY ?? '';
const SESSION_KEY = 'insight.auth.session.v1';

export const authConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

function headers(token?: string) {
  return {
    apikey: SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function mapUser(raw: any): AuthUser {
  return {
    id: raw?.id || '',
    email: raw?.email || undefined,
    phone: raw?.phone || undefined,
    fullName: raw?.user_metadata?.full_name || raw?.user_metadata?.name || undefined,
    createdAt: raw?.created_at || undefined,
  };
}

function mapSession(data: any): AuthSession {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_at,
    user: mapUser(data.user),
  };
}

async function request(path: string, init: RequestInit = {}) {
  if (!authConfigured) throw new Error('Customer authentication is not configured yet.');
  const res = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    ...init,
    headers: { ...headers(), ...(init.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.msg || data?.message || data?.error_description || 'Authentication request failed.');
  return data;
}

export function getStoredSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    if (!session?.accessToken || !session?.user?.id) return null;
    if (session.expiresAt && session.expiresAt * 1000 <= Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function storeSession(session: AuthSession | null, persistent = true) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  if (!session) return;
  const target = persistent ? localStorage : sessionStorage;
  target.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function signInWithEmail(email: string, password: string, persistent = true) {
  const data = await request('/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const session = mapSession(data);
  storeSession(session, persistent);
  return session;
}

export async function signUpWithEmail(fullName: string, email: string, password: string, phone?: string) {
  const data = await request('/signup', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      data: { full_name: fullName, phone: phone || undefined },
    }),
  });
  if (data.access_token) {
    const session = mapSession(data);
    storeSession(session);
    return { session, needsVerification: false };
  }
  return { session: null, needsVerification: true };
}

export async function sendPasswordReset(email: string) {
  return request('/recover', {
    method: 'POST',
    body: JSON.stringify({
      email,
      redirect_to: `${window.location.origin}/account/reset-password/`,
    }),
  });
}

export async function updatePassword(accessToken: string, password: string) {
  if (!authConfigured) throw new Error('Customer authentication is not configured yet.');
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: 'PUT',
    headers: headers(accessToken),
    body: JSON.stringify({ password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.msg || data?.message || 'Password update failed.');
  return data;
}

export async function sendPhoneOtp(phone: string) {
  return request('/otp', {
    method: 'POST',
    body: JSON.stringify({ phone, create_user: true }),
  });
}

export async function verifyPhoneOtp(phone: string, token: string) {
  const data = await request('/verify', {
    method: 'POST',
    body: JSON.stringify({ phone, token, type: 'sms' }),
  });
  const session = mapSession(data);
  storeSession(session);
  return session;
}

export function startGoogleSignIn(nextPath = '/account/') {
  if (!authConfigured) throw new Error('Google sign-in is not configured yet.');
  const redirectTo = `${window.location.origin}/account/login/?next=${encodeURIComponent(nextPath)}`;
  window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
}

export async function hydrateOAuthSessionFromUrl(): Promise<AuthSession | null> {
  if (typeof window === 'undefined') return null;
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  if (hash.get('type') === 'recovery') return getStoredSession();
  const accessToken = hash.get('access_token');
  if (!accessToken || !authConfigured) return getStoredSession();

  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: headers(accessToken) });
  if (!res.ok) return null;
  const rawUser = await res.json();
  const session: AuthSession = {
    accessToken,
    refreshToken: hash.get('refresh_token') || undefined,
    expiresAt: Number(hash.get('expires_at')) || undefined,
    user: mapUser(rawUser),
  };
  storeSession(session);
  window.history.replaceState({}, '', window.location.pathname + window.location.search);
  return session;
}

export async function signOut(session?: AuthSession | null) {
  try {
    if (authConfigured && session?.accessToken) {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: headers(session.accessToken),
      });
    }
  } finally {
    storeSession(null);
  }
}

import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, LockKeyhole, Mail, Phone, User, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';
import { Logo } from './Logo';
import {
  AuthSession,
  authConfigured,
  sendPasswordReset,
  sendPhoneOtp,
  signInWithEmail,
  signUpWithEmail,
  startGoogleSignIn,
  verifyPhoneOtp,
  updatePassword,
} from '../services/authService';

type Mode = 'login' | 'signup' | 'reset';

interface AuthScreenProps {
  mode: Mode;
  onAuthenticated: (session: AuthSession) => void;
  onNavigateMode: (mode: Mode) => void;
  onBackHome: () => void;
  nextPath?: string;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  mode,
  onAuthenticated,
  onNavigateMode,
  onBackHome,
  nextPath = '/account/',
}) => {
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [phone, setPhone] = useState('+92');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [phoneStage, setPhoneStage] = useState<'idle' | 'otp'>('idle');
  const [otp, setOtp] = useState('');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const recoveryParams = typeof window === 'undefined' ? new URLSearchParams() : new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const recoveryToken = recoveryParams.get('type') === 'recovery' ? recoveryParams.get('access_token') : null;
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const heading = useMemo(() => {
    if (mode === 'signup') return 'Create your account';
    if (mode === 'reset') return 'Reset your password';
    return 'Welcome back';
  }, [mode]);

  const normalizePhone = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('03')) return '+92' + cleaned.slice(1);
    return cleaned;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (!authConfigured) {
      setStatus({ type: 'info', text: 'Customer authentication is ready in the website code, but production credentials still need to be configured on the hosting environment.' });
      return;
    }
    try {
      setLoading(true);
      if (mode === 'reset') {
        if (recoveryToken) {
          if (newPassword.length < 8) throw new Error('New password must be at least 8 characters.');
          if (newPassword !== confirmNewPassword) throw new Error('Passwords do not match.');
          await updatePassword(recoveryToken, newPassword);
          window.history.replaceState({}, '', '/account/login/');
          setStatus({ type: 'success', text: 'Password updated successfully. You can now sign in.' });
          return;
        }
        if (!emailOrPhone.includes('@')) throw new Error('Enter a valid email address.');
        await sendPasswordReset(emailOrPhone.trim());
        setStatus({ type: 'success', text: 'Password reset instructions have been sent to your email.' });
        return;
      }
      if (mode === 'signup') {
        if (fullName.trim().length < 2) throw new Error('Please enter your full name.');
        if (!emailOrPhone.includes('@')) throw new Error('Enter a valid email address.');
        if (password.length < 8) throw new Error('Password must be at least 8 characters.');
        if (password !== confirmPassword) throw new Error('Passwords do not match.');
        if (!termsAccepted) throw new Error('Please accept the Terms & Privacy Policy.');
        const result = await signUpWithEmail(fullName.trim(), emailOrPhone.trim(), password, normalizePhone(phone));
        if (result.session) onAuthenticated(result.session);
        else setStatus({ type: 'success', text: 'Account created. Please verify your email before signing in.' });
      } else {
        if (!emailOrPhone.includes('@')) throw new Error('Enter your email address or use Phone login.');
        const session = await signInWithEmail(emailOrPhone.trim(), password, remember);
        onAuthenticated(session);
      }
    } catch (err) {
      setStatus({ type: 'error', text: err instanceof Error ? err.message : 'Unable to continue.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setStatus(null);
    if (!authConfigured) {
      setStatus({ type: 'info', text: 'Phone OTP is prepared, but the production authentication/SMS provider must be configured first.' });
      return;
    }
    try {
      setLoading(true);
      const normalized = normalizePhone(phone);
      if (!/^\+92\d{10}$/.test(normalized)) throw new Error('Enter a valid Pakistan mobile number, for example +923001234567.');
      await sendPhoneOtp(normalized);
      setPhone(normalized);
      setPhoneStage('otp');
      setStatus({ type: 'success', text: 'OTP sent. Enter the code to continue.' });
    } catch (err) {
      setStatus({ type: 'error', text: err instanceof Error ? err.message : 'Could not send OTP.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setStatus(null);
    try {
      setLoading(true);
      if (otp.trim().length < 4) throw new Error('Enter the OTP code.');
      const session = await verifyPhoneOtp(normalizePhone(phone), otp.trim());
      onAuthenticated(session);
    } catch (err) {
      setStatus({ type: 'error', text: err instanceof Error ? err.message : 'OTP verification failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[72vh] bg-[radial-gradient(circle_at_top_left,#eff6ff_0,#ffffff_42%,#f8fafc_100%)] py-10 sm:py-14">
      <div className="wrap max-w-6xl">
        <button onClick={onBackHome} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#073faf] mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to store
        </button>

        <div className="grid lg:grid-cols-[1.02fr_.98fr] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-blue-900/10">
          <div className="hidden lg:flex flex-col justify-between p-10 xl:p-14 bg-gradient-to-br from-[#052c86] via-[#073faf] to-[#0ea5e9] text-white">
            <Logo variant="white" className="h-11 w-auto max-w-[220px]" />
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                Secure customer account
              </span>
              <h2 className="text-4xl xl:text-5xl font-black leading-tight">Everything you save, order and love — in one place.</h2>
              <p className="text-blue-100 leading-relaxed max-w-lg">
                Manage your orders, wishlist, delivery details and shopping activity with one private Insight Store account.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              {['Private profile', 'Saved wishlist', 'Order history'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/15 bg-white/10 px-3 py-4 font-semibold">{item}</div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-9 lg:p-12 xl:p-14">
            <div className="max-w-md mx-auto">
              <div className="lg:hidden mb-7"><Logo className="h-10 w-auto" /></div>
              <p className="text-xs font-black tracking-[.18em] uppercase text-[#073faf] mb-2">Insight Store Account</p>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{heading}</h1>
              <p className="mt-3 text-sm text-slate-500">
                {mode === 'signup'
                  ? 'Create an account to keep your shopping details together.'
                  : mode === 'reset'
                  ? 'Enter your email and we will send password reset instructions.'
                  : 'Sign in to manage your orders, wishlist and account.'}
              </p>

              {mode !== 'reset' && (
                <div className="grid grid-cols-2 gap-2 mt-7 p-1 rounded-2xl bg-slate-100">
                  <button onClick={() => setAuthMethod('email')} className={`py-2.5 rounded-xl text-xs font-bold transition ${authMethod === 'email' ? 'bg-white shadow-sm text-[#073faf]' : 'text-slate-500'}`}>Email</button>
                  <button onClick={() => setAuthMethod('phone')} className={`py-2.5 rounded-xl text-xs font-bold transition ${authMethod === 'phone' ? 'bg-white shadow-sm text-[#073faf]' : 'text-slate-500'}`}>Phone OTP</button>
                </div>
              )}

              {status && (
                <div className={`mt-5 rounded-xl border px-4 py-3 text-sm ${status.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                  {status.text}
                </div>
              )}

              {(authMethod === 'email' || mode === 'reset') ? (
                <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
                  {mode === 'signup' && (
                    <label className="block">
                      <span className="text-xs font-bold text-slate-700">Full name</span>
                      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 px-3 bg-white focus-within:border-[#073faf]">
                        <User className="w-4 h-4 text-slate-400" />
                        <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full py-3 outline-none text-sm" placeholder="Your full name" />
                      </div>
                    </label>
                  )}

                  {mode === 'reset' && recoveryToken ? (
                    <>
                      <label className="block">
                        <span className="text-xs font-bold text-slate-700">New password</span>
                        <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 px-3 bg-white focus-within:border-[#073faf]">
                          <LockKeyhole className="w-4 h-4 text-slate-400" />
                          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full py-3 outline-none text-sm" placeholder="Minimum 8 characters" autoComplete="new-password" />
                        </div>
                      </label>
                      <label className="block">
                        <span className="text-xs font-bold text-slate-700">Confirm new password</span>
                        <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 px-3 bg-white focus-within:border-[#073faf]">
                          <KeyRound className="w-4 h-4 text-slate-400" />
                          <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="w-full py-3 outline-none text-sm" placeholder="Repeat new password" autoComplete="new-password" />
                        </div>
                      </label>
                    </>
                  ) : (
                    <label className="block">
                      <span className="text-xs font-bold text-slate-700">{mode === 'reset' ? 'Email address' : 'Email'}</span>
                      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 px-3 bg-white focus-within:border-[#073faf]">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <input value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} className="w-full py-3 outline-none text-sm" placeholder="you@example.com" autoComplete="email" />
                      </div>
                    </label>
                  )}

                  {mode === 'signup' && (
                    <label className="block">
                      <span className="text-xs font-bold text-slate-700">Phone number</span>
                      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 px-3 bg-white focus-within:border-[#073faf]">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full py-3 outline-none text-sm" placeholder="+923001234567" autoComplete="tel" />
                      </div>
                    </label>
                  )}

                  {mode !== 'reset' && (
                    <label className="block">
                      <span className="text-xs font-bold text-slate-700">Password</span>
                      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 px-3 bg-white focus-within:border-[#073faf]">
                        <LockKeyhole className="w-4 h-4 text-slate-400" />
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full py-3 outline-none text-sm" placeholder="Minimum 8 characters" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-700">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                      </div>
                    </label>
                  )}

                  {mode === 'signup' && (
                    <>
                      <label className="block">
                        <span className="text-xs font-bold text-slate-700">Confirm password</span>
                        <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 px-3 bg-white focus-within:border-[#073faf]">
                          <KeyRound className="w-4 h-4 text-slate-400" />
                          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full py-3 outline-none text-sm" placeholder="Repeat password" autoComplete="new-password" />
                        </div>
                      </label>
                      <label className="flex items-start gap-2 text-xs text-slate-500">
                        <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-0.5" />
                        I agree to the Terms of Service and Privacy Policy.
                      </label>
                    </>
                  )}

                  {mode === 'login' && (
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <label className="flex items-center gap-2 text-slate-500">
                        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                        Remember me
                      </label>
                      <button type="button" onClick={() => onNavigateMode('reset')} className="font-bold text-[#073faf] hover:underline">Forgot password?</button>
                    </div>
                  )}

                  <button disabled={loading} className="w-full rounded-xl bg-[#073faf] hover:bg-[#052f8e] disabled:opacity-60 text-white py-3.5 text-sm font-black shadow-lg shadow-blue-900/15">
                    {loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : mode === 'reset' ? (recoveryToken ? 'Update password' : 'Send reset link') : 'Sign in'}
                  </button>

                  {mode !== 'reset' && (
                    <>
                      <div className="flex items-center gap-3 py-1"><span className="h-px bg-slate-200 flex-1" /><span className="text-[11px] text-slate-400 font-semibold">OR</span><span className="h-px bg-slate-200 flex-1" /></div>
                      <button
                        type="button"
                        onClick={() => {
                          try { startGoogleSignIn(nextPath); }
                          catch (err) { setStatus({ type: 'info', text: err instanceof Error ? err.message : 'Google sign-in is unavailable.' }); }
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-3 text-sm font-bold text-slate-700 flex items-center justify-center gap-2"
                      >
                        <span className="font-black text-lg leading-none">G</span>
                        Continue with Google
                      </button>
                    </>
                  )}
                </form>
              ) : (
                <div className="mt-6 space-y-4">
                  <label className="block">
                    <span className="text-xs font-bold text-slate-700">Pakistan mobile number</span>
                    <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 px-3 bg-white focus-within:border-[#073faf]">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full py-3 outline-none text-sm" placeholder="+923001234567" autoComplete="tel" />
                    </div>
                  </label>
                  {phoneStage === 'otp' && (
                    <label className="block">
                      <span className="text-xs font-bold text-slate-700">OTP code</span>
                      <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-center tracking-[.35em] font-black outline-none focus:border-[#073faf]" placeholder="------" inputMode="numeric" />
                    </label>
                  )}
                  <button onClick={phoneStage === 'otp' ? handleVerifyOtp : handleSendOtp} disabled={loading} className="w-full rounded-xl bg-[#073faf] hover:bg-[#052f8e] disabled:opacity-60 text-white py-3.5 text-sm font-black">
                    {loading ? 'Please wait...' : phoneStage === 'otp' ? 'Verify & continue' : 'Send OTP'}
                  </button>
                  {phoneStage === 'otp' && <button onClick={() => setPhoneStage('idle')} className="w-full text-xs font-bold text-slate-500 hover:text-[#073faf]">Change phone number</button>}
                </div>
              )}

              <div className="mt-7 text-center text-sm text-slate-500">
                {mode === 'signup' ? (
                  <>Already have an account? <button onClick={() => onNavigateMode('login')} className="font-black text-[#073faf] hover:underline">Sign in</button></>
                ) : mode === 'reset' ? (
                  <button onClick={() => onNavigateMode('login')} className="font-black text-[#073faf] hover:underline">Back to sign in</button>
                ) : (
                  <>New to Insight Store? <button onClick={() => onNavigateMode('signup')} className="font-black text-[#073faf] hover:underline">Create account</button></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

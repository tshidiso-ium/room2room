'use client';

import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Eye,
  EyeOff,
  LogIn,
  Phone,
  ShieldCheck,
  UserRound,
  UserPlus,
} from 'lucide-react';

import { app } from '../../lib/firebaseClient';
import { upsertAgentProfile } from '@/app/lib/agentProfile';

const inputClass =
  'w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-500';

export default function AdminLogin() {
  const [mode, setMode] = useState('signin');
  const [fullName, setFullName] = useState('');
  const [agency, setAgency] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const auth = getAuth(app);
  const isSignup = mode === 'signup';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        await updateProfile(credential.user, {
          displayName: fullName.trim(),
        });

        await upsertAgentProfile(credential.user, {
          name: fullName,
          agency,
          phone,
          email,
        });

      } else {
        const credential = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

       await upsertAgentProfile(credential.user);
      }
       console.log("about to go to dashboard");
      router.push('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError(
        isSignup
          ? 'Could not create your agent profile. Please check your details.'
          : 'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-10"
      style={{
        backgroundImage:
          "url('https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fbanner_hero.jpeg?alt=media&token=83011ded-d699-4af7-a74c-5c930c19870d')",
      }}
    >
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/90 p-8 shadow-2xl backdrop-blur-xl dark:bg-slate-800/90">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            {isSignup ? (
              <UserPlus className="h-6 w-6" />
            ) : (
              <ShieldCheck className="h-6 w-6" />
            )}
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isSignup ? 'Create agent profile' : 'Agent sign in'}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {isSignup
              ? 'Set up your profile before posting listings.'
              : 'Manage the listings posted from your profile.'}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
            }}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
              !isSignup
                ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
              isSignup
                ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignup && (
            <>
              <IconField icon={<UserRound className="h-4 w-4" />}>
                <input
                  type="text"
                  placeholder="Full name"
                  className={`${inputClass} pl-11`}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </IconField>

              <IconField icon={<Building2 className="h-4 w-4" />}>
                <input
                  type="text"
                  placeholder="Agency or company"
                  className={`${inputClass} pl-11`}
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                />
              </IconField>

              <IconField icon={<Phone className="h-4 w-4" />}>
                <input
                  type="tel"
                  placeholder="WhatsApp number"
                  className={`${inputClass} pl-11`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </IconField>
            </>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={isSignup ? 'Create a password' : 'Enter your password'}
                className={`${inputClass} pr-12`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-700/10 dark:text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            {isSignup ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {loading
              ? isSignup
                ? 'Creating profile...'
                : 'Signing in...'
              : isSignup
              ? 'Create profile'
              : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Each agent can only manage listings attached to their own profile.
        </p>
      </div>
    </main>
  );
}

function IconField({ icon, children }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-300">
        {icon}
      </span>
      {children}
    </div>
  );
}

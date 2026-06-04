'use client';

import { useState } from 'react';

export default function RecoverPassword() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');

  async function verifyEmail() {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setStep(2);
    } catch (err) {
      console.log(err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword() {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            otp,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert('Password updated successfully');
      window.location.href = '/login';
    } catch (err) {
      console.log(err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">
          Recover Password
        </h1>

        {step === 1 && (
          <>
            <label className="block mb-2 text-sm font-medium dark:text-gray-300">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border dark:border-zinc-700 dark:bg-zinc-800 dark:text-white mb-4"
            />

            <button
              onClick={verifyEmail}
              disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="block mb-2 text-sm font-medium dark:text-gray-300">
              Verification Code
            </label>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border dark:border-zinc-700 dark:bg-zinc-800 dark:text-white mb-4"
            />

            <label className="block mb-2 text-sm font-medium dark:text-gray-300">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border dark:border-zinc-700 dark:bg-zinc-800 dark:text-white mb-4"
            />

            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold"
            >
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
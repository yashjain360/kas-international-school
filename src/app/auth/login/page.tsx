'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  Lock,
  Mail,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Users,
  Check,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, loginWithGoogle, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState<'admin' | 'faculty' | 'student'>('admin');

  // Fast Test Account Roster for QA
  const testAccounts = {
    admin: [
      {
        name: 'Surendra Singh Baghel',
        email: 'admin.director@kasinternationalschool.org',
        pass: 'KasAdmin@2026',
        desc: 'Managing Director & Chairman',
      },
      {
        name: 'Dr. Sunita Sharma',
        email: 'admin.principal@kasinternationalschool.org',
        pass: 'KasAdmin@2026',
        desc: 'Principal & Academic Dean',
      },
      {
        name: 'Rajesh Varma',
        email: 'admin.finance@kasinternationalschool.org',
        pass: 'KasAdmin@2026',
        desc: 'Head of Accounts & Bursar',
      },
      {
        name: 'Ananya Dixit',
        email: 'admin.admissions@kasinternationalschool.org',
        pass: 'KasAdmin@2026',
        desc: 'Lead Admission Counselor',
      },
      {
        name: 'Vikramaditya Rao',
        email: 'admin.operations@kasinternationalschool.org',
        pass: 'KasAdmin@2026',
        desc: 'Campus Operations & IT Admin',
      },
    ],
    faculty: [
      {
        name: 'Prof. Meenakshi Iyer',
        email: 'faculty.science@kasinternationalschool.org',
        pass: 'KasFaculty@2026',
        desc: 'Head of Science & Physics',
      },
      {
        name: 'Rohan Saxena',
        email: 'faculty.math@kasinternationalschool.org',
        pass: 'KasFaculty@2026',
        desc: 'Senior Mathematics Specialist',
      },
      {
        name: 'Pooja Deshmukh',
        email: 'faculty.english@kasinternationalschool.org',
        pass: 'KasFaculty@2026',
        desc: 'Head of Languages & Literature',
      },
      {
        name: 'Amitabh Sen',
        email: 'faculty.social@kasinternationalschool.org',
        pass: 'KasFaculty@2026',
        desc: 'Social Sciences & History In-Charge',
      },
      {
        name: 'Kavita Chawla',
        email: 'faculty.primary@kasinternationalschool.org',
        pass: 'KasFaculty@2026',
        desc: 'Primary Wing Coordinator',
      },
    ],
    student: [
      {
        name: 'Aarav Patel (Grade 10-A)',
        email: 'student.aarav@kasinternationalschool.org',
        pass: 'KasStudent@2026',
        desc: 'Admission No: KAS2026-1001',
      },
      {
        name: 'Diya Sengupta (Grade 9-B)',
        email: 'student.diya@kasinternationalschool.org',
        pass: 'KasStudent@2026',
        desc: 'Admission No: KAS2026-1002',
      },
      {
        name: 'Kabir Mehta (Grade 8-A)',
        email: 'student.kabir@kasinternationalschool.org',
        pass: 'KasStudent@2026',
        desc: 'Admission No: KAS2026-1003',
      },
      {
        name: 'Ananya Shukla (Grade 6-C)',
        email: 'student.ananya@kasinternationalschool.org',
        pass: 'KasStudent@2026',
        desc: 'Admission No: KAS2026-1004',
      },
      {
        name: 'Vihaan Joshi (Grade 4-A)',
        email: 'student.vihaan@kasinternationalschool.org',
        pass: 'KasStudent@2026',
        desc: 'Admission No: KAS2026-1005',
      },
    ],
  };

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') router.push('/erp/admin/dashboard');
      else if (user.role === 'faculty') router.push('/erp/faculty/dashboard');
      else router.push('/erp/student/dashboard');
    }
  }, [user, router]);

  // Google OAuth initialization
  useEffect(() => {
    /* global google */
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      const clientId =
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
        '58469047666-bi3023asm478tntctln3lbg7vvkqgdc4.apps.googleusercontent.com';

      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          if (response.credential) {
            setSubmitting(true);
            const res = await loginWithGoogle(response.credential);
            setSubmitting(false);
            if (res.success && res.user) {
              if (res.user.role === 'admin') router.push('/erp/admin/dashboard');
              else if (res.user.role === 'faculty') router.push('/erp/faculty/dashboard');
              else router.push('/erp/student/dashboard');
            } else {
              setError(res.error || 'Google Sign-In failed');
            }
          }
        },
      });

      const btn = document.getElementById('googleSignInBtn');
      if (btn) {
        (window as any).google.accounts.id.renderButton(btn, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
        });
      }
    }
  }, [loginWithGoogle, router]);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success && res.user) {
      if (res.user.role === 'admin') router.push('/erp/admin/dashboard');
      else if (res.user.role === 'faculty') router.push('/erp/faculty/dashboard');
      else router.push('/erp/student/dashboard');
    } else {
      setError(res.error || 'Invalid credentials.');
    }
  };

  const handleQuickSelect = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Verifying institutional credentials...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-8 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0F2942] to-[#1E3A8A] flex items-center justify-center text-amber-400 font-bold shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#0F2942]">K.A.S. INTERNATIONAL</span>
          </Link>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Unified Management ERP & Scholastic Portal
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Login Card */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Sign In to Your Portal</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Access Admin ERP, Faculty Gradebooks, or Student Fee Records
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 text-red-900 border border-red-200 text-xs flex items-start space-x-2">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Google One-Tap / Button */}
            <div>
              <div id="googleSignInBtn" className="w-full flex justify-center"></div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-slate-200"></div>
              <span className="shrink mx-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Or Sign In with Credentials
              </span>
              <div className="grow border-t border-slate-200"></div>
            </div>

            {/* Manual Form */}
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Institutional Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="user@kasinternationalschool.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Account Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0F2942] hover:bg-blue-900 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>{submitting ? 'Verifying Account...' : 'Sign In to Portal'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: 1-Click QA Account Switcher */}
          <div className="lg:col-span-6 bg-linear-to-b from-slate-900 to-[#0F2942] text-white p-6 sm:p-7 rounded-2xl shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">1-Click QA Test Switcher</h3>
              </div>
              <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-md">
                15 Pre-Seeded Accounts
              </span>
            </div>

            {/* Role Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-800/80 rounded-xl">
              {(['admin', 'faculty', 'student'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRoleTab(r)}
                  className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    activeRoleTab === r
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {r} (5)
                </button>
              ))}
            </div>

            {/* Account List */}
            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {testAccounts[activeRoleTab].map((acc, idx) => (
                <div
                  key={idx}
                  onClick={() => handleQuickSelect(acc.email, acc.pass)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                    email === acc.email
                      ? 'bg-amber-500/20 border-amber-400'
                      : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="space-y-0.5 max-w-[240px]">
                    <p className="font-bold text-xs text-white group-hover:text-amber-300">{acc.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{acc.email}</p>
                    <p className="text-[10px] text-amber-400 font-medium">{acc.desc}</p>
                  </div>

                  <button
                    type="button"
                    className="bg-white/10 group-hover:bg-amber-500 group-hover:text-slate-950 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all"
                  >
                    {email === acc.email ? 'Selected' : 'Use'}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-800">
              Click any account above to autofill, then click <strong>Sign In</strong> to test full ERP features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

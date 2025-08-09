'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Nfc, CreditCard, Shield } from 'lucide-react';

export default function LandingPage() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    // Simulate Google OAuth flow - your teammate will implement actual auth
    setTimeout(() => {
      setIsSigningIn(false);
      router.push('/home');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* App Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Nfc className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PayNFC</h1>
          <p className="text-gray-600">Instant payments with NFC & contacts</p>
        </div>

        {/* Features Preview */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-700">Pay your Google contacts instantly</span>
          </div>
          <div className="flex items-center space-x-3">
            <Nfc className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-700">Tap NFC cards for quick payments</span>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-700">Secure Face ID authentication</span>
          </div>
          <div className="flex items-center space-x-3">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-700">Track transaction history & score</span>
          </div>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-3 disabled:opacity-50"
        >
          {isSigningIn ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

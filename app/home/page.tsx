'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Nfc, CreditCard, TrendingUp, Award, Info } from 'lucide-react';
import ScoreCard from '../components/ScoreCard';
import HowToUse from '../components/HowToUse';
import { signInAndGetContacts } from "@/lib/firebase";

export default function HomePage() {
  const router = useRouter();
  const [userScore, setUserScore] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState(12);

  // Simulate loading user data
  useEffect(() => {
    // Your teammate will replace this with actual API calls
    setUserScore(750); // Credit score based on transaction history
    setRecentTransactions(12);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">PayNFC</h1>
            <p className="text-sm text-gray-600">Welcome back!</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">MG</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Score Card */}
        <ScoreCard score={userScore} recentTransactions={recentTransactions} />

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Pay Contacts */}
            <button
              onClick={async () => {
		      try{
			      const contacts = await signInAndGetContacts();
			      console.log("Fetched Contacts:", contacts);
			      router.push('/contacts');
		      } catch (err) {
			      console.error("Error fetching contacts:", err);
		      }
	      }}
	      className="bg-blue-50 hover:bg-blue-100 p-4 rounded-xl transition-colors">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-sm font-semibold text-gray-900">Pay Contacts</p>
              <p className="text-xs text-gray-600">From Google Contacts</p>
            </button>

            {/* NFC Payment */}
            <button
              onClick={() => router.push('/transaction?mode=nfc')}
              className="bg-green-50 hover:bg-green-100 p-4 rounded-xl transition-colors"
            >
              <Nfc className="w-8 h-8 text-green-600 mb-2" />
              <p className="text-sm font-semibold text-gray-900">NFC Payment</p>
              <p className="text-xs text-gray-600">Tap & Pay</p>
            </button>
          </div>
        </div>

        {/* How to Use Section */}
        <HowToUse />

        {/* Recent Activity Preview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-600">2 hours ago</p>
              </div>
              <span className="text-sm font-semibold text-red-600">-0.05 ETH</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Sarah Wilson</p>
                <p className="text-xs text-gray-600">1 day ago</p>
              </div>
              <span className="text-sm font-semibold text-red-600">-0.02 ETH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

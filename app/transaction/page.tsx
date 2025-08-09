import { Suspense } from 'react';
import TransactionContent from './TransactionContent';

// Loading fallback component
function TransactionLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-md mx-auto">
        <div className="card">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Processing NFC payment data...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page with Suspense boundary
export default function TransactionPage() {
  return (
    <Suspense fallback={<TransactionLoading />}>
      <TransactionContent />
    </Suspense>
  );
}

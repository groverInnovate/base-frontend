'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ContactsList from '../components/ContactsList';
import { ArrowLeft, Search } from 'lucide-react';

// Mock Google Contacts data - your teammate will replace with actual Google Contacts API
const mockContacts = [
  { id: '1', name: 'John Doe', email: 'john@gmail.com', walletAddress: '0x742d35Cc6634C0532925a3b8D4bC5DbFADbE7c72' },
  { id: '2', name: 'Sarah Wilson', email: 'sarah@gmail.com', walletAddress: '0x61F98b58328191a8ed2EAFE1Ed017d379Ba39a4B' },
  { id: '3', name: 'Mike Johnson', email: 'mike@gmail.com', walletAddress: '0x8ba1f109551bD432803012645Hac136c91DCF43F' },
  { id: '4', name: 'Emily Davis', email: 'emily@gmail.com', walletAddress: '0x123d35Cc6634C0532925a3b8D4bC5DbFADbE9876' },
  { id: '5', name: 'Alex Chen', email: 'alex@gmail.com', walletAddress: '0x456d35Cc6634C0532925a3b8D4bC5DbFADbE5432' },
];

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading Google Contacts
    setTimeout(() => {
      setContacts(mockContacts);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSelect = (contact: any) => {
    // Navigate to transaction page with pre-filled address
    router.push(`/transaction?address=${contact.walletAddress}&name=${encodeURIComponent(contact.name)}&mode=contact`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4">
        <div className="max-w-md mx-auto flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Select Contact</h1>
            <p className="text-sm text-gray-600">Pay your Google contacts</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Contacts List */}
        <ContactsList
          contacts={filteredContacts}
          isLoading={isLoading}
          onContactSelect={handleContactSelect}
        />
      </div>
    </div>
  );
}

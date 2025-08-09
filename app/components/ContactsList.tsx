import { User, ExternalLink } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
}

interface ContactsListProps {
  contacts: Contact[];
  isLoading: boolean;
  onContactSelect: (contact: Contact) => void;
}

export default function ContactsList({ contacts, isLoading, onContactSelect }: ContactsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No contacts found</p>
        <p className="text-sm text-gray-500">Try searching with a different term</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <button
          key={contact.id}
          onClick={() => onContactSelect(contact)}
          className="w-full bg-white rounded-xl p-4 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{contact.name}</p>
              <p className="text-sm text-gray-600 truncate">{contact.email}</p>
              <p className="text-xs text-gray-500 truncate">
                {contact.walletAddress.slice(0, 10)}...{contact.walletAddress.slice(-8)}
              </p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </div>
        </button>
      ))}
    </div>
  );
}

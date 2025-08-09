import { Info, Users, Nfc, Shield, CreditCard } from 'lucide-react';

export default function HowToUse() {
  const steps = [
    {
      icon: <Users className="w-5 h-5 text-blue-600" />,
      title: "Choose Contact",
      description: "Select from your Google contacts or use NFC"
    },
    {
      icon: <CreditCard className="w-5 h-5 text-green-600" />,
      title: "Enter Amount",
      description: "Type the ETH amount you want to send"
    },
    {
      icon: <Shield className="w-5 h-5 text-purple-600" />,
      title: "Face ID Auth",
      description: "Secure authentication with Face ID"
    },
    {
      icon: <Nfc className="w-5 h-5 text-orange-600" />,
      title: "Transaction Done",
      description: "Payment sent instantly on Base network"
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Info className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">How to Use</h2>
      </div>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
              {step.icon}
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{step.title}</p>
              <p className="text-xs text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

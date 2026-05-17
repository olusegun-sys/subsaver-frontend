import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <CreditCard className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">SubSaver</span>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>
          </div>
        </div>
      </nav>

      {/* Privacy Policy Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: May 17, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 mb-4">SubSaver collects the following information:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Email address and account credentials (for authentication)</li>
              <li>Bank transaction data (read-only access via Mono API)</li>
              <li>Subscription information derived from your transactions</li>
              <li>Usage data to improve our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Identify and track your subscriptions</li>
              <li>Provide cancellation assistance</li>
              <li>Send renewal reminders (with your consent)</li>
              <li>Improve our subscription detection algorithms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Bank Data & Mono Integration</h2>
            <p className="text-gray-600 mb-4">
              SubSaver uses Mono to connect to your bank account. We only request read-only access — 
              we cannot move, transfer, or withdraw money from your account. Your bank credentials 
              are never stored on our servers. Mono handles all bank-level security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Storage & Security</h2>
            <p className="text-gray-600 mb-4">
              Your data is stored on Supabase, a secure, encrypted database service. We implement 
              industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Encryption at rest and in transit</li>
              <li>Row Level Security (RLS) policies</li>
              <li>Regular security audits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Data Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not sell your personal data. We share data only with:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Mono (to facilitate bank connections)</li>
              <li>Supabase (to host your data securely)</li>
              <li>Legal authorities if required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Your Rights</h2>
            <p className="text-gray-600 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Access your personal data</li>
              <li>Request deletion of your data</li>
              <li>Disconnect your bank account at any time</li>
              <li>Export your subscription data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Contact Us</h2>
            <p className="text-gray-600">
              If you have questions about this Privacy Policy, contact us at:{" "}
              <a href="mailto:privacy@subsaver.com" className="text-blue-600 hover:underline">
                privacy@subsaver.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>© 2026 SubSaver. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
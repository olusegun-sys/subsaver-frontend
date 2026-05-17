import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
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

      {/* Terms of Service Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: May 17, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By using SubSaver, you agree to these Terms of Service. If you do not agree, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Description of Service</h2>
            <p className="text-gray-600">
              SubSaver helps you track, manage, and cancel subscriptions by connecting to your bank account 
              via Mono API. We provide read-only access to identify recurring payments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Account Responsibility</h2>
            <p className="text-gray-600">
              You are responsible for maintaining the security of your account. SubSaver is not liable for 
              unauthorized access to your account due to compromised credentials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Bank Connection & Mono</h2>
            <p className="text-gray-600 mb-4">
              SubSaver uses Mono to connect to your bank account. By using our service, you agree to Mono's 
              Terms of Service. We only request read-only access:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>We cannot move, transfer, or withdraw money from your account</li>
              <li>We cannot see your login credentials</li>
              <li>You can disconnect your bank at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Subscription Cancellation</h2>
            <p className="text-gray-600">
              SubSaver provides guidance and tools to help you cancel subscriptions. However, you are ultimately 
              responsible for contacting merchants and confirming cancellation. SubSaver is not liable for 
              failed cancellations or continued charges.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Premium Subscription</h2>
            <p className="text-gray-600 mb-4">
              Premium features require a monthly or annual subscription fee:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Monthly: ?2,000/month</li>
              <li>Annual: ?20,000/year (save ?4,000)</li>
              <li>Payments are non-refundable</li>
              <li>You can cancel your Premium subscription at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-600">
              SubSaver is provided "as is" without warranties. We are not liable for any financial losses, 
              missed cancellations, or damages arising from use of our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Changes to Terms</h2>
            <p className="text-gray-600">
              We may update these Terms at any time. Continued use of SubSaver constitutes acceptance of 
              the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Contact</h2>
            <p className="text-gray-600">
              Questions about these Terms? Contact us at:{" "}
              <a href="mailto:legal@subsaver.com" className="text-blue-600 hover:underline">
                legal@subsaver.com
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
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowRight, CheckCircle, Wallet, Eye, Zap, Users } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <CreditCard className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">SubSaver</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleGetStarted} className="text-gray-600 hover:text-gray-900 transition">Log in</button>
              <button onClick={handleGetStarted} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">Sign Up</button>
            </div>
          </div>
        </div>
      </nav>

      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">The money app that works for you</h1>
          <p className="text-3xl md:text-4xl font-bold text-blue-600 mb-6">Know where your money goes. Cancel what you don't need.</p>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">Managing money is hard, but you don't have to do it alone. Subsaver empowers you to save more, spend less, see everything, and take back control of your financial life.</p>
          <button onClick={handleGetStarted} className="bg-blue-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2">Take control of my finances <ArrowRight className="w-5 h-5" /></button>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p>© 2026 Subsaver. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
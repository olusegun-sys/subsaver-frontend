import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  ArrowRight, 
  CheckCircle, 
  Wallet, 
  Eye, 
  Zap,
  Sparkles,
  Users,
  Shield
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <CreditCard className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">SubSaver</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleGetStarted} 
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Log in
              </button>
              <button 
                onClick={handleGetStarted} 
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* SECTION 1: HERO - Full viewport height */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            The money app that works for you
          </h1>
          <p className="text-3xl md:text-4xl font-bold text-blue-600 mb-6">
            Know where your money goes. Cancel what you don't need.
          </p>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Managing money is hard, but you don't have to do it alone. Subsaver empowers you 
            to save more, spend less, see everything, and take back control of your financial life.
          </p>
          <button 
            onClick={handleGetStarted}
            className="bg-blue-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2"
          >
            Take control of my finances <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* SECTION 2: SOCIAL PROOF BANNER */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <Users className="w-5 h-5" />
            <span className="font-semibold">Join 50+ members</span>
          </div>
          <p className="text-2xl text-gray-700 max-w-3xl mx-auto">
            We're helping Nigerians find and cancel forgotten subscriptions, 
            saving thousands of naira every month.
          </p>
        </div>
      </section>

      {/* SECTION 3: PROBLEM + SOLUTION */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Get control over your subscriptions
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Subsaver instantly finds and tracks your subscriptions. 
                We're there when you need us to cancel services so you don't have to.
              </p>
              <button 
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2"
              >
                Manage my subscriptions <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-32 h-32 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS (3 STEPS) */}
      <section className="bg-gray-50 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How Subsaver works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Wallet className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Connect Your Bank</h3>
              <p className="text-gray-600">
                Securely link your bank account via Mono. Takes less than 60 seconds.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Eye className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. See Everything</h3>
              <p className="text-gray-600">
                Subsaver scans your transactions and shows all subscriptions in one place.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Zap className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Cancel & Save</h3>
              <p className="text-gray-600">
                Spot forgotten subscriptions, cancel with one click, save money immediately.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: CALL TO ACTION (Replaces Waitlist) */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to stop wasting money?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join other Nigerians taking control of their subscriptions. 
            Start saving today — it's free.
          </p>
          <button 
            onClick={handleGetStarted}
            className="bg-blue-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2"
          >
            Get Started Now <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-sm text-gray-500 mt-4">Free to start • Cancel anytime • No spam</p>
        </div>
      </section>

      {/* SECTION 6: PREMIUM TEASER */}
      <section className="bg-gray-50 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Get more from your finances with Subsaver Premium
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Without Premium */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-500 mb-6">Without Premium</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-gray-400" /> Account linking
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-gray-400" /> Subscription management
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-gray-400" /> Spend tracking
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <CheckCircle className="w-5 h-5" /> Up to 5 subscriptions
                </li>
              </ul>
            </div>

            {/* With Premium */}
            <div className="bg-blue-600 rounded-2xl p-8 shadow-lg text-white">
              <div className="inline-block bg-blue-500 text-xs px-3 py-1 rounded-full mb-4">?2,000/month</div>
              <h3 className="text-xl font-bold mb-6">With Premium</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" /> Unlimited subscriptions
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" /> Renewal reminders via email/SMS
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" /> Spending analytics
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" /> Family sharing
                </li>
              </ul>
            </div>

          </div>
          
          <div className="text-center mt-8">
            <button 
              onClick={handleGetStarted}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Explore Premium
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 7: FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-6 h-6 text-blue-500" />
                <span className="text-white font-bold text-lg">SubSaver</span>
              </div>
              <p className="text-sm">Helping Nigerians save money from forgotten subscriptions.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={handleGetStarted} className="hover:text-white transition">Features</button></li>
                <li><button onClick={handleGetStarted} className="hover:text-white transition">Pricing</button></li>
                <li><button onClick={handleGetStarted} className="hover:text-white transition">How it works</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={handleGetStarted} className="hover:text-white transition">About</button></li>
                <li><button onClick={handleGetStarted} className="hover:text-white transition">Contact</button></li>
                <li><a href="/privacy" className="hover:text-white transition">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={handleGetStarted} className="hover:text-white transition">Help center</button></li>
                <li><button onClick={handleGetStarted} className="hover:text-white transition">Security</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            <p className="mb-2">
              Banking services provided by Mono. Subscription data is read-only—we cannot move your money.
            </p>
            <p>© 2026 Subsaver. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
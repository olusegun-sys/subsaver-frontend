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
  Shield,
  TrendingUp,
  Bell,
  Star,
  Menu,
  X,
  Twitter,
  Instagram,
  Facebook
} from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    navigate('/login');
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-1.5 rounded-xl">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                SubSaver
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-blue-600 transition font-medium">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-blue-600 transition font-medium">How It Works</button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-blue-600 transition font-medium">Pricing</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-blue-600 transition font-medium">Testimonials</button>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button onClick={handleGetStarted} className="text-gray-600 hover:text-gray-900 transition font-medium">Log in</button>
              <button onClick={handleGetStarted} className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                Get Started
              </button>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition">
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 py-4">
            <div className="flex flex-col space-y-3 px-4">
              <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-blue-600 transition py-2 font-medium">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-blue-600 transition py-2 font-medium">How It Works</button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-blue-600 transition py-2 font-medium">Pricing</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-blue-600 transition py-2 font-medium">Testimonials</button>
              <hr className="my-2" />
              <button onClick={handleGetStarted} className="text-gray-600 hover:text-gray-900 transition py-2 font-medium">Log in</button>
              <button onClick={handleGetStarted} className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Trusted by early users</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              The money app that
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> works for you</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-4 font-semibold">
              Know where your money goes. Cancel what you don't need.
            </p>
            
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
              Managing money is hard, but you don't have to do it alone. Subsaver empowers you 
              to save more, spend less, see everything, and take back control of your financial life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleGetStarted} className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
                Take control of my finances <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-400 mt-6">Free to start • Cancel anytime • No spam</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to manage subscriptions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features that help you save money without thinking about it
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors duration-300">
                <Wallet className="w-7 h-7 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Connect Your Bank</h3>
              <p className="text-gray-600">
                Securely link your bank account via Mono. Takes less than 60 seconds. 
                Read-only access — we can't touch your money.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors duration-300">
                <Eye className="w-7 h-7 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">See Everything</h3>
              <p className="text-gray-600">
                Subsaver scans your transactions and shows all your subscriptions in one 
                beautiful dashboard. No more hidden charges.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors duration-300">
                <Zap className="w-7 h-7 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Cancel & Save</h3>
              <p className="text-gray-600">
                Spot forgotten subscriptions, cancel with one click, and start saving money 
                immediately. Instant results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How Subsaver works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to take back control of your finances
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Connect Your Bank</h3>
              <p className="text-gray-600 text-lg">Securely link your bank account. Takes less than 60 seconds.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">See Everything</h3>
              <p className="text-gray-600 text-lg">Subsaver scans your transactions and shows all subscriptions.</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Cancel & Save</h3>
              <p className="text-gray-600 text-lg">Spot forgotten subscriptions, cancel, save money immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get more from your finances with Subsaver Premium
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Free</h3>
              <div className="text-4xl font-bold mb-6">₦0<span className="text-lg font-normal text-gray-500">/month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-green-500" /> Track up to 5 subscriptions</li>
                <li className="flex items-center gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-green-500" /> Bank connection (Mono)</li>
                <li className="flex items-center gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-green-500" /> Detect forgotten subscriptions</li>
                <li className="flex items-center gap-3 text-gray-600"><CheckCircle className="w-5 h-5 text-green-500" /> Cancel guides</li>
              </ul>
              <button onClick={handleGetStarted} className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300">
                Get Started Free
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-400 text-blue-900 px-4 py-1 rounded-bl-2xl text-sm font-bold">Most Popular</div>
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="text-4xl font-bold mb-6">₦2,000<span className="text-lg font-normal text-blue-100">/month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-white" /> Unlimited subscriptions</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-white" /> SMS reminders before charges</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-white" /> Email cancellation templates</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-white" /> Priority support</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-white" /> Share with 1 family member</li>
              </ul>
              <button onClick={handleGetStarted} className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">
                Start Premium
              </button>
              <p className="text-center text-blue-100 text-sm mt-4">Annual plan: ₦20,000/year (save ₦4,000)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-gray-50 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loved by early users
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it — hear from our users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex gap-1 text-yellow-500 mb-4">★★★★★</div>
              <p className="text-gray-700 mb-4">"I found out I was paying for a gym membership I haven't used in 6 months. Subsaver helped me cancel it same day."</p>
              <p className="font-semibold">— Ada L., Lagos</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex gap-1 text-yellow-500 mb-4">★★★★★</div>
              <p className="text-gray-700 mb-4">"The reminder saved me from a ₦15,000 annual renewal I completely forgot about."</p>
              <p className="font-semibold">— Chidi O., Abuja</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex gap-1 text-yellow-500 mb-4">★★★★★</div>
              <p className="text-gray-700 mb-4">"Simple, works with my Nigerian bank, and already saved me money in my first week."</p>
              <p className="font-semibold">— Simi A., Port Harcourt</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ready to stop wasting money?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join other Nigerians taking control of their subscriptions. 
            Start saving today — it's free.
          </p>
          <button onClick={handleGetStarted} className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
            Get Started Now <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-sm text-gray-500 mt-4">Free to start • Cancel anytime • No spam</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-1.5 rounded-xl">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-xl">SubSaver</span>
              </div>
              <p className="text-sm">Helping Nigerians save money from forgotten subscriptions.</p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white transition">Pricing</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="hover:text-white transition">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={handleGetStarted} className="hover:text-white transition">Contact</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p className="mb-2">
              Banking services provided by Mono. Subscription data is read-only — we cannot move your money.
            </p>
            <p>© 2026 Subsaver. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
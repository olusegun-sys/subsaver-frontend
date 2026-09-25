import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, CheckCircle, Wallet, Eye, Zap, Sparkles,
  Users, Shield, TrendingUp, Bell, Star, Menu, X, Quote
} from 'lucide-react';
import { useState } from 'react';
import Logo from '../components/Logo';

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
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <div className="cursor-pointer" onClick={() => scrollToSection('home')}>
              <Logo size={36} textSize="md" />
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">How It Works</button>
              <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">Pricing</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">Testimonials</button>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button onClick={handleGetStarted} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition px-3 py-2">Log in</button>
              <button onClick={handleGetStarted} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all">Get Started</button>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition">
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200/70 py-4">
            <div className="flex flex-col space-y-1 px-4">
              <button onClick={() => scrollToSection('features')} className="text-left text-sm font-medium text-slate-600 hover:text-blue-600 transition py-3">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-left text-sm font-medium text-slate-600 hover:text-blue-600 transition py-3">How It Works</button>
              <button onClick={() => scrollToSection('pricing')} className="text-left text-sm font-medium text-slate-600 hover:text-blue-600 transition py-3">Pricing</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-left text-sm font-medium text-slate-600 hover:text-blue-600 transition py-3">Testimonials</button>
              <hr className="my-2 border-slate-200" />
              <button onClick={handleGetStarted} className="text-left text-sm font-medium text-slate-600 hover:text-slate-900 transition py-3">Log in</button>
              <button onClick={handleGetStarted} className="bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all mt-1">Get Started</button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/70 via-white to-white"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold tracking-wide">Trusted by early users</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-[1.05] tracking-tight">
              Spot every subscription.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Cancel what you don't need.</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-4 font-medium">
              Know where your money goes. Save what you didn't know you were losing.
            </p>
            <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto mb-10">
              Managing money is hard, but you don't have to do it alone. Subsaver empowers you to save more, spend less, see everything, and take back control of your financial life.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button onClick={handleGetStarted} className="bg-blue-600 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 transition-all inline-flex items-center gap-2">
                Take control of my finances <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="px-8 py-4 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-100 transition-all">
                How it works
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-6">Free to start • Cancel anytime • No spam</p>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-16 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-full mb-4 shadow-sm">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold">Join 5+ early users saving money</span>
            </div>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              "Subsaver helped me find over <span className="font-bold text-slate-900">₦75,000</span> in forgotten subscriptions in just 5 minutes."
            </p>
            <p className="text-sm text-slate-400 mt-3">— Ada L., Lagos</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Everything you need to manage subscriptions
            </h2>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
              Powerful features that help you save money without thinking about it
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-slate-200/70 hover:border-blue-300 shadow-sm hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center mb-5 transition-colors duration-300">
                <Wallet className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Connect Your Bank</h3>
              <p className="text-slate-600 leading-relaxed">
                Securely link your bank account via Mono. Takes less than 60 seconds. Read-only access — we can't touch your money.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200/70 hover:border-blue-300 shadow-sm hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center mb-5 transition-colors duration-300">
                <Eye className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">See Everything</h3>
              <p className="text-slate-600 leading-relaxed">
                Subsaver scans your transactions and shows all your subscriptions in one beautiful dashboard. No more hidden charges.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200/70 hover:border-blue-300 shadow-sm hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center mb-5 transition-colors duration-300">
                <Zap className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Cancel & Save</h3>
              <p className="text-slate-600 leading-relaxed">
                Spot forgotten subscriptions, cancel with one click, and start saving money immediately. Instant results.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="text-center p-4">
              <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Track spending</p>
            </div>
            <div className="text-center p-4">
              <Bell className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Renewal reminders</p>
            </div>
            <div className="text-center p-4">
              <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Bank-level security</p>
            </div>
            <div className="text-center p-4">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Family sharing</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-slate-50 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              How Subsaver works
            </h2>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
              Three simple steps to take back control of your finances
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '1', title: 'Connect Your Bank', body: 'Securely link your bank account. Takes less than 60 seconds.' },
              { n: '2', title: 'See Everything', body: 'Subsaver scans your transactions and shows all subscriptions.' },
              { n: '3', title: 'Cancel & Save', body: 'Spot forgotten subscriptions, cancel, save money immediately.' }
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-600/25">
                  <span className="text-2xl font-extrabold text-white">{step.n}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
              Cancel two forgotten subscriptions and Subsaver pays for itself.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-slate-700 mb-2">Free</h3>
              <div className="text-4xl font-extrabold text-slate-900 mb-6">
                ₦0<span className="text-base font-normal text-slate-500">/forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Track up to 2 subscriptions</li>
                <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Bank connection via Mono</li>
                <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Detect forgotten subscriptions</li>
                <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Cancel guides</li>
              </ul>
              <button onClick={handleGetStarted} className="w-full border-2 border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all">
                Start Free
              </button>
            </div>

            {/* Premium Monthly */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-slate-700 mb-2">Monthly</h3>
              <div className="text-4xl font-extrabold text-slate-900 mb-6">
                ₦3,500<span className="text-base font-normal text-slate-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Unlimited subscriptions</li>
                <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Renewal reminders</li>
                <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Email cancellation templates</li>
                <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Priority support</li>
              </ul>
              <button onClick={handleGetStarted} className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all">
                Choose Monthly
              </button>
            </div>

            {/* Premium Annual */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 shadow-xl shadow-blue-600/20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-400 text-blue-900 px-4 py-1 rounded-bl-2xl text-xs font-bold tracking-wide">BEST VALUE</div>
              <h3 className="text-xl font-bold mb-2">Annual</h3>
              <div className="text-4xl font-extrabold mb-1">
                ₦25,000<span className="text-base font-normal text-blue-100">/year</span>
              </div>
              <p className="text-blue-100 text-sm mb-6">≈ ₦2,083/month — save ₦17,000</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm"><CheckCircle className="w-5 h-5 flex-shrink-0" /> Everything in Monthly</li>
                <li className="flex items-center gap-3 text-sm"><CheckCircle className="w-5 h-5 flex-shrink-0" /> 12 months upfront</li>
                <li className="flex items-center gap-3 text-sm"><CheckCircle className="w-5 h-5 flex-shrink-0" /> Family sharing (1 member)</li>
                <li className="flex items-center gap-3 text-sm"><CheckCircle className="w-5 h-5 flex-shrink-0" /> No monthly charges</li>
              </ul>
              <button onClick={handleGetStarted} className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all">
                Save ₦17,000 — Go Annual
              </button>
            </div>
          </div>

          <p className="text-center text-slate-500 text-sm mt-8">
            All plans include read-only bank access via Mono. We can't move your money.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="bg-slate-50 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Loved by Nigerians
            </h2>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
              Don't just take our word for it — hear from our users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "I found out I was paying for a gym membership I haven't used in 6 months. Subsaver helped me cancel it same day.", name: 'Ada L.', city: 'Lagos' },
              { quote: 'The SMS reminder saved me from a ₦15,000 annual renewal I completely forgot about.', name: 'Chidi O.', city: 'Abuja' },
              { quote: 'Simple, works with my Nigerian bank, and already saved me money in my first week.', name: 'Simi A.', city: 'Port Harcourt' }
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex gap-0.5 text-yellow-500 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <Quote className="w-6 h-6 text-blue-200 mb-2" />
                <p className="text-slate-700 mb-5 leading-relaxed">{t.quote}</p>
                <p className="text-sm font-semibold text-slate-900">— {t.name}, <span className="font-normal text-slate-500">{t.city}</span></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-10 md:p-14 shadow-xl shadow-blue-600/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Ready to stop wasting money?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join other Nigerians taking control of their subscriptions. Start saving today — it's free.
            </p>
            <button onClick={handleGetStarted} className="bg-white text-blue-600 px-8 py-4 rounded-xl text-base font-semibold hover:shadow-xl hover:scale-[1.02] transition-all inline-flex items-center gap-2">
              Get Started Now <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-blue-200 mt-4">Free to start • Cancel anytime • No spam</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-2.5">
              <Logo size={32} showText={false} />
              <span className="text-base font-bold text-white">SubSaver</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <a href="/privacy" className="hover:text-white transition">Privacy</a>
              <a href="/terms" className="hover:text-white transition">Terms</a>
              <button onClick={handleGetStarted} className="hover:text-white transition">Login</button>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 text-center text-xs">
            <p className="mb-2">Banking services provided by Mono. Subscription data is read-only — we cannot move your money.</p>
            <p>© 2026 Subsaver. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
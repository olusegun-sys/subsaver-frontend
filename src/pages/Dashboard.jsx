import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, X, Plus, CreditCard, RefreshCw, AlertTriangle,
  ChevronRight, Search, SlidersHorizontal, Bell, Wallet,
  Calendar, TrendingUp, Circle
} from 'lucide-react';
import { toast } from '../components/Toast';

// CURRENCY: Configuration - Change code to 'USD' for dollars, 'NGN' for Naira
const CURRENCY = {
  code: 'NGN',
  symbol: '₦',
  rate: 1550
};

// CURRENCY: Helper function to format amounts with comma separators
const formatAmount = (amountInUSD) => {
  if (CURRENCY.code === 'USD') {
    return `$${amountInUSD.toFixed(2)}`;
  }
  const nairaAmount = amountInUSD * CURRENCY.rate;
  const formattedNaira = Math.round(nairaAmount).toLocaleString('en-US');
  return `${CURRENCY.symbol}${formattedNaira}`;
};

// WHY: Rocket Money shows yearly totals per section — small helper
const formatYearly = (monthlyTotalUSD) => {
  const yearlyUSD = monthlyTotalUSD * 12;
  const yearlyNGN = yearlyUSD * CURRENCY.rate;
  return `${CURRENCY.symbol}${Math.round(yearlyNGN).toLocaleString('en-US')}/yr`;
};

// SECURITY: Sanitize text to prevent XSS attacks
const sanitizeText = (text) => {
  if (!text) return '';
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

// SECURITY: Validate session is still active on Supabase
const validateSession = async (navigate) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    toast.error('Your session has expired. Please log in again.');
    navigate('/');
    return false;
  }
  return true;
};

// WHY: Deterministic color per merchant (Rocket Money-style avatars)
const getMerchantColor = (name) => {
  const colors = [
    'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500',
    'bg-cyan-500', 'bg-teal-500', 'bg-emerald-500', 'bg-sky-500',
    'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500', 'bg-amber-500'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

// WHY: Rocket Money shows cadence under merchant name
const getCadence = (days) => {
  if (!days) return 'Monthly';
  if (days <= 10) return 'Weekly';
  if (days <= 45) return 'Monthly';
  if (days <= 100) return 'Quarterly';
  return 'Yearly';
};

// WHY: Compute the number of days in the cadence cycle (7 / 30 / 90 / 365)
const getCadenceDays = (daysSinceLastCharge) => {
  if (!daysSinceLastCharge) return 30;
  if (daysSinceLastCharge <= 10) return 7;
  if (daysSinceLastCharge <= 45) return 30;
  if (daysSinceLastCharge <= 100) return 90;
  return 365;
};

// WHY: Estimate days until next charge from last charge + cadence.
// Uses modulo so it works even if the subscription is already overdue.
const getDaysUntilRenewal = (daysSinceLastCharge) => {
  const cadence = getCadenceDays(daysSinceLastCharge);
  const positionInCycle = daysSinceLastCharge % cadence;
  const daysLeft = cadence - positionInCycle;
  return daysLeft;
};

// WHY: Focused confirmation modal — no external links, no cancellation guide.
// Keeps the user inside Subsaver and treats the modal as the final decision point.
function CancellationModal({ sub, onClose, onCancelConfirm, isSaving }) {
  if (!sub) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl shadow-slate-900/25 relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top gradient accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 flex-shrink-0"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto">
          {/* Merchant avatar + heading */}
          <div className="flex items-center gap-3 mb-5 pr-10">
            <div className={`w-12 h-12 rounded-2xl ${getMerchantColor(sub.merchant)} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
              {sanitizeText(sub.merchant).charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                Cancel {sanitizeText(sub.merchant)}?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {formatAmount(sub.amount)} / month · {getCadence(sub.daysSinceLastCharge)}
              </p>
            </div>
          </div>

          {/* Confirmation copy */}
          <p className="text-sm text-slate-600 leading-relaxed mb-5">
            Are you sure you want to cancel this subscription? We'll mark it as cancelled and stop tracking it.
          </p>

          {/* Detail summary card for context */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Merchant</span>
              <span className="font-semibold text-slate-900 truncate pl-3">
                {sanitizeText(sub.merchant)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Amount</span>
              <span className="font-semibold text-slate-900">
                {formatAmount(sub.amount)} / month
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Last Charge</span>
              <span className="font-semibold text-slate-900">{sub.lastCharge}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-white border border-slate-300 text-slate-700 font-medium py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Keep Subscription
            </button>
            <button
              onClick={onCancelConfirm}
              disabled={isSaving}
              className={`flex-1 text-white font-semibold py-3 px-4 rounded-xl transition-all ${
                isSaving
                  ? 'bg-red-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30'
              }`}
            >
              {isSaving ? 'Cancelling…' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// WHY: Alerts side panel — lists upcoming renewals in the next 7 days.
// Purely read-only from existing subscriptions data. Cancel button opens the same modal.
function AlertsPanel({ isOpen, onClose, upcomingRenewals, onCancelClick }) {
  // WHY: Prevent rendering when closed so no DOM overhead.
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[900] bg-slate-900/50 backdrop-blur-sm flex justify-end animate-fade-in"
    >
      <div className="bg-white w-full max-w-md h-full shadow-2xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200/70 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
              <Bell className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Alerts</h3>
              <p className="text-xs text-slate-500">Upcoming renewals in 7 days</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            aria-label="Close alerts"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6">
          {upcomingRenewals.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <Circle className="w-6 h-6 text-emerald-500 fill-current" />
              </div>
              <p className="text-sm font-semibold text-slate-900 mb-1">All clear</p>
              <p className="text-xs text-slate-500">No renewals in the next 7 days.</p>
            </div>
          ) : (
            <>
              {/* Summary pill */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                  Next 7 days
                </p>
                <p className="text-sm text-blue-900">
                  <span className="font-bold">{upcomingRenewals.length}</span> renewal{upcomingRenewals.length > 1 ? 's' : ''} coming up.
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Total: <span className="font-semibold">{formatAmount(upcomingRenewals.reduce((sum, s) => sum + s.amount, 0))}</span>
                </p>
              </div>

              {/* Upcoming list */}
              <div className="space-y-2.5">
                {upcomingRenewals.map(sub => (
                  <div
                    key={sub.id}
                    className="bg-white border border-slate-200/70 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full ${getMerchantColor(sub.merchant)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {sanitizeText(sub.merchant).charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">
                          {sanitizeText(sub.merchant)}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <Calendar className="w-3 h-3 text-blue-500" />
                          <span className="text-slate-500">
                            Renews in <span className="font-semibold text-blue-600">
                              {getDaysUntilRenewal(sub.daysSinceLastCharge)} day{getDaysUntilRenewal(sub.daysSinceLastCharge) !== 1 ? 's' : ''}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-slate-900 text-sm">
                          {formatAmount(sub.amount)}
                        </p>
                        <button
                          onClick={() => {
                            onCancelClick(sub);
                            onClose();
                          }}
                          className="text-xs font-medium text-red-600 hover:text-red-700 mt-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Premium upsell hint */}
              <div className="mt-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <p className="text-xs font-semibold uppercase tracking-wider">Premium</p>
                </div>
                <p className="text-sm font-semibold mb-1">Never miss a renewal</p>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Get SMS and email reminders before you're charged. Available on Subsaver Premium.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [cancellingIds, setCancellingIds] = useState([]);
  const [mode, setMode] = useState('demo');
  const [hasConnectedBank, setHasConnectedBank] = useState(false);
  const navigate = useNavigate();

  // WHY: Search filter state — client-side only, does not touch the DB.
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // WHY: Alerts panel toggle — purely visual state.
  const [showAlerts, setShowAlerts] = useState(false);

  const BACKEND_URL = 'https://subsaver-backend-3eqa.onrender.com';

  const getAllSubscriptions = () => {
    return [
      { id: '1', merchant: 'Netflix', amount: 15.99, lastCharge: '2026-03-25', daysSinceLastCharge: 20, flagged: false },
      { id: '2', merchant: 'Spotify', amount: 9.99, lastCharge: '2026-03-20', daysSinceLastCharge: 25, flagged: false },
      { id: '5', merchant: 'Amazon Prime', amount: 14.99, lastCharge: '2026-03-10', daysSinceLastCharge: 35, flagged: false },
      { id: '7', merchant: 'Disney+', amount: 12.99, lastCharge: '2026-03-28', daysSinceLastCharge: 17, flagged: false },
      { id: '9', merchant: 'Apple Music', amount: 10.99, lastCharge: '2026-04-01', daysSinceLastCharge: 13, flagged: false },
      { id: '3', merchant: 'Adobe Creative Cloud', amount: 52.99, lastCharge: '2026-01-15', daysSinceLastCharge: 89, flagged: true },
      { id: '4', merchant: 'AWS Services', amount: 847.50, lastCharge: '2026-01-20', daysSinceLastCharge: 84, flagged: true },
      { id: '6', merchant: 'Gym Membership', amount: 200.00, lastCharge: '2025-12-15', daysSinceLastCharge: 121, flagged: true },
      { id: '8', merchant: 'HBO Max', amount: 16.99, lastCharge: '2026-02-01', daysSinceLastCharge: 72, flagged: true },
      { id: '10', merchant: 'Magazine Subscription', amount: 12.99, lastCharge: '2025-10-15', daysSinceLastCharge: 182, flagged: true },
      { id: '11', merchant: 'Software License', amount: 299.99, lastCharge: '2025-09-01', daysSinceLastCharge: 226, flagged: true },
      { id: '12', merchant: 'Cloud Storage', amount: 49.99, lastCharge: '2025-11-20', daysSinceLastCharge: 146, flagged: true },
      { id: '13', merchant: 'VPN Service', amount: 79.99, lastCharge: '2025-08-10', daysSinceLastCharge: 248, flagged: true },
    ];
  };

  const loadKeptSubscriptions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase.from('user_kept').select('subscription_id').eq('user_id', user.id);
    if (error) { console.error('Error loading kept subscriptions:', error); return []; }
    return data?.map(k => k.subscription_id) || [];
  };

  const saveDetectedSubscription = async (subscription) => {
    const isValid = await validateSession(navigate);
    if (!isValid) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('detected_subscriptions').insert({
      user_id: user.id, subscription_id: subscription.id, merchant_name: subscription.merchant,
      amount: subscription.amount, last_charge: subscription.lastCharge,
      days_since: subscription.daysSinceLastCharge, flagged: true
    });
    if (error) {
      console.error('Error saving detected subscription:', error);
      toast.error('Unable to save detected subscription. Your session may have expired. Please refresh and try again.');
    }
  };

  const loadDetectedSubscriptions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase.from('detected_subscriptions').select('*').eq('user_id', user.id);
    if (error) { console.error('Error loading detected subscriptions:', error); return []; }
    return data || [];
  };

  const saveAccessToken = async (token) => {
    const isValid = await validateSession(navigate);
    if (!isValid) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // WHY: Await delete + check error so duplicates can't accumulate.
    const { error: deleteError } = await supabase
      .from('user_tokens')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error clearing old tokens:', deleteError);
      toast.error('Unable to update bank connection. Please try again.');
      return;
    }

    const { error: insertError } = await supabase
      .from('user_tokens')
      .insert({ user_id: user.id, access_token: token });

    if (insertError) {
      console.error('Error saving token:', insertError);
      toast.error('Unable to save bank connection. Please try again.');
      return;
    }

    localStorage.setItem('subsaver_connected', 'true');
    localStorage.setItem('subsaver_mode', 'live');
    localStorage.setItem('subsaver_token', token);
    setHasConnectedBank(true);
    setMode('live');
  };

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSubscriptions(getAllSubscriptions()); return; }

    const { data: cancelled, error: cancelError } = await supabase
      .from('user_cancellations')
      .select('subscription_id')
      .eq('user_id', user.id)
      .eq('status', 'canceling');
    if (cancelError) console.error('Error loading cancellations:', cancelError);

    const cancelledIds = cancelled?.map(c => c.subscription_id) || [];
    setCancellingIds(cancelledIds);

    const keptIds = await loadKeptSubscriptions();
    const detected = await loadDetectedSubscriptions();

    let allSubs = [...getAllSubscriptions()];
    const detectedSubs = detected.map(d => ({
      id: d.subscription_id, merchant: d.merchant_name, amount: d.amount,
      lastCharge: d.last_charge, daysSinceLastCharge: d.days_since, flagged: true
    }));
    allSubs = [...allSubs, ...detectedSubs];

    const processed = allSubs.map(sub => ({
      ...sub,
      flagged: sub.flagged && !keptIds.includes(sub.id) && !cancelledIds.includes(sub.id)
    }));

    const filtered = processed.filter(sub => !cancelledIds.includes(sub.id));
    setSubscriptions(filtered);
  };

  const handleKeep = async (id) => {
    const subToKeep = subscriptions.find(sub => sub.id === id);
    if (!subToKeep) { console.error('Subscription not found for id:', id); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Please log in to keep subscriptions'); return; }
    const { error } = await supabase.from('user_kept').insert({
      user_id: user.id, subscription_id: id, merchant_name: subToKeep.merchant
    });
    if (error) {
      console.error('Error saving keep action:', error);
      toast.error('Unable to save. Please try again.');
      return;
    }
    setSubscriptions(prev => prev.map(sub => sub.id === id ? { ...sub, flagged: false } : sub));
  };

  const handleCancelConfirm = async () => {
    if (!selectedSub) return;
    const isValid = await validateSession(navigate);
    if (!isValid) return;
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('user_cancellations').insert({
        user_id: user.id, subscription_id: selectedSub.id,
        merchant_name: selectedSub.merchant, status: 'canceling'
      });
      if (error) {
        console.error('Error saving cancellation:', error);
        toast.error('Unable to cancel. Your session may have expired. Please refresh and try again.');
      } else {
        setSubscriptions(prev => prev.filter(sub => sub.id !== selectedSub.id));
        setCancellingIds(prev => [...prev, selectedSub.id]);
        toast.success(`${selectedSub.merchant} cancelled successfully!`);
      }
    }
    setSelectedSub(null);
    setIsSaving(false);
  };

  const handleDetectForgotten = async () => {
    const isValid = await validateSession(navigate);
    if (!isValid) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Please log in to detect forgotten subscriptions'); return; }
    const { data: existingDetected, error: loadError } = await supabase
      .from('detected_subscriptions').select('subscription_id').eq('user_id', user.id);
    if (loadError) {
      console.error('Error loading detected subscriptions:', loadError);
      toast.error('Unable to check for forgotten subscriptions. Please try again.');
      return;
    }
    const existingIds = existingDetected?.map(d => d.subscription_id) || [];
    const merchants = [
      'Forgotten Gym Pass', 'Old Magazine', 'Unused Software', 'Dormant Cloud Backup',
      'Abandoned Domain', 'Old Insurance', 'Forgotten Streaming', 'Unused Project Tool',
      'Dormant CRM', 'Old News', 'Forgotten Meal Kit', 'Unused Design Tool',
      'Dormant VPN', 'Old Dating App', 'Forgotten Music Service', 'Unused Storage'
    ];
    const amounts = [4.99, 7.99, 9.99, 12.99, 14.99, 19.99, 24.99, 29.99, 49.99, 89.99, 99.99, 149.99];
    const daysSinceOptions = [30, 45, 60, 75, 90, 120, 150, 180, 210, 240, 270, 300, 330, 365];
    let newSub = null;
    let attempts = 0;
    const maxAttempts = 100;
    while (!newSub && attempts < maxAttempts) {
      const randomMerchant = merchants[Math.floor(Math.random() * merchants.length)];
      const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
      const randomDays = daysSinceOptions[Math.floor(Math.random() * daysSinceOptions.length)];
      const testId = `new_${Date.now()}_${attempts}_${randomMerchant.replace(/\s/g, '')}`;
      if (!existingIds.includes(testId)) {
        newSub = {
          id: testId, merchant: randomMerchant, amount: randomAmount,
          lastCharge: (() => { const date = new Date(); date.setDate(date.getDate() - randomDays); return date.toISOString().split('T')[0]; })(),
          daysSinceLastCharge: randomDays, flagged: true
        };
      }
      attempts++;
    }
    if (newSub) {
      await saveDetectedSubscription(newSub);
      await loadData();
      toast.success(`New forgotten subscription detected! ${newSub.merchant} - ${formatAmount(newSub.amount)}`);
    } else {
      toast.info('No new forgotten subscriptions found after many attempts!');
    }
  };

  const handleConnectBank = () => {
    import('@mono.co/connect.js').then((MonoConnect) => {
      const config = {
        key: import.meta.env.VITE_MONO_PUBLIC_KEY,
        data: { customer: { name: "SubSaver User", email: "user@subsaver.com" } },
        onSuccess: async (response) => {
          const monoCode = response.code;
          if (monoCode) {
            try {
              const exchange = await fetch(`${BACKEND_URL}/api/exchange-mono-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mono_code: monoCode }),
              });
              const exchangeData = await exchange.json();
              if (exchangeData.access_token) {
                await saveAccessToken(exchangeData.access_token);
                localStorage.setItem('subsaver_connected', 'true');
                localStorage.setItem('subsaver_mode', 'live');
                localStorage.setItem('subsaver_token', exchangeData.access_token);
                setHasConnectedBank(true);
                setMode('live');
                toast.success('Bank connected! Connection saved.');
              }
            } catch (error) {
              console.error('Error connecting bank:', error);
              toast.error('Failed to connect bank. Please try again.');
            }
          }
        },
        onClose: () => console.log('Closed'),
      };
      const connect = new MonoConnect.default(config);
      connect.setup();
      connect.open();
    }).catch(err => {
      console.error('Error loading Mono Connect:', err);
      toast.error('Failed to load bank connection. Please refresh and try again.');
    });
  };

  const handleShowDemoMode = () => {
    localStorage.removeItem('subsaver_connected');
    localStorage.removeItem('subsaver_mode');
    localStorage.removeItem('subsaver_token');
    setMode('demo');
    setHasConnectedBank(false);
    loadData();
  };

  const handleLogout = async () => {
    localStorage.removeItem('subsaver_connected');
    localStorage.removeItem('subsaver_mode');
    localStorage.removeItem('subsaver_token');
    await supabase.auth.signOut();
    navigate('/');
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadData();
      const savedToken = localStorage.getItem('subsaver_token');
      const savedMode = localStorage.getItem('subsaver_mode');
      const savedConnected = localStorage.getItem('subsaver_connected');
      if (savedToken && savedConnected === 'true') {
        setHasConnectedBank(true);
        setMode(savedMode === 'live' ? 'live' : 'demo');
        console.log('Bank connection restored from localStorage');
        setLoading(false);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // WHY: Deterministic query — never panics on duplicate rows (PGRST116 fix).
        const { data: tokenRows, error: tokenError } = await supabase
          .from('user_tokens')
          .select('access_token, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (tokenError) console.error('Error loading token from database:', tokenError);

        const tokenData = tokenRows && tokenRows.length > 0 ? tokenRows[0] : null;

        if (tokenData?.access_token) {
          localStorage.setItem('subsaver_connected', 'true');
          localStorage.setItem('subsaver_mode', 'live');
          localStorage.setItem('subsaver_token', tokenData.access_token);
          setHasConnectedBank(true);
          setMode('live');
          console.log('Bank connection restored from database');
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // WHY: Base lists split by flagged status (sacred feature #1 logic, unchanged).
  const flagged = subscriptions.filter(s => s.flagged === true);
  const active = subscriptions.filter(s => s.flagged !== true);
  const totalMonthly = subscriptions.reduce((sum, s) => sum + s.amount, 0);
  const potentialSavings = flagged.reduce((sum, s) => sum + s.amount, 0);

  // WHY: Apply search filter on top of the derived lists — never mutates underlying data.
  const searchLower = searchQuery.trim().toLowerCase();
  const flaggedFiltered = searchLower
    ? flagged.filter(s => s.merchant.toLowerCase().includes(searchLower))
    : flagged;
  const activeFiltered = searchLower
    ? active.filter(s => s.merchant.toLowerCase().includes(searchLower))
    : active;

  // WHY: Compute upcoming renewals (next 7 days) from existing subscriptions only.
  const upcomingRenewals = subscriptions
    .filter(s => getDaysUntilRenewal(s.daysSinceLastCharge) <= 7)
    .sort((a, b) => getDaysUntilRenewal(a.daysSinceLastCharge) - getDaysUntilRenewal(b.daysSinceLastCharge));

  const alertsCount = upcomingRenewals.length;
  const isSearching = searchLower.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 via-white to-white">
      {/* Sticky top nav */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/25">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span className="text-base font-bold text-slate-900 tracking-tight">SubSaver</span>
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={handleDetectForgotten}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-full transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Detect Forgotten
              </button>

              {mode === 'demo' ? (
                <button
                  onClick={handleConnectBank}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white text-sm font-semibold px-4 py-2 rounded-full transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Connect Bank
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShowDemoMode}
                    className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-full transition-all"
                  >
                    Demo Mode
                  </button>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Connected
                  </span>
                </div>
              )}

              <div className="w-px h-6 bg-slate-200 mx-1"></div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile actions */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={handleDetectForgotten}
                className="p-2 rounded-full bg-slate-100 text-slate-700 transition"
                aria-label="Detect Forgotten"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              {mode === 'demo' ? (
                <button
                  onClick={handleConnectBank}
                  className="p-2 rounded-full bg-slate-900 text-white transition"
                  aria-label="Connect Bank"
                >
                  <Plus className="w-5 h-5" />
                </button>
              ) : (
                <button                  onClick={handleShowDemoMode}
                  className="p-2 rounded-full bg-slate-100 text-slate-700 transition"
                  aria-label="Demo Mode"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-slate-500 hover:text-blue-600 transition"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fade-in">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
            Your Subscriptions
          </h1>
          <p className="text-sm text-slate-500">
            {subscriptions.length} active · {formatAmount(totalMonthly)} monthly
          </p>
        </div>

        {/* Pill toolbar — Sort (visual), Search (functional), Alerts (functional with badge) */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
          <button className="flex-shrink-0 inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg shadow-blue-600/25">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Sort by Type
          </button>

          {/* WHY: Search pill toggles a search bar below. Active style when open or filtering. */}
          <button
            onClick={() => setShowSearch(prev => !prev)}
            className={`flex-shrink-0 inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition ${
              showSearch || isSearching
                ? 'bg-blue-50 border border-blue-200 text-blue-700'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Search
          </button>

          {/* WHY: Alerts pill opens the side panel. Badge shows count of upcoming renewals. */}
          <button
            onClick={() => setShowAlerts(true)}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-full hover:border-slate-300 transition relative"
          >
            <Bell className="w-3.5 h-3.5" />
            Alerts
            {alertsCount > 0 && (
              <span className="ml-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                {alertsCount}
              </span>
            )}
          </button>
        </div>

        {/* WHY: Collapsible search bar — only renders when Search pill is active. */}
        {showSearch && (
          <div className="mb-6 animate-fade-in">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subscriptions by merchant name..."
                className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {isSearching && (
              <p className="text-xs text-slate-500 mt-2 pl-1">
                Showing <span className="font-semibold text-slate-700">{flaggedFiltered.length + activeFiltered.length}</span> result{flaggedFiltered.length + activeFiltered.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            )}
          </div>
        )}

        {/* Hero band */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-3xl p-6 sm:p-8 mb-6 shadow-xl shadow-blue-600/20 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="relative">
            <p className="text-xs uppercase tracking-widest text-blue-100 font-semibold mb-2">
              You're spending
            </p>
            <div className="flex items-end gap-3 flex-wrap">
              <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                {formatAmount(totalMonthly)}
              </p>
              <p className="text-blue-100 font-medium mb-1.5">/ month</p>
            </div>
            <p className="text-sm text-blue-100 mt-2">
              That's <span className="font-bold text-white">{formatYearly(totalMonthly)}</span> if nothing changes.
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-white/15">
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-blue-100 font-semibold mb-0.5">Potential Savings</p>
                <p className="text-base sm:text-lg font-bold text-white">{formatAmount(potentialSavings)}/mo</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/20"></div>
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-blue-100 font-semibold mb-0.5">Forgotten</p>
                <p className="text-base sm:text-lg font-bold text-white">{flagged.length}</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/20"></div>
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-blue-100 font-semibold mb-0.5">Active</p>
                <p className="text-base sm:text-lg font-bold text-white">{active.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Empty state when search yields no matches */}
        {isSearching && flaggedFiltered.length === 0 && activeFiltered.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/70 p-12 text-center mb-8">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">No subscriptions match "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-blue-600 hover:underline mt-2"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Likely Forgotten section */}
        {flaggedFiltered.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-2 px-1 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="section-label truncate">Likely Forgotten · {flaggedFiltered.length}</p>
              </div>
              <p className="text-xs font-semibold text-red-600 whitespace-nowrap">{formatYearly(potentialSavings)}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm">
              {flaggedFiltered.map((sub, idx) => (
                <div
                  key={sub.id}
                  className={`flex items-center gap-3 p-3 sm:p-4 hover:bg-red-50/30 transition-colors ${
                    idx !== 0 ? 'border-t border-slate-100' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full ${getMerchantColor(sub.merchant)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {sanitizeText(sub.merchant).charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">
                      {sanitizeText(sub.merchant)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {getCadence(sub.daysSinceLastCharge)}
                      {sub.daysSinceLastCharge && (
                        <span className="text-red-600 font-medium ml-1.5">
                          · {sub.daysSinceLastCharge}d inactive
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className="font-bold text-slate-900 text-sm">{formatAmount(sub.amount)}</p>
                    <p className="text-[10px] text-slate-400">{sub.lastCharge}</p>
                  </div>

                  <div className="text-right flex-shrink-0 sm:hidden">
                    <p className="font-bold text-slate-900 text-xs">{formatAmount(sub.amount)}</p>
                  </div>

                  <button
                    onClick={() => setSelectedSub(sub)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all flex-shrink-0"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Subscriptions section */}
        {activeFiltered.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-2 px-1 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Wallet className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <p className="section-label truncate">All Subscriptions · {activeFiltered.length}</p>
              </div>
              <p className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                {formatYearly(totalMonthly - potentialSavings)}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm">
              {activeFiltered.map((sub, idx) => (
                <div
                  key={sub.id}
                  className={`flex items-center gap-3 p-3 sm:p-4 hover:bg-blue-50/30 transition-colors group ${
                    idx !== 0 ? 'border-t border-slate-100' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full ${getMerchantColor(sub.merchant)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {sanitizeText(sub.merchant).charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">
                      {sanitizeText(sub.merchant)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {getCadence(sub.daysSinceLastCharge)}
                      <span className="hidden sm:inline"> · Last {sub.lastCharge}</span>
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-slate-900 text-sm">{formatAmount(sub.amount)}</p>
                  </div>

                  <button
                    onClick={() => setSelectedSub(sub)}
                    className="flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-600 p-1"
                    aria-label="Cancel"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Alerts side panel — read-only view of upcoming renewals */}
      <AlertsPanel
        isOpen={showAlerts}
        onClose={() => setShowAlerts(false)}
        upcomingRenewals={upcomingRenewals}
        onCancelClick={(sub) => setSelectedSub(sub)}
      />

      {/* Cancellation modal (sacred feature #2 — simplified UI, same logic) */}
      {selectedSub && (
        <CancellationModal
          sub={selectedSub}
          onClose={() => setSelectedSub(null)}
          onCancelConfirm={handleCancelConfirm}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LogOut, AlertTriangle, Trash2, X, Mail, ExternalLink, Plus, CreditCard, DollarSign, TrendingUp, RefreshCw } from 'lucide-react';
import { toast } from '../components/Toast';

// CURRENCY: Configuration - Change code to 'USD' for dollars, 'NGN' for Naira
const CURRENCY = {
  code: 'NGN',  // 'USD' or 'NGN'
  symbol: '₦',
  rate: 1550    // 1 USD = 1550 NGN (only used when code is 'NGN')
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

function CancellationModal({ sub, onClose, onCancelConfirm, isSaving }) {
  if (!sub) return null;

  const emailBody = `Subject: Cancellation Request\n\nHi ${sub.merchant} Support,\n\nPlease cancel my subscription associated with this email.\n\nThank you.`;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "500px",
          padding: "24px",
          position: "relative",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#555",
            color: "#fff",
            border: "none",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <h2 style={{ marginBottom: "4px", color: "#111" }}>
          Cancel {sanitizeText(sub.merchant)}
        </h2>
        <p style={{ marginBottom: "20px", color: "#666" }}>
          We'll help you cancel this subscription
        </p>

        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "10px", color: "#111" }}>
            Cancellation Guide
          </h3>
          <ol style={{ paddingLeft: "20px", color: "#333", lineHeight: "1.6" }}>
            <li>Log in to your <strong>{sanitizeText(sub.merchant)}</strong> account</li>
            <li>Go to <strong>Settings</strong> or <strong>Account</strong></li>
            <li>Find <strong>Subscriptions</strong> or <strong>Billing</strong></li>
            <li>Click <strong>Cancel Subscription</strong> and confirm</li>
          </ol>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "10px", color: "#111" }}>
            Email Template
          </h3>
          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: "12px",
              borderRadius: "8px",
              color: "#333",
              fontSize: "14px",
              whiteSpace: "pre-line",
            }}
          >
            {emailBody}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#777",
              color: "#fff",
              border: "none",
              padding: "12px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Keep Subscription
          </button>

          <button
            onClick={onCancelConfirm}
            disabled={isSaving}
            style={{
              backgroundColor: isSaving ? "#cc6666" : "#e53935",
              color: "#fff",
              border: "none",
              padding: "12px 16px",
              borderRadius: "8px",
              cursor: isSaving ? "not-allowed" : "pointer",
              fontSize: "14px",
              opacity: isSaving ? 0.8 : 1,
            }}
          >
            {isSaving ? "Saving..." : "Confirm Cancellation"}
          </button>
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
    
    const { data, error } = await supabase
      .from('user_kept')
      .select('subscription_id')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error loading kept subscriptions:', error);
      return [];
    }
    
    return data?.map(k => k.subscription_id) || [];
  };

  const saveDetectedSubscription = async (subscription) => {
    const isValid = await validateSession(navigate);
    if (!isValid) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { error } = await supabase.from('detected_subscriptions').insert({
      user_id: user.id,
      subscription_id: subscription.id,
      merchant_name: subscription.merchant,
      amount: subscription.amount,
      last_charge: subscription.lastCharge,
      days_since: subscription.daysSinceLastCharge,
      flagged: true
    });
    
    if (error) {
      console.error('Error saving detected subscription:', error);
      toast.error('Unable to save detected subscription. Your session may have expired. Please refresh and try again.');
    }
  };

  const loadDetectedSubscriptions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('detected_subscriptions')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error loading detected subscriptions:', error);
      return [];
    }
    
    return data || [];
  };

  const saveAccessToken = async (token) => {
    const isValid = await validateSession(navigate);
    if (!isValid) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    await supabase.from('user_tokens').delete().eq('user_id', user.id);
    const { error } = await supabase.from('user_tokens').insert({
      user_id: user.id,
      access_token: token
    });
    
    if (error) {
      console.error('Error saving token:', error);
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
    if (!user) {
      setSubscriptions(getAllSubscriptions());
      return;
    }
    
    const { data: cancelled, error: cancelError } = await supabase
      .from('user_cancellations')
      .select('subscription_id')
      .eq('user_id', user.id)
      .eq('status', 'canceling');
    
    if (cancelError) {
      console.error('Error loading cancellations:', cancelError);
    }
    
    const cancelledIds = cancelled?.map(c => c.subscription_id) || [];
    setCancellingIds(cancelledIds);
    
    const keptIds = await loadKeptSubscriptions();
    const detected = await loadDetectedSubscriptions();
    
    let allSubs = [...getAllSubscriptions()];
    
    const detectedSubs = detected.map(d => ({
      id: d.subscription_id,
      merchant: d.merchant_name,
      amount: d.amount,
      lastCharge: d.last_charge,
      daysSinceLastCharge: d.days_since,
      flagged: true
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
    if (!subToKeep) {
      console.error('Subscription not found for id:', id);
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please log in to keep subscriptions');
      return;
    }
    
    const { error } = await supabase
      .from('user_kept')
      .insert({
        user_id: user.id,
        subscription_id: id,
        merchant_name: subToKeep.merchant
      });
    
    if (error) {
      console.error('Error saving keep action:', error);
      toast.error('Unable to save. Please try again.');
      return;
    }
    
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, flagged: false } : sub
    ));
  };

  const handleCancelConfirm = async () => {
    if (!selectedSub) return;
    
    const isValid = await validateSession(navigate);
    if (!isValid) return;
    
    setIsSaving(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from('user_cancellations')
        .insert({
          user_id: user.id,
          subscription_id: selectedSub.id,
          merchant_name: selectedSub.merchant,
          status: 'canceling'
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
    if (!user) {
      toast.error('Please log in to detect forgotten subscriptions');
      return;
    }
    
    const { data: existingDetected, error: loadError } = await supabase
      .from('detected_subscriptions')
      .select('subscription_id')
      .eq('user_id', user.id);
    
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
          id: testId,
          merchant: randomMerchant,
          amount: randomAmount,
          lastCharge: (() => {
            const date = new Date();
            date.setDate(date.getDate() - randomDays);
            return date.toISOString().split('T')[0];
          })(),
          daysSinceLastCharge: randomDays,
          flagged: true
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
              const exchange = await fetch('http://localhost:3001/api/exchange-mono-code', {
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
        const { data: tokenData, error: tokenError } = await supabase
          .from('user_tokens')
          .select('access_token')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (tokenError) {
          console.error('Error loading token from database:', tokenError);
        }
        
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

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;

  const flagged = subscriptions.filter(s => s.flagged === true);
  const active = subscriptions.filter(s => s.flagged !== true);
  const totalMonthly = subscriptions.reduce((sum, s) => sum + s.amount, 0);
  const potentialSavings = flagged.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <CreditCard className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">SubSaver</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleDetectForgotten} className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition hover:scale-105">
                <RefreshCw className="w-4 h-4 inline mr-1" /> Detect Forgotten
              </button>
              {mode === 'demo' ? (
                <button onClick={handleConnectBank} className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition hover:scale-105">
                  <Plus className="w-4 h-4 inline mr-1" /> Connect Real Bank
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={handleShowDemoMode} className="bg-gray-500 text-white px-5 py-2 rounded-xl hover:bg-gray-600 transition hover:scale-105">
                    Show Demo Mode
                  </button>
                  <span className="text-green-600">✓ Bank Connected</span>
                </div>
              )}
              <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 transition">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
            <p className="text-gray-500">Total Monthly</p>
            <p className="text-3xl font-bold">{formatAmount(totalMonthly)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
            <p className="text-gray-500">Potential Savings</p>
            <p className="text-3xl font-bold text-red-600">{formatAmount(potentialSavings)}</p>
            <p className="text-xs text-gray-400">{flagged.length} forgotten</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
            <p className="text-gray-500">Active Tracked</p>
            <p className="text-3xl font-bold">{active.length}</p>
          </div>
        </div>

        {flagged.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-red-600 mb-4">Likely Forgotten</h2>
            {flagged.map(sub => (
              <div key={sub.id} className="bg-white rounded-xl shadow border border-red-100 p-5 mb-3 hover:shadow-md transition">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h4 className="font-semibold">{sanitizeText(sub.merchant)}</h4>
                    <p className="text-sm text-gray-500">Last: {sub.lastCharge}</p>
                    {sub.daysSinceLastCharge && <p className="text-xs text-red-500">{sub.daysSinceLastCharge} days ago</p>}
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xl font-bold text-red-600">{formatAmount(sub.amount)}</span>
                    <button onClick={() => setSelectedSub(sub)} className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition hover:scale-105">Cancel</button>
                    <button onClick={() => handleKeep(sub.id)} className="border px-4 py-2 rounded-xl hover:bg-gray-50 transition">Keep</button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold mb-4">All Subscriptions</h2>
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">Merchant</th>
                  <th className="px-6 py-4 text-left">Amount</th>
                  <th className="px-6 py-4 text-left">Last Charge</th>
                  <th className="px-6 py-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {active.map(sub => (
                  <tr key={sub.id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-6 py-4">{sanitizeText(sub.merchant)}</td>
                    <td className="px-6 py-4">{formatAmount(sub.amount)}</td>
                    <td className="px-6 py-4">{sub.lastCharge}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => setSelectedSub(sub)} className="text-red-500 hover:text-red-700 transition">Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

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
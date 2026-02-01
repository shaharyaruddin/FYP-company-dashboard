"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ApexOptions } from "apexcharts";
import { apiService, type TokenStatus } from "../api.service";

// ApexChart (SSR fix)
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function WelcomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tokenStatus, setTokenStatus] = useState<TokenStatus | null>(null);
  const [showPlans, setShowPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null); // Track selected plan for payment details

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Fetch token status
    apiService.getTokenStatus(parsedUser._id)
      .then(setTokenStatus)
      .catch(console.error);
  }, [router]);

  const usedTokens = tokenStatus ? tokenStatus.maxTokens - tokenStatus.tokens : 0;
  const remainingTokens = tokenStatus?.tokens ?? 0;

  const chartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
    },
    labels: ['Used Tokens', 'Remaining'],
    colors: ['#ef4444', '#2563eb'],
    stroke: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '12px',
              fontWeight: 900,
              color: '#94a3b8',
              offsetY: -10,
              formatter: () => 'TOTAL QUOTA'
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 900,
              color: '#ffffff',
              offsetY: 10,
              formatter: () => tokenStatus?.maxTokens?.toLocaleString() ?? '0'
            },
            total: {
              show: true,
              showAlways: true,
              label: 'TOTAL QUOTA',
              fontSize: '12px',
              fontWeight: 900,
              color: '#94a3b8',
              formatter: () => tokenStatus?.maxTokens?.toLocaleString() ?? '0'
            }
          }
        }
      }
    },
    dataLabels: { enabled: false },
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '12px',
      fontWeight: 700,
      labels: { colors: '#94a3b8' },
      markers: { offsetY: 0 },
      itemMargin: { horizontal: 20, vertical: 10 }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val: number) => `${val.toLocaleString()} tokens`
      }
    }
  };

  const chartSeries = [usedTokens, remainingTokens];

  const plans = [
    { id: 'starter', name: "Starter", priceUSD: 0, tokens: "5,000", features: ["Standard Core Sync"], color: "blue" },
    { id: 'pro', name: "Professional", priceUSD: 49, tokens: "50,000", features: ["Priority Core Sync"], color: "indigo", popular: true },
    { id: 'enterprise', name: "Enterprise", priceUSD: 199, tokens: "Unlimited", features: ["Enterprise Core Sync"], color: "purple" }
  ];

  const PKR_RATE = 280; // Example conversion rate

  const formatPrice = (usd: number) => {
    if (usd === 0) return "Free";
    return `Rs. ${(usd * PKR_RATE).toLocaleString()}`;
  };

  if (!user) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="dark">
      <div className="min-h-screen bg-slate-900 hero-gradient flex flex-col relative overflow-x-hidden">
        {/* Global Background Decorations */}
        <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-blue-600/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

        {/* Minimal Header */}
        <header className="bg-slate-900/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.015 9.015 0 0 1 8.716 2.253M12 3a9.015 9.015 0 0 0-8.716 2.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black text-white uppercase tracking-tight leading-none">Status Monitor</h1>
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Real-time Node</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => { setShowPlans(true); setSelectedPlan(null); }}
                className="px-6 py-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] uppercase tracking-[0.2em] font-black hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-blue-500/5"
              >
                Upgrade Access
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="btn-primary py-2.5 text-[10px] uppercase tracking-[0.2em] font-black"
              >
                Configure Core
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full p-6 sm:p-10 lg:p-16 space-y-12">
          {/* Welcome Hero */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Operational Overview</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              <div>
                <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none uppercase">
                  Welcome, <span className="text-blue-500">{user.name}</span>
                </h2>
                <p className="text-xl text-blue-100/60 font-light max-w-2xl mt-4">
                  Your AI Recommendation Agent is active and processing live inventory requests.
                </p>
              </div>
              {!tokenStatus?.active && (
                <button
                  onClick={() => { setShowPlans(true); setSelectedPlan(null); }}
                  className="animate-bounce px-8 py-4 bg-red-500 text-white rounded-[2rem] text-sm font-black uppercase tracking-widest shadow-2xl shadow-red-500/20 flex items-center gap-3"
                >
                  <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                  Activate Now
                </button>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Available Tokens", value: tokenStatus?.tokens ?? 0, desc: "Current token balance" },
              { label: "Maximum Tokens", value: tokenStatus?.maxTokens ?? 0, desc: "Total quota allocated" },
              { label: "System Status", value: tokenStatus?.active ? "Active" : "Offline", desc: "Live node connectivity", highlight: !tokenStatus?.active },
            ].map((stat, i) => (
              <div key={i} className={`glass-card p-10 rounded-[3rem] border ${stat.highlight ? 'border-red-500/30 bg-red-500/5' : 'border-white/10'} shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-500`}>
                <div className={`absolute top-0 right-0 w-32 h-32 ${stat.highlight ? 'bg-red-500/10' : 'bg-blue-500/5'} rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform`}></div>
                <div className="relative z-10 space-y-4">
                  <span className={`text-[10px] font-black ${stat.highlight ? 'text-red-400' : 'text-blue-400'} uppercase tracking-[0.3em] opacity-80`}>{stat.label}</span>
                  <div className={`text-5xl font-black ${stat.highlight ? 'text-red-500' : 'text-white'} tracking-tight`}>
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </div>
                  <p className="text-xs font-bold text-blue-100/30 uppercase tracking-widest">{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Combined Activation & Activity View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Resource Chart */}
            <div className="glass-card p-10 sm:p-12 rounded-[4rem] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Resource Utilization</h3>
                <p className="text-[10px] font-bold text-blue-100/30 uppercase tracking-widest mt-2">Real-time distribution</p>
              </div>
              <div className="h-[350px] w-full max-w-sm">
                <Chart options={chartOptions} series={chartSeries} type="donut" height="100%" />
              </div>
            </div>

            {/* Subscription Hub Quick Access */}
            <div className="glass-card p-10 sm:p-12 rounded-[4rem] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75-6.75a9.004 9.004 0 0 1 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight">Subscription Hub</h3>
                    <p className="text-sm font-bold text-blue-100/30 uppercase tracking-widest">Manage your corporate tier</p>
                  </div>
                </div>
                <p className="text-blue-100/60 font-light leading-relaxed">
                  Unlock higher token limits, multi-cluster synchronisation, and dedicated neural processing for your company's unique datasets.
                </p>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => { setShowPlans(true); setSelectedPlan(null); }}
                  className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[2rem] text-xl font-black uppercase tracking-tight hover:scale-[1.02] transition-transform shadow-2xl shadow-blue-500/20"
                >
                  View Enterprise Tiers
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Pricing & Payment Modal */}
        {showPlans && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-2xl bg-slate-950/60 animate-fade-in">
            <div className="w-full max-w-6xl relative">
              <button
                onClick={() => setShowPlans(false)}
                className="absolute -top-12 right-0 text-white/40 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {!selectedPlan ? (
                <>
                  <div className="text-center mb-12">
                    <h2 className="text-5xl font-black text-white uppercase tracking-tight mb-4">Select Your Tier</h2>
                    <p className="text-blue-100/40 font-bold uppercase tracking-[0.3em]">Scale your AI capabilities instantly</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                      <div key={i} className={`glass-card p-10 rounded-[3rem] border ${plan.popular ? 'border-blue-500/40 bg-blue-500/5' : 'border-white/10'} relative overflow-hidden group hover:-translate-y-4 transition-all duration-500`}>
                        {plan.popular && (
                          <div className="absolute top-0 right-0 bg-blue-600 text-white px-8 py-2 text-[10px] font-black uppercase tracking-widest -rotate-45 translate-x-8 translate-y-4 shadow-xl">
                            Recommended
                          </div>
                        )}
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight">{plan.name}</h3>
                            <div className="flex flex-col mt-4">
                              <span className="text-4xl font-black text-white">{formatPrice(plan.priceUSD)}</span>
                              <span className="text-sm font-bold text-blue-100/20 uppercase mt-1">/ month</span>
                            </div>
                          </div>

                          <div className="space-y-4 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>
                              </div>
                              <span className="text-sm font-black text-white">{plan.tokens} Tokens</span>
                            </div>
                            {plan.features.map((feature, j) => (
                              <div key={j} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="text-sm text-blue-100/60">{feature}</span>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => setSelectedPlan(plan)}
                            className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${plan.popular ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:scale-[1.05]' : 'bg-white/5 text-blue-100/40 hover:bg-white/10 hover:text-white'}`}
                          >
                            Initialize {plan.name}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="max-w-4xl mx-auto glass-card p-12 rounded-[4rem] border border-white/10 shadow-2xl relative overflow-hidden animate-scale-in">
                  <button
                    onClick={() => setShowPlans(false)}
                    className="absolute top-10 right-10 z-20 text-white/40 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                  <div className="flex flex-col md:flex-row gap-16">
                    {/* Payment Info */}
                    <div className="flex-1 space-y-10">
                      <div>
                        <button
                          onClick={() => setSelectedPlan(null)}
                          className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 hover:text-blue-300 transition-colors mb-6"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                          Change Plan
                        </button>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tight">Complete Payment</h2>
                        <p className="text-blue-100/40 font-bold uppercase tracking-widest mt-2">{selectedPlan.name} Tier Activation</p>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-blue-100/40 uppercase tracking-widest">Bank Name</span>
                            <span className="text-sm font-black text-white">TECH-NEURAL BANK LIMITED</span>
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-white/5">
                            <span className="text-xs font-bold text-blue-100/40 uppercase tracking-widest">Account Number</span>
                            <span className="text-lg font-black text-blue-400 tracking-wider">0123 4567 8910 1112</span>
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-white/5">
                            <span className="text-xs font-bold text-blue-100/40 uppercase tracking-widest">Amount Due</span>
                            <span className="text-xl font-black text-white font-mono">{formatPrice(selectedPlan.priceUSD)}</span>
                          </div>
                        </div>

                        {/* WhatsApp Verification Flow */}
                        <div className="bg-green-500/10 p-6 rounded-3xl border border-green-500/20 text-center space-y-3 group/wa hover:bg-green-500/15 transition-all">
                          <p className="text-[10px] font-black text-green-400 uppercase tracking-widest opacity-80">Verify via WhatsApp</p>
                          <a
                            href="https://wa.me/923000000000"
                            target="_blank"
                            className="flex items-center justify-center gap-3 text-white hover:text-green-400 transition-colors"
                          >
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            <span className="text-sm font-black tracking-tight">+92 300 0000000</span>
                          </a>
                          <p className="text-[10px] text-blue-100/30 uppercase tracking-[0.2em] leading-relaxed">
                            Send receipt screenshot here for instant activation
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* QR Code Area */}
                    <div className="w-full md:w-72 flex flex-col items-center justify-center space-y-8">
                      <div className="w-full aspect-square bg-white p-2 rounded-[3.5rem] shadow-2xl shadow-blue-600/20 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-blue-600/5 rounded-[3rem] animate-pulse group-hover:opacity-0 transition-opacity"></div>
                        <img
                          src="/payment_qr.png"
                          alt="Payment QR Code"
                          className="w-full h-full object-cover rounded-[3rem] relative z-10"
                        />
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Scan to Pay</span>
                        <p className="text-xs font-bold text-blue-100/20 uppercase mt-1">Universal Payment Node</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

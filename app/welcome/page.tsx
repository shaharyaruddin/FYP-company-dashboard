"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ApexOptions } from "apexcharts";

// ApexChart (SSR fix)
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type TokenStatus = {
  tokens: number;
  maxTokens: number;
  plan: string;
  subscription: string;
};

export default function WelcomePage() {
  const router = useRouter();
  const companyId = "696fbb2fad09e2f039554f70";

  const [syncData] = useState({
    success: true,
    message: "Database synced successfully",
    chunks: 15,
  });

  const [tokenStatus, setTokenStatus] = useState<TokenStatus | null>(null);

  useEffect(() => {
    fetch(`http://localhost:1000/api/token-status/${companyId}`)
      .then(res => res.json())
      .then(setTokenStatus)
      .catch(console.error);
  }, []);

  const tokenUsed = tokenStatus
    ? tokenStatus.maxTokens - tokenStatus.tokens
    : 0;

  /* -------------------- Apex Chart Config -------------------- */
  const chartOptions: ApexOptions = {
    labels: ["Used Tokens", "Remaining Tokens"],
    colors: ["#EF4444", "#22C55E"],
    legend: { position: "bottom" },
    dataLabels: { enabled: false },
  };

  const chartSeries = tokenStatus
    ? [tokenUsed, tokenStatus.tokens]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAV */}
      <nav className="bg-white border-b px-8 py-5 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-blue-600 font-medium hover:underline"
        >
          Back to Dashboard
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-14">

        {/* SUCCESS HEADER */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            ✅
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900">
            Sync Completed Successfully
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            Your data is now ready for AI chat & insights
          </p>
        </div>

        {/* STATS GRID */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* CHUNKS */}
          <StatCard
            title="Chunks Processed"
            value={syncData.chunks}
            subtitle={syncData.message}
            color="green"
          />

          {/* TOKEN STATUS */}
          <StatCard
            title="Remaining Tokens"
            value={`${tokenStatus?.tokens ?? "—"} / ${tokenStatus?.maxTokens ?? "—"}`}
            subtitle={`Plan: ${tokenStatus?.plan ?? "-"}`}
            color={tokenStatus?.tokens ? "blue" : "red"}
          />

          {/* CHATBOT STATUS */}
          <StatCard
            title="Chatbot Status"
            value={tokenStatus?.tokens ? "ACTIVE" : "PAUSED"}
            subtitle={tokenStatus?.tokens ? "Ready to chat" : "Recharge required"}
            color={tokenStatus?.tokens ? "green" : "red"}
          />
        </div>

        {/* TOKEN CHART */}
        <div className="bg-white rounded-2xl shadow border p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Token Usage Overview
          </h3>

          {tokenStatus && (
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="donut"
              height={320}
            />
          )}

          {!tokenStatus && (
            <p className="text-gray-500 text-center">Loading token data...</p>
          )}
        </div>

      
      </main>
    </div>
  );
}

/* -------------------- Reusable Card -------------------- */
function StatCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  color: "green" | "blue" | "red";
}) {
  const colorMap = {
    green: "text-green-600 bg-green-100",
    blue: "text-blue-600 bg-blue-100",
    red: "text-red-600 bg-red-100",
  };

  return (
    <div className="bg-white rounded-2xl shadow border p-8">
      <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${colorMap[color]}`}>
        {title}
      </div>
      <p className="text-4xl font-extrabold text-gray-900 mb-2">
        {value}
      </p>
      <p className="text-gray-500">{subtitle}</p>
    </div>
  );
}

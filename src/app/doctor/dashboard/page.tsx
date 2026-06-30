"use client";

import { useEffect, useState } from "react";
import { getSavedSession, apiFetch } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function DoctorDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("Doctor");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalScansVerified: 0,
    pendingVerification: 0,
    aiSuccessRate: 100,
    activePatients: 0,
    diagnosticFindings: {
      normal: 0,
      borderline: 0,
      attentionRequired: 0
    }
  });
  const [chartBars, setChartBars] = useState<any[]>([]);

  useEffect(() => {
    const session = getSavedSession();
    if (!session || session.role !== "doctor") {
      router.push("/");
      return;
    }
    setUserName(session.name);

    async function fetchStats() {
      try {
        const res = await apiFetch("/dashboard/doctor");
        if (res.success && res.data && res.data.dashboard) {
          const d = res.data.dashboard;
          setStats({
            totalScansVerified: d.totalScansVerified || 0,
            pendingVerification: d.pendingVerification || 0,
            aiSuccessRate: d.aiSuccessRate || 0,
            activePatients: d.activePatients || 0,
            diagnosticFindings: {
              normal: d.diagnosticFindings?.normal || 0,
              borderline: d.diagnosticFindings?.borderline || 0,
              attentionRequired: d.diagnosticFindings?.attentionRequired || 0
            }
          });

          const trends = d.scanVolumeTrends || {};
          const trendKeys = Object.keys(trends);
          if (trendKeys.length > 0) {
            const maxVal = Math.max(...(Object.values(trends) as number[]), 1);
            const mappedBars = Object.entries(trends)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .slice(-7)
              .map(([month, count]) => {
                const pct = Math.round(((count as number) / maxVal) * 100);
                return {
                  height: `${Math.max(pct, 15)}%`, // min 15% height for visibility
                  active: month === new Date().toISOString().slice(0, 7),
                  label: month
                };
              });
            setChartBars(mappedBars);
          } else {
            // No scan volume trends in database yet — show empty chart
            setChartBars([]);
          }
        }
      } catch (err) {
        console.error("Failed to load doctor dashboard stats:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, [router]);

  const normalCount = stats.diagnosticFindings.normal || 0;
  const borderlineCount = stats.diagnosticFindings.borderline || 0;
  const attentionCount = stats.diagnosticFindings.attentionRequired || 0;
  const totalFindings = normalCount + borderlineCount + attentionCount || 1;
  const normalPercent = Math.round((normalCount / totalFindings) * 100);
  const borderlinePercent = Math.round((borderlineCount / totalFindings) * 100);
  const attentionPercent = Math.round((attentionCount / totalFindings) * 100);

  return (
    <div className="flex flex-col gap-8">
      {/* Title Header Section */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-texts tracking-tight">Clinical Overview</h2>
        <p className="text-xs md:text-sm text-textt font-medium">
          Welcome back, Dr. {userName}. Real-time performance metrics and AI diagnostic health.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#2170FD] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-[#2170FD]">Loading dashboard data...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards Grid (4 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Total Scans Verified */}
            <div className="bg-fbc border-l-4 border-l-primary rounded-r-2xl p-6 shadow-sm flex flex-col justify-between h-36">
              <span className="text-[10px] font-bold text-textt uppercase tracking-wider">
                Total Scans Verified
              </span>
              <h3 className="text-4xl font-extrabold text-texts tracking-tight mt-2">
                {stats.totalScansVerified.toLocaleString()}
              </h3>
            </div>

            {/* Card 2: Total Pending Verification */}
            <div className="bg-fbc border-l-4 border-l-primary rounded-r-2xl p-6 shadow-sm flex flex-col justify-between h-36">
              <span className="text-[10px] font-bold text-textt uppercase tracking-wider">
                Pending Verification
              </span>
              <h3 className="text-4xl font-extrabold text-texts tracking-tight mt-2">
                {stats.pendingVerification}
              </h3>
            </div>

            {/* Card 3: AI Success Rate */}
            <div className="bg-fbc border-l-4 border-l-primary rounded-r-2xl p-6 shadow-sm flex flex-col justify-between h-36">
              <span className="text-[10px] font-bold text-textt uppercase tracking-wider">
                AI Success Rate
              </span>
              <div className="flex flex-col items-start mt-2">
                <span className="text-4xl font-extrabold text-primary tracking-tight">
                  {stats.aiSuccessRate}%
                </span>
                <div className="w-24 h-1 bg-primary mt-2 rounded-full"></div>
              </div>
            </div>

            {/* Card 4: Active Patients */}
            <div className="bg-fbc border-l-4 border-l-primary rounded-r-2xl p-6 shadow-sm flex flex-col justify-between h-36">
              <span className="text-[10px] font-bold text-textt uppercase tracking-wider">
                Active Patients
              </span>
              <div className="flex flex-col mt-2">
                <h3 className="text-4xl font-extrabold text-texts tracking-tight">
                  {stats.activePatients}
                </h3>
                <p className="text-[10px] text-textt font-semibold mt-1">Currently assigned</p>
              </div>
            </div>
          </div>

          {/* Main Analysis Chart and Diagnostic Findings */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Card: Scan Volume Trends Chart */}
            <div className="lg:col-span-8 bg-fbc p-6 rounded-2xl shadow-sm border border-bgelem/30 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-texts tracking-tight">
                  Scan Volume vs. Verification Trends
                </h3>
                <button className="text-[10px] font-bold text-textt bg-slate-100 hover:bg-slate-200 border border-bgelem/40 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer">
                  Last 30 Days
                </button>
              </div>

              {/* Dashed Chart Container */}
              <div className="border border-dashed border-bgelem/85 rounded-xl p-8 relative flex items-end justify-between h-64 bg-slate-50/20">
                {/* Grid helper lines */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 pointer-events-none opacity-5">
                  <div className="w-full border-t border-texts"></div>
                  <div className="w-full border-t border-texts"></div>
                  <div className="w-full border-t border-texts"></div>
                </div>

                {/* Vertical Bar Columns */}
                <div className="flex items-end justify-around w-full h-full z-10 px-4">
                  {chartBars.length > 0 ? (
                    chartBars.map((bar, idx) => (
                      <div
                        key={idx}
                        className={`w-12 rounded-t-lg transition-all duration-500 hover:opacity-90 ${
                          bar.active ? "bg-primary shadow-lg shadow-primary/20" : "bg-primary/25"
                        }`}
                        style={{ height: bar.height }}
                        title={`${bar.label || "Month"}: ${bar.height}`}
                      ></div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <span className="text-xs font-semibold text-textt">No scan volume data available yet.</span>
                    </div>
                  )}
                </div>

                {/* Floating Visualizer Pill Badge */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div className="bg-white border border-primary/20 text-primary px-5 py-2.5 rounded-full text-xs font-bold shadow-md shadow-primary/5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Interactive Visualization Engine Active
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Diagnostic Findings */}
            <div className="lg:col-span-4 bg-fbc border-l-4 border-l-primary rounded-r-2xl p-6 shadow-sm flex flex-col gap-6 justify-center">
              <h3 className="text-sm font-bold text-texts tracking-tight">
                Diagnostic Findings
              </h3>

              <div className="flex flex-col gap-6">
                {/* Row 1: Normal */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-texts">Normal ({normalCount})</span>
                    <span className="text-textt font-semibold">{normalPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${normalPercent}%` }}></div>
                  </div>
                </div>

                {/* Row 2: Borderline */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-texts">Borderline ({borderlineCount})</span>
                    <span className="text-textt font-semibold">{borderlinePercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary/45 rounded-full" style={{ width: `${borderlinePercent}%` }}></div>
                  </div>
                </div>

                {/* Row 3: Attention Required */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-bold text-rose-600">
                    <span>Attention Required ({attentionCount})</span>
                    <span>{attentionPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${attentionPercent}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

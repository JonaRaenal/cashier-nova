// ============================================
// CashierNova — Dashboard Page
// Ringkasan penjualan, chart, dan transaksi terbaru
// Dengan dark mode, skeleton loading, dan responsive design
// Dependencies: recharts, lucide-react, transactionService
// ============================================

import { useState, useEffect, useMemo } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import transactionService from '../services/transactionService';
import { formatCurrency } from '../utils/formatCurrency';
import formatDate from '../utils/formatDate';
import { SkeletonCard } from '../components/shared/Skeleton';
import useThemeStore from '../store/themeStore';
import CountUp from '../components/shared/CountUp';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chartRange, setChartRange] = useState(7);
  const [loading, setLoading] = useState(true);
  const theme = useThemeStore((s) => s.theme);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  // Fetch data dashboard
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [summaryRes, chartRes] = await Promise.all([
          transactionService.getDashboardSummary(),
          transactionService.getDashboardChart(chartRange),
        ]);
        setSummary(summaryRes.data.data);
        setChartData(chartRes.data.data);
      } catch (err) {
        // Error handled silently — UI shows empty state
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [chartRange]);

  // Summary cards data
  const cards = useMemo(() => [
    {
      title: 'Penjualan Hari Ini',
      value: summary?.today_sales || 0,
      prefix: 'Rp ',
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      title: 'Transaksi Hari Ini',
      value: summary?.today_transactions || 0,
      icon: ShoppingCart,
      color: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Produk Aktif',
      value: summary?.active_products || 0,
      icon: Package,
      color: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      title: 'Stok Menipis',
      value: summary?.low_stock_products || 0,
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    },
  ], [summary]);

  // Chart tooltip & axis colors sesuai tema
  const chartColors = useMemo(() => ({
    grid: theme === 'dark' ? '#2a2d3e' : '#f1f5f9',
    tick: theme === 'dark' ? '#8588a9' : '#64748b',
    tooltipBg: theme === 'dark' ? '#1e2235' : '#1a1f2e',
    tooltipBorder: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'none',
  }), [theme]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100">Dashboard</h1>
        <p className="text-text-secondary dark:text-gray-400 mt-1">Ringkasan aktivitas penjualan Anda</p>
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card, index) => (
            <div
              key={index}
              className="card hover:shadow-card-hover dark:hover:shadow-dark-card-hover hover:-translate-y-1 transition-all duration-300 group cursor-default"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary dark:text-gray-400">{card.title}</p>
                  <p className="text-2xl font-bold text-text-primary dark:text-gray-100 mt-1">
                    <CountUp end={card.value} prefix={card.prefix} duration={1000} />
                  </p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <card.icon size={20} className={card.color} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              <h2 className="font-semibold text-text-primary dark:text-gray-100">Grafik Penjualan</h2>
            </div>
            <div className="flex gap-1 bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
              {[7, 30].map((range) => (
                <button
                  key={range}
                  onClick={() => setChartRange(range)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                    chartRange === range
                      ? 'bg-white dark:bg-dark-600 text-text-primary dark:text-gray-100 shadow-sm'
                      : 'text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-gray-200'
                  }`}
                >
                  {range} Hari
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="animate-pulse flex items-end gap-2 h-[280px] pt-8">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 skeleton rounded-t"
                  style={{ height: `${30 + Math.random() * 60}%` }}
                />
              ))}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd8a3" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2dd8a3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: chartColors.tick }}
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return `${d.getDate()}/${d.getMonth() + 1}`;
                  }}
                />
                <YAxis
                  hide={isMobile}
                  tick={{ fontSize: 11, fill: chartColors.tick }}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: chartColors.tooltipBg,
                    border: chartColors.tooltipBorder,
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [formatCurrency(value), 'Penjualan']}
                  labelFormatter={(label) => formatDate(label, { day: '2-digit', month: 'long', year: 'numeric' })}
                />
                <Area
                  type="monotone"
                  dataKey="total_sales"
                  stroke="#2dd8a3"
                  strokeWidth={2.5}
                  fill="url(#colorSales)"
                  dot={{ fill: '#2dd8a3', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#2dd8a3' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <ArrowUpRight size={20} className="text-primary" />
            <h2 className="font-semibold text-text-primary dark:text-gray-100">Transaksi Terbaru</h2>
          </div>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between py-3 border-b border-gray-50 dark:border-dark-700 last:border-0">
                  <div>
                    <div className="skeleton h-4 w-28 mb-1.5 rounded" />
                    <div className="skeleton h-3 w-20 rounded" />
                  </div>
                  <div className="text-right">
                    <div className="skeleton h-4 w-20 mb-1.5 rounded" />
                    <div className="skeleton h-3 w-12 rounded ml-auto" />
                  </div>
                </div>
              ))
            ) : summary?.recent_transactions?.length > 0 ? (
              summary.recent_transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-dark-700 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary dark:text-gray-200">{tx.invoice_number}</p>
                    <p className="text-xs text-text-secondary dark:text-gray-500 mt-0.5">
                      {tx.cashier_name} · {formatDate(tx.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-primary dark:text-gray-200">
                      {formatCurrency(tx.grand_total)}
                    </p>
                    <span className="text-xs text-text-secondary dark:text-gray-500 capitalize">{tx.payment_method}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-secondary dark:text-gray-400 text-center py-8">
                Belum ada transaksi hari ini
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
